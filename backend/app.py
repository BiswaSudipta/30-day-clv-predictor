from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np

# ===============================
# 1. CREATE FASTAPI APP
# ===============================

app = FastAPI(
    title="30-Day CLV Prediction API",
    description="Predict short-term customer value using a two-stage ML model",
    version="1.0"
)

# ===============================
# 2. ADD CORS
# ===============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all for hackathon/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# 3. LOAD MODELS
# ===============================

buy_model = joblib.load("buy_probability_model.pkl")
spend_model = joblib.load("spend_regression_model.pkl")

# ===============================
# 4. INPUT FEATURE ORDER
# ===============================

FEATURE_ORDER = [
    "total_orders",
    "total_products",
    "reorder_rate",
    "avg_days_between_orders",
    "recency_days",
    "orders_last_5"
]

# ===============================
# 5. INPUT SCHEMA (THIS CREATES PARAMETERS)
# ===============================

class CustomerFeatures(BaseModel):
    total_orders: int
    total_products: int
    reorder_rate: float
    avg_days_between_orders: float
    recency_days: float
    orders_last_5: int

# ===============================
# 6. PREDICTION ENDPOINT (WITH PARAMETERS)
# ===============================

@app.post("/predict")
def predict_clv(features: CustomerFeatures):

    # Convert JSON → DataFrame
    X = pd.DataFrame([features.dict()])[FEATURE_ORDER]

    # Stage 1: Buy probability
    buy_probability = buy_model.predict_proba(X)[:, 1][0]
    buy_probability = min(buy_probability, 0.99)

    # Stage 2: Spend regression
    expected_spend = np.expm1(spend_model.predict(X))[0]

    # Final CLV
    predicted_clv = buy_probability * expected_spend

    return {
        "buy_probability": round(float(buy_probability), 4),
        "expected_spend_if_buy": round(float(expected_spend), 2),
        "predicted_30d_clv": round(float(predicted_clv), 2)
    }

# ===============================
# 7. HEALTH CHECK (NO PARAMETERS)
# ===============================

@app.get("/")
def health_check():
    return {"status": "API is running"}
