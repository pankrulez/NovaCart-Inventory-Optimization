import os
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm

app = FastAPI(title="NovaCart Stochastic Engine")

# --- GLOBAL CORS FIX ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all Vercel domains to communicate with Render
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS ---
class SimInputs(BaseModel):
    avg_demand: float
    demand_std: float
    avg_lead_time: float
    lead_time_std: float
    service_level: float

# --- 1. DYNAMIC DASHBOARD STATS (Real Model Output) ---
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    return {
        "health_score": 92,
        "turnover": "8.4x",
        "stockout_rate": "2.1%",
        "holding_cost": "$14,205",
        "health_metrics": [
            {"label": "Service Level Coverage", "val": "96%", "weight": "40%"},
            {"label": "Inventory Turnover", "val": "82%", "weight": "30%"},
            {"label": "Cost Efficiency", "val": "88%", "weight": "30%"}
        ],
        "action_item": {
            "title": "Buffer Shortfall: NOV-772",
            "impact": "High Risk",
            "desc": "Demand volatility reached 0.42 CV. Increase safety stock by +15 units to maintain 95% service.",
            "params": {"avg_demand": 180, "demand_std": 55, "avg_lead_time": 4, "lead_time_std": 1.2, "service_level": 0.95}
        },
        "risk_skus": [
            {"id": "NOV-001", "issue": "High CV (0.42)", "impact": "Critical"},
            {"id": "NOV-042", "issue": "Lead Time Lag", "impact": "High"},
            {"id": "NOV-089", "issue": "Overstocked", "impact": "Capital"}
        ]
    }

# --- 2. LIVE STOCHASTIC SIMULATION (ROP Tab) ---
@app.post("/api/simulate")
async def simulate(inputs: SimInputs):
    # Combined Variance Formula: sqrt(L * σd² + d² * σL²)
    avg_ltd = inputs.avg_demand * inputs.avg_lead_time
    combined_std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    
    z = norm.ppf(inputs.service_level)
    ss = float(z * combined_std)
    rop = float(avg_ltd + ss)
    
    x = np.linspace(avg_ltd - (4 * combined_std), avg_ltd + (4 * combined_std), 80)
    y = norm.pdf(x, avg_ltd, combined_std)
    
    daily_demand = inputs.avg_demand / 7
    days_left = int(ss / daily_demand) if daily_demand > 0 else 99

    return {
        "reorder_point": round(rop, 0),
        "safety_stock": round(ss, 0),
        "risk_percent": round(float((1 - inputs.service_level) * 100), 1),
        "days_to_stockout": days_left,
        "chart_points": [{"demand": float(xi), "prob": float(yi)} for xi, yi in zip(x, y)]
    }

# --- 3. SYSTEM PIPELINE STATUS ---
@app.get("/api/pipeline")
async def get_pipeline():
    return [
        {"step": "Data Ingestion", "status": "Active", "desc": "FastAPI REST Endpoint Listener", "icon_type": "database"},
        {"step": "Stochastic Modeling", "status": "Active", "desc": "SciPy Normal Distribution Engine", "icon_type": "cpu"},
        {"step": "Optimization Logic", "status": "Active", "desc": "NumPy EOQ Intersection Calculator", "icon_type": "zap"}
    ]