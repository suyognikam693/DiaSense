# ml_backend/main.py
# Run this with: uvicorn main:app --reload --port 8000
from fastapi import FastAPI, HTTPException
import xgboost as xgb
import shap
import pandas as pd
import pickle
import contextlib
import traceback

model = None
explainer = None
# scaler = None # UNCOMMENT THIS WHEN YOU HAVE YOUR SCALER

# The exact 21 features in the exact order your XGBoost model expects
FEATURE_COLUMNS = [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke", 
    "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies", 
    "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth", 
    "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education", "Income", "FamilyDiabetes"
]


def parse_family_diabetes(value):
    if value in (None, "", 0, "0"):
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)

    normalized = str(value).strip().lower()
    if normalized in {"none", "no", "0", "false"}:
        return 0.0
    if normalized in {"one", "one parent/sibling", "single", "1"}:
        return 1.0
    if normalized in {"both", "both parents/multiple relatives", "multiple", "2"}:
        return 2.0

    return 0.0

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    global model, explainer #, scaler
    
    # 1. Load the model
    with open("xgboost_model.pkl", "rb") as f:
        model = pickle.load(f)
        # Compatibility: some pickled XGBClassifier objects saved with
        # older/newer xgboost versions may be missing sklearn-wrapper
        # attributes expected by `predict_proba()` and scikit-learn API.
        # Set sensible defaults when missing to avoid AttributeError.
        try:
            if not hasattr(model, 'use_label_encoder'):
                setattr(model, 'use_label_encoder', False)
        except Exception:
            pass
        
    # 2. Load your scaler (REQUIRED because your training data was scaled)
    # with open("scaler.pkl", "rb") as f:
    #     scaler = pickle.load(f)

    # 3. Load background data and initialize SHAP
    bg_data = pd.read_csv("xre_train.csv").head(100) # Use 100 rows for speed
    explainer = shap.TreeExplainer(model, data=bg_data, model_output="probability")
    
    print("FastAPI: Model and SHAP Explainer loaded!")
    yield

app = FastAPI(lifespan=lifespan)

@app.post("/predict")
async def predict_risk(data: dict):
    try:
        # 1. Extract and map ONLY the 21 required features from the React payload
        # Extra fields like sleepHours, sugarIntake are safely ignored here.
        raw_features = {
            "HighBP": float(data.get("highBP", 0)),
            "HighChol": float(data.get("highChol", 0)),
            "CholCheck": float(data.get("cholCheck", 0)),
            "BMI": float(data.get("bmi", 25.0)),
            "Smoker": float(data.get("smoker", 0)),
            "Stroke": float(data.get("stroke", 0)),
            "HeartDiseaseorAttack": float(data.get("heartDiseaseOrAttack", 0)),
            "PhysActivity": float(data.get("physicalActivity", 0)),
            "Fruits": float(data.get("fruits", 0)),
            "Veggies": float(data.get("veggies", 0)),
            "HvyAlcoholConsump": float(data.get("heavyAlcoholConsump", 0)),
            "AnyHealthcare": float(data.get("healthcareCoverage", 0)),
            "NoDocbcCost": float(data.get("noDocBcCost", 0)),
            "GenHlth": float(data.get("genHealth", 3)),
            "MentHlth": float(data.get("mentalHealth", 0)),
            "PhysHlth": float(data.get("physHealth", 0)),
            "DiffWalk": float(data.get("diffWalk", 0)),
            "Sex": float(data.get("sex", 0)),
            "Age": float(data.get("ageCategory", 1)), 
            "Education": float(data.get("educationLevel", 4)),
            "Income": float(data.get("incomeLevel", 5)),
            "FamilyDiabetes": parse_family_diabetes(data.get("familyHistory", 0))
        }

        # Create DataFrame in exact order
        df_raw = pd.DataFrame([raw_features], columns=FEATURE_COLUMNS)

        # 2. SCALE THE DATA (Uncomment when scaler is ready)
        # df_scaled_array = scaler.transform(df_raw)
        # df_scaled = pd.DataFrame(df_scaled_array, columns=FEATURE_COLUMNS)
        
        # NOTE: For now, I am passing df_raw. You MUST change this to df_scaled 
        # once you add your scaler.pkl, otherwise predictions will be wrong!
        df_final = df_raw 

        # 3. Predict Probability (robust to pickled model shape/version mismatches)
        def predict_proba_safe(mdl, df):
            # Prefer sklearn wrapper if available
            try:
                proba = mdl.predict_proba(df)
                return proba
            except Exception:
                # Fallback: use underlying Booster/Booster-like object
                try:
                    booster = None
                    if hasattr(mdl, 'get_booster'):
                        booster = mdl.get_booster()
                    elif hasattr(mdl, 'booster_'):
                        booster = mdl.booster_
                    else:
                        booster = mdl

                    dmat = xgb.DMatrix(df)
                    preds = booster.predict(dmat)
                    # preds may be shape (n,) probabilities for binary
                    import numpy as _np
                    preds = _np.array(preds)
                    if preds.ndim == 1:
                        # convert to [[1-p, p], ...]
                        proba = _np.vstack([1 - preds, preds]).T
                    else:
                        proba = preds
                    return proba
                except Exception:
                    raise

        proba_array = predict_proba_safe(model, df_final)
        pred_proba = float(proba_array[0][1])
        
        # 4. Calculate SHAP Values
        shap_vals = explainer(df_final)
        contribs = shap_vals.values[0, :, 1] if len(shap_vals.values.shape) == 3 else shap_vals.values[0]

        # 5. Format SHAP output for React
        shap_list = []
        for i, col in enumerate(FEATURE_COLUMNS):
            val = float(contribs[i])
            shap_list.append({
                "feature": col,
                "contribution": val,
                "impact": "Increases Risk" if val > 0 else "Decreases Risk",
                "magnitude": abs(val)
            })

        shap_list.sort(key=lambda x: x["magnitude"], reverse=True)

        category = "Low Risk"
        if pred_proba > 0.4: category = "Moderate Risk"
        if pred_proba > 0.7: category = "High Risk"

        return {
            "risk_score": round(pred_proba * 100, 2),
            "risk_category": category,
            "top_factors": shap_list[:5] # Send top 5 factors
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))