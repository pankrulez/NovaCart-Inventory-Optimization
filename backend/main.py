import os
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm

app = FastAPI()

# --- Dynamic CORS ---
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").strip().rstrip('/')
origins = ["http://localhost:3000", "http://127.0.0.1:3000", frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimInputs(BaseModel):
    avg_demand: float
    demand_std: float
    avg_lead_time: float
    lead_time_std: float
    service_level: float

@app.post("/api/simulate")
async def simulate(inputs: SimInputs):
    # Mathematics
    avg_ltd = inputs.avg_demand * inputs.avg_lead_time
    combined_std = np.sqrt(
        inputs.avg_lead_time * (inputs.demand_std**2) + 
        (inputs.avg_demand**2) * (inputs.lead_time_std**2)
    )
    
    z_score = norm.ppf(inputs.service_level)
    ss = float(z_score * combined_std)
    rop = float(avg_ltd + ss)
    risk = float((1 - inputs.service_level) * 100)
    
    # Points for the curve
    x = np.linspace(avg_ltd - (4 * combined_std), avg_ltd + (4 * combined_std), 80)
    y = norm.pdf(x, avg_ltd, combined_std)
    
    # We return a FLAT object
    return {
        "safety_stock": round(ss, 2),
        "reorder_point": round(rop, 2),
        "risk_percent": round(risk, 2),
        "chart_points": [{"demand": float(xi), "prob": float(yi)} for xi, yi in zip(x, y)]
    }

@app.get("/api/pipeline")
async def get_pipeline():
    return [{"step": "Engine Active", "desc": "Scipy-powered stochastic model is online.", "status": "Active"}]


@app.post("/api/optimize")
async def optimize_inventory(inputs: dict):
    # Inputs expected: annual_demand, ordering_cost, unit_cost, holding_rate (e.g. 0.25)
    D = inputs.get("annual_demand", 8320) # Default: 160 units/week * 52
    S = inputs.get("ordering_cost", 50)   # Cost per order (shipping, admin)
    H = inputs.get("unit_cost", 100) * inputs.get("holding_rate", 0.25) # Carrying cost per unit
    
    # EOQ Formula: sqrt( (2 * D * S) / H )
    eoq = np.sqrt((2 * D * S) / H)
    
    # Calculate Total Cost Curve for visualization
    # Total Cost = (D/Q)*S + (Q/2)*H
    q_range = np.linspace(max(10, eoq * 0.2), eoq * 2.5, 50)
    cost_data = []
    for q in q_range:
        order_cost = (D / q) * S
        hold_cost = (q / 2) * H
        cost_data.append({
            "q": round(float(q), 0),
            "order_cost": round(float(order_cost), 2),
            "hold_cost": round(float(hold_cost), 2),
            "total_cost": round(float(order_cost + hold_cost), 2)
        })
        
    return {
        "eoq": round(eoq, 2),
        "annual_orders": round(D / eoq, 1),
        "cost_data": cost_data,
        "metrics": {
            "min_total_cost": round((D / eoq) * S + (eoq / 2) * H, 2),
            "cycle_stock": round(eoq / 2, 2)
        }
    }


@app.get("/")
async def health(): return {"status": "Online"}