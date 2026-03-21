import os
import io
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm

app = FastAPI()

# --- CORS ---
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").strip().rstrip('/')
origins = ["http://localhost:3000", "http://127.0.0.1:3000", frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class SimInputs(BaseModel):
    avg_demand: float
    demand_std: float
    avg_lead_time: float
    lead_time_std: float
    service_level: float

class OptimizeInputs(BaseModel):
    annual_demand: float
    ordering_cost: float
    unit_cost: float
    holding_rate: float = 0.25

# --- ENDPOINTS ---

@app.post("/api/simulate")
async def simulate(inputs: SimInputs):
    avg_ltd = inputs.avg_demand * inputs.avg_lead_time
    combined_std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    z = norm.ppf(inputs.service_level)
    ss = float(z * combined_std)
    rop = float(avg_ltd + ss)
    x = np.linspace(avg_ltd - (4 * combined_std), avg_ltd + (4 * combined_std), 80)
    y = norm.pdf(x, avg_ltd, combined_std)
    return {
        "safety_stock": round(ss, 2),
        "reorder_point": round(rop, 2),
        "risk_percent": round(float((1 - inputs.service_level) * 100), 2),
        "chart_points": [{"demand": float(xi), "prob": float(yi)} for xi, yi in zip(x, y)]
    }

@app.post("/api/optimize")
async def optimize(inputs: OptimizeInputs):
    D, S, H = inputs.annual_demand, inputs.ordering_cost, inputs.unit_cost * inputs.holding_rate
    eoq = np.sqrt((2 * D * S) / H)
    q_range = np.linspace(max(10, eoq * 0.2), eoq * 2.5, 40)
    cost_points = [{"qty": round(float(q), 0), "order_cost": round((D/q)*S, 2), "hold_cost": round((q/2)*H, 2), "total_cost": round((D/q)*S + (q/2)*H, 2)} for q in q_range]
    return {"eoq": round(float(eoq), 0), "annual_orders": round(float(D/eoq), 1), "min_cost": round(float((D/eoq)*S + (eoq/2)*H), 2), "cost_points": cost_points}

@app.post("/api/datalab/upload")
async def upload_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Validation: Check if required columns exist
        required = {'demand', 'demand_std', 'lead_time'}
        if not required.issubset(df.columns):
            raise HTTPException(status_code=400, detail=f"Missing columns. Required: {required}")

        # Summary Metrics
        total_skus = len(df)
        avg_lt = f"{round(df['lead_time'].mean(), 1)} Weeks"
        
        # Calculate CV (Coefficient of Variation)
        cv_series = df['demand_std'] / df['demand']
        avg_cv = f"{round(cv_series.mean() * 100, 1)}%"
        
        # Risk Segmentation: SKUs with CV > 0.3 are considered "High Volatility"
        at_risk = int((cv_series > 0.3).sum())
        
        return {
            "skus": total_skus,
            "avg_lead": avg_lt,
            "variance": avg_cv,
            "at_risk": at_risk,
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def health():
    return {"status": "Live", "endpoints": ["/api/simulate", "/api/optimize", "/api/datalab/upload"]}