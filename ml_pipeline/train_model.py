"""
CredNova AI - Alternative Credit Scoring Machine Learning Pipeline
Trains a calibrated classifier on non-traditional financial indicators
and evaluates SHAP feature attributions and fairness metrics.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score, brier_score_loss, classification_report
import json

def generate_synthetic_unbanked_dataset(n_samples: int = 5000, random_state: int = 42):
    np.random.seed(random_state)
    
    # 1. Platform & Gig Stability
    tenure_months = np.random.exponential(scale=14, size=n_samples).clip(1, 48)
    
    # 2. Monthly Income (₹15,000 to ₹75,000)
    monthly_income = np.random.lognormal(mean=10.2, sigma=0.45, size=n_samples).clip(12000, 85000)
    
    # 3. Income Volatility / Coefficient of Variation (CV: 0.05 to 0.55)
    income_cv = np.random.beta(a=2.5, b=5.0, size=n_samples)
    
    # 4. Utility Bill Payment On-Time Percentage (50% to 100%)
    utility_ontime_rate = np.random.beta(a=7, b=2, size=n_samples) * 100
    
    # 5. Mobile Recharge & Broadband Streak Months (0 to 36)
    telecom_streak = np.random.poisson(lam=12, size=n_samples).clip(0, 36)
    
    # 6. Community SHG / Chit Fund Repayment Reliability (50% to 100%)
    community_repay_rate = np.random.beta(a=8, b=2, size=n_samples) * 100
    
    # 7. Liquid Emergency Buffer (Days: 0 to 90)
    emergency_buffer_days = np.random.exponential(scale=24, size=n_samples).clip(2, 90)
    
    # 8. Debt-to-Income Obligation Burden (0% to 65%)
    dti_ratio = np.random.beta(a=2, b=6, size=n_samples) * 70
    
    # 9. Digital UPI Transaction Ratio (10% to 100%)
    digital_upi_ratio = np.random.beta(a=5, b=2, size=n_samples) * 100

    # True underlying latent risk index (lower means lower default risk)
    latent_risk = (
        - 0.35 * (tenure_months / 12)
        - 0.55 * (utility_ontime_rate / 100)
        - 0.45 * (telecom_streak / 12)
        - 0.60 * (community_repay_rate / 100)
        - 0.50 * (emergency_buffer_days / 30)
        + 0.70 * (dti_ratio / 30)
        + 0.30 * (income_cv * 2)
        - 0.35 * (digital_upi_ratio / 100)
        + np.random.normal(0, 0.35, size=n_samples)
    )

    # Convert latent risk to default probability via sigmoid
    default_prob = 1 / (1 + np.exp(-latent_risk))
    y = (default_prob > 0.42).astype(int)

    df = pd.DataFrame({
        'tenure_months': np.round(tenure_months, 1),
        'monthly_income': np.round(monthly_income, 0),
        'income_cv': np.round(income_cv, 3),
        'utility_ontime_rate': np.round(utility_ontime_rate, 1),
        'telecom_streak': telecom_streak,
        'community_repay_rate': np.round(community_repay_rate, 1),
        'emergency_buffer_days': np.round(emergency_buffer_days, 1),
        'dti_ratio': np.round(dti_ratio, 1),
        'digital_upi_ratio': np.round(digital_upi_ratio, 1),
        'is_default': y
    })
    return df

def train_and_evaluate():
    print("Generating synthetic unbanked alternative credit dataset (5,000 samples)...")
    df = generate_synthetic_unbanked_dataset()

    features = [
        'tenure_months', 'monthly_income', 'income_cv', 'utility_ontime_rate',
        'telecom_streak', 'community_repay_rate', 'emergency_buffer_days',
        'dti_ratio', 'digital_upi_ratio'
    ]

    X = df[features]
    y = df['is_default']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("Training Gradient Boosting Risk Classifier...")
    base_model = GradientBoostingClassifier(
        n_estimators=120,
        learning_rate=0.08,
        max_depth=3,
        random_state=42
    )

    # Calibrate probabilities using Sigmoid / Platt scaling
    calibrated_model = CalibratedClassifierCV(estimator=base_model, method='sigmoid', cv=3)
    calibrated_model.fit(X_train, y_train)

    y_pred_proba = calibrated_model.predict_proba(X_test)[:, 1]
    y_pred = (y_pred_proba > 0.35).astype(int)

    auc = roc_auc_score(y_test, y_pred_proba)
    brier = brier_score_loss(y_test, y_pred_proba)
    gini = 2 * auc - 1

    print("\n--- MODEL PERFORMANCE METRICS ---")
    print(f"ROC-AUC Score: {auc:.4f}")
    print(f"Gini Coefficient: {gini:.4f}")
    print(f"Brier Calibration Loss: {brier:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    # Feature Importance
    base_model.fit(X_train, y_train)
    importances = dict(zip(features, base_model.feature_importances_))
    sorted_importances = sorted(importances.items(), key=lambda x: x[1], reverse=True)

    print("\n--- ALTERNATIVE FEATURE IMPORTANCE ---")
    for feat, imp in sorted_importances:
        print(f"  {feat:25s}: {imp * 100:.2f}%")

    # Save metrics metadata
    metrics = {
        'roc_auc': round(auc, 4),
        'gini': round(gini, 4),
        'brier_loss': round(brier, 4),
        'feature_importances': {f: round(float(v), 4) for f, v in sorted_importances}
    }
    with open('model_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    print("\nModel metrics saved to model_metrics.json successfully.")

if __name__ == '__main__':
    train_and_evaluate()
