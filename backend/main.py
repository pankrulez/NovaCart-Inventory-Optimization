import os
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm

app = FastAPI()

# --- DYNAMIC CORS SETUP ---
# This ensures your Vercel frontend can talk to your Render backend
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").strip().rstrip('/')
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    frontend_url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

class OptimizeInputs(BaseModel):
    annual_demand: float
    ordering_cost: float
    unit_cost: float
    holding_rate: float = 0.25

# --- 1. STOCHASTIC / ROP ENDPOINT (Optimizer Tab) ---
@app.post("/api/simulate")
async def simulate(inputs: SimInputs):
    try:
        # Math: Combined Uncertainty (Stochastic Lead Time Demand)
        avg_ltd = inputs.avg_demand * inputs.avg_lead_time
        combined_std = np.sqrt(
            inputs.avg_lead_time * (inputs.demand_std**2) + 
            (inputs.avg_demand**2) * (inputs.lead_time_std**2)
        )
        
        z_score = norm.ppf(inputs.service_level)
        ss = float(z_score * combined_std)
        rop = float(avg_ltd + ss)
        risk = float((1 - inputs.service_level) * 100)
        
        # Chart Data (80 points for smooth Normal Distribution)
        x = np.linspace(avg_ltd - (4 * combined_std), avg_ltd + (4 * combined_std), 80)
        y = norm.pdf(x, avg_ltd, combined_std)
        
        return {
            "safety_stock": round(ss, 2),
            "reorder_point": round(rop, 2),
            "risk_percent": round(risk, 2),
            "chart_points": [{"demand": float(xi), "prob": float(yi)} for xi, yi in zip(x, y)]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 2. EOQ / COST OPTIMIZATION ENDPOINT (Optimization Tab) ---
@app.post("/api/optimize")
async def optimize_inventory(inputs: OptimizeInputs):
    try:
        D = inputs.annual_demand
        S = inputs.ordering_cost
        H = inputs.unit_cost * inputs.holding_rate
        
        # EOQ Formula: sqrt( (2 * D * S) / H )
        eoq = np.sqrt((2 * D * S) / H)
        
        # Generate cost curve points
        # Range from 20% of EOQ to 250% of EOQ
        q_min = max(10, eoq * 0.2)
        q_max = eoq * 2.5
        q_range = np.linspace(q_min, q_max, 40)
        
        cost_points = []
        for q in q_range:
            order_c = (D / q) * S
            hold_c = (q / 2) * H
            cost_points.append({
                "qty": round(float(q), 0),
                "order_cost": round(float(order_c), 2),
                "hold_cost": round(float(hold_c), 2),
                "total_cost": round(float(order_c + hold_c), 2)
            })
            
        return {
            "eoq": round(float(eoq), 0),
            "annual_orders": round(float(D / eoq), 1),
            "min_cost": round(float((D / eoq) * S + (eoq / 2) * H), 2),
            "cost_points": cost_points
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- PIPELINE / HEALTH CHECK ---
@app.get("/api/pipeline")
async def get_pipeline():
    return [
        {"step": "Ingestion", "status": "Active", "desc": "FastAPI receiving JSON payloads."},
        {"step": "Modeling", "status": "Active", "desc": "Scipy/Numpy stochastic processing."},
        {"step": "Optimization", "status": "Active", "desc": "EOQ cost-minimization logic."}
    ]

@app.get("/")
async def health():
    return {
        "status": "NovaCart Engine Live",
        "version": "2.1.0",
        "available_endpoints": ["/api/simulate", "/api/optimize", "/api/pipeline"]
    }