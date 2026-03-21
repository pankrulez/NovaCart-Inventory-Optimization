import os
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm
import pandas as pd
import io
from fastapi import UploadFile, File

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

# --- STOCHASTIC ENDPOINT ---
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

# --- EOQ ENDPOINT (THE ONE FIXING THE 404) ---
@app.post("/api/optimize")
async def optimize_inventory(inputs: OptimizeInputs):
    try:
        D = inputs.annual_demand
        S = inputs.ordering_cost
        H = inputs.unit_cost * inputs.holding_rate
        eoq = np.sqrt((2 * D * S) / H)
        q_range = np.linspace(max(10, eoq * 0.2), eoq * 2.5, 40)
        cost_points = []
        for q in q_range:
            oc = (D / q) * S
            hc = (q / 2) * H
            cost_points.append({"qty": round(float(q), 0), "order_cost": round(oc, 2), "hold_cost": round(hc, 2), "total_cost": round(oc + hc, 2)})
        return {
            "eoq": round(float(eoq), 0),
            "annual_orders": round(float(D / eoq), 1),
            "min_cost": round(float((D / eoq) * S + (eoq / 2) * H), 2),
            "cost_points": cost_points
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/datalab/upload")
async def upload_csv(file: UploadFile = File(...)):
    try:
        # Read the CSV into a DataFrame
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Required columns: SKU, demand, demand_std, lead_time, lead_time_std, cost, order_cost
        # Let's calculate ROP and EOQ for every row
        results = []
        for _, row in df.iterrows():
            # Stochastic ROP (95% Service Level)
            avg_ltd = row['demand'] * row['lead_time']
            combined_std = np.sqrt(row['lead_time'] * (row['demand_std']**2) + (row['demand']**2) * (row['lead_time_std']**2))
            rop = avg_ltd + (1.645 * combined_std)
            
            # EOQ
            H = row['cost'] * 0.25
            eoq = np.sqrt((2 * row['demand'] * 52 * row['order_cost']) / H)
            
            results.append({
                "SKU": row['SKU'],
                "Recommended_ROP": round(rop, 0),
                "Recommended_EOQ": round(eoq, 0),
                "Annual_Savings_Est": round((row['demand'] * 52 * 0.1), 2) # Mock logic
            })
            
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV format: {str(e)}")

@app.get("/")
async def health():
    return {"status": "Live", "endpoints": ["/api/simulate", "/api/optimize"]}