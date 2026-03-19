import os
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm
from typing import List, Dict, Optional

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

def calculate_sensitivity(inputs: SimInputs):
    levels = [0.80, 0.85, 0.90, 0.95, 0.97, 0.98, 0.99]
    combined_std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    holding_cost = 25 
    
    return [{
        "service_level": f"{int(sl*100)}%",
        "safety_stock": float(round(norm.ppf(sl) * combined_std, 1)),
        "carrying_cost": float(round(norm.ppf(sl) * combined_std * holding_cost, 0))
    } for sl in levels]

@app.get("/")
async def root():
    return {"status": "online", "allowed": frontend_url}

@app.post("/api/simulate")
async def simulate(inputs: SimInputs):
    avg_lt_demand = inputs.avg_demand * inputs.avg_lead_time
    combined_std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    
    z = norm.ppf(inputs.service_level)
    ss = z * combined_std
    rop = avg_lt_demand + ss
    
    # Distribution Curve
    x = np.linspace(avg_lt_demand - (4 * combined_std), avg_lt_demand + (4 * combined_std), 80)
    y = norm.pdf(x, avg_lt_demand, combined_std)
    chart_data = [{"x": float(xi), "y": float(yi)} for xi, yi in zip(x, y)]

    return {
        "metrics": {
            "safety_stock": float(round(ss, 2)),
            "reorder_point": float(round(rop, 2)),
            "estimated_service_level": float(inputs.service_level * 100),
            "stockout_probability": float(round((1 - inputs.service_level) * 100, 2))
        },
        "chart_data": chart_data,
        "sensitivity": calculate_sensitivity(inputs)
    }

@app.get("/api/inventory-data")
async def get_inv():
    return [{"SKU": "WH-402", "SKU_segment": "A", "avg_weekly_demand": 450, "avg_lead_time": 2}]

@app.get("/api/forecast-data")
async def get_fore():
    return [{"name": "W1", "actual": 400, "forecast": 420}]