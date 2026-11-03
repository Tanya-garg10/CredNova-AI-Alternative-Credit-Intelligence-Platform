# CredNova AI - Machine Learning Pipeline & Backend

This directory contains the Python-based Machine Learning pipeline for **CredNova AI: Alternative Credit Scoring for the Unbanked**.

## Architecture Overview
- **ML Algorithm**: Calibrated Gradient Boosting (`sklearn.ensemble.GradientBoostingClassifier` with Platt scaling via `CalibratedClassifierCV`).
- **Feature Engineering**: 9 non-traditional alternative credit indicators (utility streaks, gig seniority, emergency liquid reserves, community SHG repayment reliability, digital UPI cashflows).
- **Explainability**: SHAP (SHapley Additive exPlanations) & additive feature attributions.
- **Fairness & Bias Shield**: Automated compliance testing against the US EEOC 80% rule (Disparate Impact Ratio >= 0.80) across urban vs. rural cohorts.
- **REST Framework**: FastAPI + Pydantic v2.

## Quickstart (Python ML)
```bash
cd ml_pipeline
pip install -r requirements.txt
python train_model.py
uvicorn fastapi_app:app --host 0.0.0.0 --port 8000
```
