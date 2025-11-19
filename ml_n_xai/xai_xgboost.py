# ===== Imports =====
import os
import pickle
import argparse

import numpy as np
import pandas as pd

import shap
import xgboost as xgb

# ===== Argument Parsing =====
parser = argparse.ArgumentParser(description="Explain XGBoost predictions with SHAP")
parser.add_argument("--model-path", type=str, default="xgboost_model.pkl")
parser.add_argument("--xtrain", type=str, default="xre_train.csv")
parser.add_argument("--xtest", type=str, default="xre_test.csv")
parser.add_argument("--output-dir", type=str, default=".")
parser.add_argument("--limit", type=int, default=None, help="Use only N rows from X_test")
parser.add_argument("--bg-limit", type=int, default=None, help="Use only N rows from X_train as background")
parser.add_argument("--random", action="store_true", help="Randomly sample rows instead of head()")
parser.add_argument("--seed", type=int, default=42)
parser.add_argument("--sample-index", type=int, default=0)
parser.add_argument("--demo", action="store_true", help="Run a tiny synthetic demo without external files")
parser.add_argument("--force-generic", action="store_true", help="Force model-agnostic SHAP Explainer")
# NEW: persistence options
parser.add_argument("--save-explainer", type=str, default=None, help="Path to save a reusable xAI explainer bundle (*.pkl)")
parser.add_argument("--load-explainer", type=str, default=None, help="Path to load a reusable xAI explainer bundle (*.pkl)")
parser.add_argument("--save-bg-limit", type=int, default=256, help="Max rows to embed as background in the explainer bundle (for generic)")
parser.add_argument("--save-bg-random", action="store_true", help="Randomly sample background rows when saving bundle")
args = parser.parse_args()

# ===== Data & Model Loading =====
if args.demo:
    # Synthetic classification demo
    from sklearn.datasets import make_classification
    from sklearn.model_selection import train_test_split

    X, y = make_classification(
        n_samples=300, n_features=10, n_informative=6, n_redundant=2, random_state=args.seed
    )
    X_train_arr, X_test_arr, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=args.seed)
    feature_columns = [f"f{i}" for i in range(X.shape[1])]
    X_train = pd.DataFrame(X_train_arr, columns=feature_columns)
    X_test = pd.DataFrame(X_test_arr, columns=feature_columns)
    model = xgb.XGBClassifier(
        n_estimators=80, max_depth=3, learning_rate=0.2, subsample=0.9,
        colsample_bytree=0.9, random_state=args.seed, n_jobs=1, eval_metric="logloss"
    )
    model.fit(X_train, y_train)
else:
    # Load model from file
    with open(args.model_path, "rb") as f:
        model = pickle.load(f)
    # Load data from CSVs
    X_train = pd.read_csv(args.xtrain)
    X_test = pd.read_csv(args.xtest)

# ===== Optional Sampling/Limiting =====
rng = np.random.RandomState(args.seed)
def maybe_limit(df, n):
    if n is None or n <= 0 or len(df) <= n:
        return df
    if args.random:
        return df.sample(n=n, random_state=args.seed)
    return df.head(n)

X_train = maybe_limit(X_train, args.bg_limit)
X_test = maybe_limit(X_test, args.limit)

# Ensure output directory exists
os.makedirs(args.output_dir, exist_ok=True)

# ===== Helper Functions =====
def is_classification(model):
    return hasattr(model, "predict_proba")

def build_explainer(model, X_background, force_generic=False):
    # Prefer TreeExplainer for XGBoost; fallback to model-agnostic Explainer
    if force_generic:
        return shap.Explainer(
            model.predict_proba if is_classification(model) else model.predict,
            X_background
        )

    booster = None
    try:
        booster = model.get_booster()
    except Exception:
        if isinstance(model, xgb.Booster):
            booster = model

    try:
        if booster is not None:
            if is_classification(model):
                return shap.TreeExplainer(booster, model_output="probability")
            return shap.TreeExplainer(booster)
        else:
            if is_classification(model):
                return shap.TreeExplainer(model, model_output="probability")
            return shap.TreeExplainer(model)
    except Exception as e:
        print(f"[info] SHAP TreeExplainer failed: {e}")
        print("[info] Falling back to model-agnostic SHAP Explainer.")
        return shap.Explainer(
            model.predict_proba if is_classification(model) else model.predict, # type: ignore
            X_background
        ) # type: ignore

def ensure_index(idx, n):
    if idx < 0 or idx >= n:
        raise IndexError(f"sample_index {idx} out of range [0, {n-1}]")

# NEW: background sampler for saving compact bundles
def _sample_background(df: pd.DataFrame, n: int, seed: int, random_pick: bool) -> np.ndarray:
    if df is None or len(df) == 0:
        return np.empty((0, 0))
    if n is None or n <= 0 or len(df) <= n:
        bg = df
    else:
        bg = df.sample(n=n, random_state=seed) if random_pick else df.head(n)
    return bg.to_numpy(copy=True)

# NEW: create a portable explainer bundle (no training data dependency at runtime)
def _make_explainer_bundle(model, X_train: pd.DataFrame, explainer_type: str, feature_names):
    bundle = {
        "type": explainer_type,  # "tree" or "generic"
        "is_classification": bool(is_classification(model)),
        "model_output": "probability" if is_classification(model) else "raw",
        "feature_names": list(feature_names) if feature_names is not None else None,
        "masker_data": None,  # only for generic
    }
    if explainer_type == "generic":
        # embed a compact background so later runs don't need training data
        bundle["masker_data"] = _sample_background(
            X_train, n=args.save_bg_limit, seed=args.seed, random_pick=args.save_bg_random
        )
    return bundle

# NEW: rebuild explainer from bundle + current model
def _reconstruct_explainer(bundle, model):
    expl_type = bundle.get("type", "tree")
    if expl_type == "tree" and not args.force_generic:
        return shap.TreeExplainer(model, model_output=bundle.get("model_output", None)), {"source": "loaded", "type": "tree", "bg_rows": 0}
    # generic: requires a masker/background (we stored a compact sample)
    masker_data = bundle.get("masker_data", None)
    if masker_data is None or (isinstance(masker_data, np.ndarray) and masker_data.size == 0):
        # fallback to model-only tree explainer if background missing
        return shap.TreeExplainer(model, model_output=bundle.get("model_output", None)), {"source": "loaded_fallback_tree", "type": "tree", "bg_rows": 0}
    masker = shap.maskers.Independent(masker_data) # type: ignore
    f = model.predict_proba if bundle.get("is_classification", False) else model.predict
    expl = shap.Explainer(f, masker)
    return expl, {"source": "loaded", "type": "generic", "bg_rows": int(masker_data.shape[0])}

# NEW: unified getter that loads if available, else builds and optionally saves
def get_explainer(model, X_train: pd.DataFrame):
    # Try loading prebuilt bundle
    if args.load_explainer and os.path.isfile(args.load_explainer):
        try:
            with open(args.load_explainer, "rb") as fh:
                bundle = pickle.load(fh)
            explainer, meta = _reconstruct_explainer(bundle, model)
            meta["bundle_path"] = args.load_explainer
            return explainer, meta
        except Exception as e:
            print(f"[warn] Failed to load explainer bundle '{args.load_explainer}': {e}. Will build anew.")

    # Build now
    explainer = build_explainer(model, X_train, force_generic=args.force_generic)
    meta = {"source": "built", "type": "generic" if args.force_generic else "tree", "bg_rows": int(len(X_train) if X_train is not None else 0)}

    # Optionally save bundle for reuse
    if args.save_explainer:
        try:
            bundle = _make_explainer_bundle(
                model=model,
                X_train=X_train,
                explainer_type=("generic" if args.force_generic else "tree"),
                feature_names=(X_train.columns if isinstance(X_train, pd.DataFrame) else None),
            )
            with open(args.save_explainer, "wb") as fh:
                pickle.dump(bundle, fh)
            meta["bundle_saved_to"] = args.save_explainer
            if bundle.get("masker_data", None) is not None:
                meta["bundle_bg_rows"] = int(bundle["masker_data"].shape[0])
        except Exception as e:
            print(f"[warn] Failed to save explainer bundle to '{args.save_explainer}': {e}")

    return explainer, meta

# ===== SHAP Explanation =====
explainer, expl_meta = get_explainer(model, X_train)
shap_values = explainer(X_test)

# ===== Local Explanation for One Sample =====
sample_index = args.sample_index
ensure_index(sample_index, len(X_test))

# Predict to choose which output to explain (for classification)
y_pred_proba = None
pred_label = None
if is_classification(model):
    try:
        y_pred_proba = model.predict_proba(X_test)
        pred_label = int(np.argmax(y_pred_proba[sample_index]))
    except Exception:
        y_pred_proba = None

# ===== Prepare per-class SHAP vectors (robust layout handling) =====
def _safe_float(v):
    if isinstance(v, str):
        v = v.strip().strip("[]")
        try:
            return float(v)
        except Exception:
            return v
    return v

vals_raw = shap_values.values
base_raw = shap_values.base_values
# Normalize base values shape
if isinstance(base_raw, np.ndarray):
    if base_raw.ndim == 1:
        base_values_raw = base_raw
    elif base_raw.ndim == 2:
        base_values_raw = base_raw[sample_index]
    elif base_raw.ndim == 3:
        base_values_raw = base_raw[sample_index]
else:
    base_values_raw = np.atleast_1d(base_raw)

n_classes_model = None
if is_classification(model):
    try:
        n_classes_model = model.predict_proba(X_test.iloc[:1]).shape[1]
    except Exception:
        n_classes_model = None

layout_info = {}
if vals_raw.ndim == 3 and n_classes_model: # pyright: ignore[reportAttributeAccessIssue]
    s = vals_raw.shape # pyright: ignore[reportAttributeAccessIssue]
    # Possible layouts: (n_samples, n_classes, n_features) or (n_samples, n_features, n_classes)
    if s[1] == n_classes_model:  # (samples, classes, features)
        per_sample = vals_raw[sample_index]              # (n_classes, n_features)
        shap_class_vals = per_sample
        layout_info["layout"] = "samples,classes,features"
    elif s[2] == n_classes_model:  # (samples, features, classes)
        per_sample = vals_raw[sample_index]              # (n_features, n_classes)
        shap_class_vals = per_sample.T                   # (n_classes, n_features)
        layout_info["layout"] = "samples,features,classes"
    else:
        # Fallback treat as single vector (positive class)
        shap_class_vals = None
        layout_info["layout"] = "unrecognized_3d_fallback_single"
else:
    # 2D or other: treat as single vector positive class for binary / single-output
    shap_class_vals = None
    layout_info["layout"] = f"{vals_raw.ndim}d_single_output" # type: ignore

if shap_class_vals is None:
    # Binary collapsed: single vector explains probability/logit of positive class
    vec = vals_raw[sample_index] if vals_raw.ndim >= 2 else vals_raw # type: ignore
    vec = np.asarray(vec)
    shap_class_vals = np.vstack([-vec, vec])  # class0, class1
    # Base value handling
    base_val = float(np.atleast_1d(base_values_raw)[sample_index] if base_values_raw.shape[0] == len(X_test) else np.atleast_1d(base_values_raw)[0])
    base_class_vals = np.array([1 - base_val, base_val])
    n_classes = 2
else:
    n_classes = shap_class_vals.shape[0]
    # Align base values
    b = np.atleast_1d(base_values_raw)
    if b.ndim == 1 and len(b) == n_classes:
        base_class_vals = b
    elif b.ndim == 1:
        # reuse same base for each class if single provided
        base_class_vals = np.repeat(b[0], n_classes)
    else:
        base_class_vals = b[:n_classes]

# ===== Select focal classes =====
if n_classes == 2:
    class_order = [0, 1]
    predicted_probabilities = y_pred_proba[sample_index] if y_pred_proba is not None else np.array([
        1 - (base_class_vals[1] + np.sum(shap_class_vals[1])), base_class_vals[1] + np.sum(shap_class_vals[1])
    ])
else:
    class_order = list(range(n_classes))
    predicted_probabilities = y_pred_proba[sample_index] if y_pred_proba is not None else np.array([
        base_class_vals[c] + np.sum(shap_class_vals[c]) for c in class_order
    ])

# ===== Assemble feature contribution table =====
feature_names = X_test.columns.tolist()
row = X_test.iloc[sample_index]
df_rows = []
for i, feat in enumerate(feature_names):
    raw_val = _safe_float(row.iloc[i])
    df_rows.append({
        "feature": feat,
        "value": raw_val,
        "towards_class_1": float(shap_class_vals[min(1, n_classes - 1), i]),
        "towards_class_0": float(shap_class_vals[0, i]),
        "abs_for_class_1": abs(float(shap_class_vals[min(1, n_classes - 1), i])),
        "abs_for_class_0": abs(float(shap_class_vals[0, i]))
    })

df = pd.DataFrame(df_rows)

# Rankings & percentages (for class 1 focus)
df = df.sort_values("abs_for_class_1", ascending=False)
df["rank_class_1"] = np.arange(1, len(df)+1)
total_abs_1 = df["abs_for_class_1"].sum()
df["pct_abs_1"] = (df["abs_for_class_1"] / total_abs_1 * 100).round(3)
df["direction_class_1"] = np.where(df["towards_class_1"] > 0, "supports class 1", "pushes toward class 0")
df["direction_class_0"] = np.where(df["towards_class_0"] > 0, "supports class 0", "pushes toward class 1")

# ===== Consistency Checks =====
sum_contrib_class1 = float(np.sum(shap_class_vals[min(1, n_classes-1)]))
reconstructed_prob_class1 = float(base_class_vals[min(1, n_classes-1)] + sum_contrib_class1)
if n_classes >= 2:
    sum_contrib_class0 = float(np.sum(shap_class_vals[0]))
    reconstructed_prob_class0 = float(base_class_vals[0] + sum_contrib_class0)
else:
    sum_contrib_class0 = -sum_contrib_class1
    reconstructed_prob_class0 = 1 - reconstructed_prob_class1

# ===== Narrative Sections =====
lines = []
# Add explainer provenance
lines.append("Explainer info:")
lines.append(f"- source: {expl_meta.get('source')}")
lines.append(f"- type: {expl_meta.get('type')}")
if "bundle_path" in expl_meta:
    lines.append(f"- loaded_from: {expl_meta['bundle_path']}")
if "bundle_saved_to" in expl_meta:
    lines.append(f"- saved_to: {expl_meta['bundle_saved_to']}")
if "bundle_bg_rows" in expl_meta or "bg_rows" in expl_meta:
    lines.append(f"- background_rows: {expl_meta.get('bundle_bg_rows', expl_meta.get('bg_rows', 0))}")
lines.append("")

lines.append(f"Sample index: {sample_index}")
if y_pred_proba is not None:
    lines.append("Predicted probabilities per class:")
    for c in class_order:
        lines.append(f"  Class {c}: {predicted_probabilities[c]:.6f}")
    lines.append(f"Predicted class: {pred_label}")
else:
    lines.append("Model probabilities unavailable (regression or predict_proba failed). Using SHAP reconstruction.")
    for c in class_order:
        lines.append(f"  Reconstructed class {c} probability ≈ {predicted_probabilities[c]:.6f}")

lines.append("")
lines.append("Base (expected) probabilities (prior before seeing this sample's feature values):")
for c in class_order[:2] if n_classes >= 2 else class_order:
    lines.append(f"  Class {c} base: {base_class_vals[c]:.6f}")

lines.append("")
lines.append("Reconstruction (base + sum(feature contributions)) for focal classes:")
lines.append(f"  Class 1: {reconstructed_prob_class1:.6f} (base {base_class_vals[min(1,n_classes-1)]:.6f} + sum {sum_contrib_class1:+.6f})")
lines.append(f"  Class 0: {reconstructed_prob_class0:.6f} (base {base_class_vals[0]:.6f} + sum {sum_contrib_class0:+.6f})")
lines.append("Note: For binary models with a single SHAP vector, class 0 contributions are inferred as opposites.")

lines.append("")
lines.append("Per-feature contributions (sorted by absolute impact toward class 1):")
lines.append("Columns: rank | feature | raw_value | shap(class1) | shap(class0) | direction_class1 | direction_class0 | abs(class1) | %abs_total(class1)")
for _, r in df.iterrows():
    lines.append(
        f"{int(r['rank_class_1']):02d} | {r['feature']} | {r['value']} | "
        f"{r['towards_class_1']:+.6f} | {r['towards_class_0']:+.6f} | "
        f"{r['direction_class_1']} | {r['direction_class_0']} | "
        f"{r['abs_for_class_1']:.6f} | {r['pct_abs_1']:.3f}%"
    )

lines.append("")
lines.append("Cumulative contribution coverage (class 1 focus):")
cum = df["abs_for_class_1"].cumsum() / total_abs_1 * 100
for k in [1,3,5,10,len(df)]:
    lines.append(f"  Top {k:2d} features explain {cum.iloc[k-1]:.2f}% of total absolute impact.")

lines.append("")
lines.append("Interpretation guide:")
lines.append("- SHAP values > 0 for class 1 increase probability of class 1 relative to base.")
lines.append("- SHAP values < 0 for class 1 decrease probability of class 1 (thus favor class 0).")
lines.append("- Magnitude indicates strength; percentage column shows relative share of total influence.")
lines.append("- Direction columns summarize push toward each class.")
lines.append("- Base probability is the model's expectation before seeing this specific feature vector.")

lines.append("")
lines.append("Feature importance narrative (top 5 toward class 1):")
for _, r in df.head(5).iterrows():
    direction = "raising" if r["towards_class_1"] > 0 else "lowering"
    lines.append(
        f"- {r['feature']} (value={r['value']}) is {direction} class 1 probability by {r['towards_class_1']:+.6f} "
        f"(rank {int(r['rank_class_1'])}, {r['pct_abs_1']:.2f}% of total impact)."
    )

lines.append("")
lines.append("Sanity checks:")
lines.append(f"- Sum of class 1 SHAP contributions: {sum_contrib_class1:+.6f}")
lines.append(f"- (Base class 1 + sum) matches reconstructed probability: {reconstructed_prob_class1:.6f}")
if n_classes == 2:
    lines.append(f"- Class 0 probability ≈ 1 - class 1 probability: {1 - reconstructed_prob_class1:.6f} (compare {reconstructed_prob_class0:.6f})")
lines.append(f"SHAP value layout detected: {layout_info.get('layout')}")

# ===== Write Explanation File =====
text_path = os.path.join(
    args.output_dir,
    f"shap_explanation_detailed_sample_{sample_index}.txt"
)
with open(text_path, "w", encoding="utf-8") as fh:
    fh.write("\n".join(lines))

# ===== Output Summary =====
print("SHAP detailed explanation saved:")
print(f" - {text_path}")
if expl_meta.get("bundle_saved_to"):
    print(f"Reusable explainer bundle saved: {expl_meta['bundle_saved_to']}")
if expl_meta.get("bundle_path"):
    print(f"Reusable explainer bundle loaded: {expl_meta['bundle_path']}")
print(f"Layout used: {layout_info.get('layout')}")
