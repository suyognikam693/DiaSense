# DiaSense — Interview Prep Sheet

---

## 1. Project Overview

- **What**: AI-driven diabetes risk screening app using non-clinical data (lifestyle, sleep, socioeconomic factors)
- **Goal**: Enable scalable, low-cost early screening without invasive lab tests — targeting resource-limited settings
- **Frontend**: React 18 + Vite SPA, ShadCN/Radix UI components, Recharts for visualization
- **ML Backend**: XGBoost classifier with SHAP explainability (Python, standalone script)
- **Risk Engine**: Client-side weighted scoring algorithm (0–100 scale → 4 risk levels)
- **Key Modules**: 5-step Risk Assessment, Diet Planner (7-day plans), Food Tracker (20-item DB, GI index), Doctor Finder, Profile Management
- **Design**: Mobile-first, Figma-to-code workflow, ShadCN + Tailwind + custom CSS
- **No backend server** — all data hardcoded; auth is mock; state via `useState` only

### Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, TypeScript/JSX |
| UI Library | ShadCN (Radix UI), Lucide Icons |
| Styling | TailwindCSS + custom CSS |
| Charts | Recharts (BarChart) |
| ML Model | XGBoost (Python, pickle) |
| XAI | SHAP (TreeExplainer + fallback) |
| Forms | react-hook-form |
| Notifications | Sonner (toast) |

### Architecture (Simplified)

```
App.jsx (auth gate)
  └─ LoginPage (mock auth)
  └─ Dashboard (bottom nav → conditional rendering)
       ├─ HomePage (stats, tips, quick actions)
       ├─ RiskAssessmentForm (5-step → RiskMeter + AdviceSection)
       ├─ DietPlannerPage (meal plans, recipes, tracking + FoodTracker)
       ├─ ContactDoctorPage (search, filter, book)
       └─ ProfilePage (edit profile, settings, logout)

ML Pipeline (standalone):
  xai_xgboost.py → XGBoost model + SHAP → per-feature explanations
```

### Challenges & Solutions

| Challenge | Solution |
|---|---|
| No backend/DB available | Hardcoded data + client-side risk calc; designed for future API integration |
| Explaining ML predictions | SHAP TreeExplainer with fallback to model-agnostic explainer |
| Multi-step form UX | Stepper with per-step validation, animated transitions |
| Nutrition tracking accuracy | Built 20-item food DB with GI index, quantity-based recalculation |
| Mobile-first responsive design | Figma-to-code, ShadCN components, bottom nav pattern |

---

## 2. Interview Questions & Answers

**Q1: What does DiaSense do?**
AI-powered diabetes risk screener using non-clinical inputs (age, BMI, lifestyle, sleep, stress). Users complete a 5-step assessment → get a 0–100 risk score with personalized advice. Also includes diet planning, food tracking, and doctor discovery.

**Q2: Why non-clinical data only?**
Eliminates need for lab tests/blood work, enabling screening in areas with limited healthcare infrastructure. Makes early detection accessible and scalable.

**Q3: How does the risk scoring algorithm work?**
Weighted point system: age(+20), BMI(+25), BP(+20), smoking(+15), exercise(+15), family history(+20), diet(+10), sleep(+10), stress(+10), waist(+10). Sum clamped to 0–100. Categorized: Low(<30), Moderate(30–60), High(60–80), Very High(>80).

**Q4: Why client-side risk calculation instead of server?**
Current prototype has no backend. In production, the XGBoost model would serve predictions via API. Client-side calc serves as a fallback and instant-feedback mechanism.

**Q5: Explain the XGBoost + SHAP pipeline.**
XGBoost binary classifier trained on ~70K samples. SHAP TreeExplainer computes per-feature contributions to prediction probability. Supports explainer persistence (save/load bundles) and handles both 2D/3D SHAP value layouts.

**Q6: Why XGBoost over deep learning?**
Tabular data → XGBoost outperforms NNs. Faster training, built-in feature importance, better SHAP integration, lower compute requirement for deployment.

**Q7: How would you add real authentication?**
JWT-based auth: signup → hash password (bcrypt) → store in DB → login returns JWT → attach token to API headers → middleware validates on server. Add refresh tokens + OAuth for social logins.

**Q8: How would you design the database?**
Users table (id, email, password_hash, profile). Assessments table (user_id, form_data, risk_score, timestamp). Meals table (user_id, food_items, date). Appointments table (user_id, doctor_id, datetime, status).

**Q9: How is navigation handled without React Router?**
Custom `useNavigation` hook → `useState('home')` → Dashboard conditionally renders components based on `activeView`. Simple for a mobile-first SPA with no deep-linking needs.

**Q10: How would you make this scalable?**
Add Node.js/Express or FastAPI backend. PostgreSQL for data. Redis for caching. Serve XGBoost via Flask/FastAPI endpoint. Containerize with Docker. Deploy on AWS/GCP with load balancer.

**Q11: What edge cases does the risk assessment handle?**
Missing optional fields (defaults used). BMI extremes (capped scoring). Sleep outliers (<6h or >9h flagged). Gender-specific waist thresholds (102cm male, 88cm female).

**Q12: How does SHAP explainability help users?**
Shows which factors contribute most to their risk (e.g., "high BMI raised your risk by 15%"). Builds trust, aids doctor consultations, motivates lifestyle changes.

**Q13: Security concerns in current design?**
No real auth (mock login). No HTTPS enforcement. Hardcoded data (no injection risk). In production: add JWT, HTTPS, input sanitization, rate limiting, CORS, data encryption at rest.

**Q14: How is the Diet Planner designed?**
3 tabs: Meal Plan (7-day, 4 meals/day with macros), Recipes (8 diabetes-friendly, filterable by category), Tracking (log meals, water intake, calorie chart via Recharts).

**Q15: What would you improve?**
Real backend + DB. Integrate XGBoost model via API. Add React Router for deep links. Replace hardcoded data with APIs. Add data persistence. Implement real auth. Add PWA support for offline use.

**Q16: Why ShadCN/Radix UI?**
Accessible by default (WAI-ARIA). Unstyled primitives → full design control. Composable. Works well with Tailwind. Production-ready with minimal bundle size.

**Q17: How does the Food Tracker work?**
20-item hardcoded food DB with per-100g nutrition + GI index. User searches → selects item → sets quantity → nutrition auto-calculated → logged to tracked meals array.

**Q18: How would you deploy this?**
`vite build` → static assets. Deploy to Vercel/Netlify. ML model → separate FastAPI service on AWS EC2/Lambda. CI/CD via GitHub Actions.

**Q19: How did you handle Figma-to-code?**
Figma export → pixel-perfect component (`FigmaHomepage.jsx`) with absolute positioning. Then rebuilt key components using ShadCN for maintainability and responsiveness.

**Q20: What testing strategy would you use?**
Unit tests (Jest/Vitest) for risk calculation logic. Component tests (React Testing Library). E2E tests (Cypress/Playwright) for assessment flow. Model validation: accuracy, F1, AUC-ROC on test set.

---

## 3. Preparation Checklist

| Topic | Key Areas |
|---|---|
| **React** | Hooks (useState, useEffect), conditional rendering, component composition, props drilling |
| **State Mgmt** | Why useState suffices here; when to use Context/Redux |
| **Auth** | JWT flow, bcrypt, OAuth 2.0, session vs token |
| **Database** | Schema design, normalization, indexing, SQL vs NoSQL |
| **APIs** | REST design, status codes, middleware, CORS |
| **ML/AI** | XGBoost basics, SHAP values, feature importance, bias/fairness |
| **Deployment** | Vite build, static hosting, Docker, CI/CD |
| **System Design** | Monolith vs microservices, caching, load balancing, DB scaling |
| **Security** | OWASP top 10, XSS, CSRF, input validation, HTTPS |
| **Project-Specific** | Risk scoring algorithm, SHAP pipeline, diet planner data model, Figma workflow |

---

## 4. Quick Revision Sheet

### Key Views/Routes

| View | Component | Purpose |
|---|---|---|
| Login/Signup | `LoginPage.jsx` | Mock auth → creates user object |
| Home | `HomePage.jsx` | Stats overview, health tips, quick actions |
| Assessment | `RiskAssessmentForm.jsx` | 5-step form → risk score (0–100) |
| Results | `RiskMeter.jsx` + `AdviceSection.jsx` | SVG gauge + categorized advice |
| Diet | `DietPlannerPage.tsx` | Meal plans, recipes, tracking |
| Food Log | `FoodTracker.tsx` | Search food DB, log meals |
| Doctor | `ContactDoctorPage.jsx` | Search/filter/book doctors |
| Profile | `ProfilePage.jsx` | Edit profile, BMI calc, settings |

### Risk Score Algorithm

```
Factors: age, BMI, BP, smoking, exercise, familyHistory, diet, sleep, stress, waist
Max possible: ~170 (clamped to 100)
Levels: Low(<30) | Moderate(30-60) | High(60-80) | Very High(>80)
```

### ML Pipeline Summary

```
Data: xre_train.csv (~70K rows) → XGBoost classifier → xgboost_model.pkl
XAI:  SHAP TreeExplainer → per-feature SHAP values → ranked contributions
Args: --model-path, --xtrain, --xtest, --limit, --sample-index, --save-explainer
```

### Key Libraries

| Library | Purpose |
|---|---|
| `react` 18 | UI framework |
| `vite` 6.3 | Build tool |
| `@radix-ui/*` | Accessible UI primitives |
| `recharts` | Bar charts for calorie tracking |
| `lucide-react` | Icons |
| `sonner` | Toast notifications |
| `react-hook-form` | Form handling |
| `xgboost` | ML classifier (Python) |
| `shap` | Explainability (Python) |
| `pandas/numpy` | Data processing (Python) |

### Environment / Config

| Item | Value |
|---|---|
| Dev server port | 3000 |
| Build output | `./build` |
| Path alias | `@` → `./src` |
| Vite plugin | `@vitejs/plugin-react-swc` |

---

## 5. Possible Cross Questions

- "Why not use React Router?" → Overkill for single-view SPA; easy to add later
- "How would you handle 10K concurrent risk assessments?" → Backend API + queue + horizontal scaling
- "What if the SHAP explainer fails?" → Fallback to model-agnostic Explainer (already implemented)
- "How do you prevent XSS in form inputs?" → Sanitize inputs, React auto-escapes JSX, use CSP headers
- "Why pickle for model serialization?" → Fast, native Python; ONNX/PMML for production cross-platform
- "How accurate is the client-side risk score vs XGBoost?" → Client score is heuristic; XGBoost is trained on real data with validated metrics
- "How would you handle offline access?" → Service workers + PWA, cache critical assets + last assessment
- "What about data privacy (HIPAA/GDPR)?" → Encrypt PII at rest, consent management, anonymize ML training data
- "Why not a mobile app (React Native)?" → Web-first for maximum reach; RN possible with shared logic
- "How would you A/B test risk thresholds?" → Feature flags + analytics; compare user outcomes per threshold variant
