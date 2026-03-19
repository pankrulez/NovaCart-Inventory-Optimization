import os
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm
from typing import List, Dict

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
    return {"status": "online", "gateway": frontend_url}

@app.post("/api/simulate")
async def simulate(inputs: SimInputs):
    avg_lt_demand = inputs.avg_demand * inputs.avg_lead_time
    combined_std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    z = norm.ppf(inputs.service_level)
    ss = z * combined_std
    rop = avg_lt_demand + ss
    
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
async def get_inventory():
    return [
        {"SKU": "SKU-9920", "SKU_segment": "A - Critical", "avg_weekly_demand": 850.2, "avg_lead_time": 2, "status": "Optimized"},
        {"SKU": "SKU-4412", "SKU_segment": "A - Critical", "avg_weekly_demand": 420.5, "avg_lead_time": 3, "status": "Under-Stocked"},
        {"SKU": "SKU-1029", "SKU_segment": "B - Regular", "avg_weekly_demand": 150.0, "avg_lead_time": 5, "status": "Optimized"},
        {"SKU": "SKU-8821", "SKU_segment": "C - Buffer", "avg_weekly_demand": 45.2, "avg_lead_time": 10, "status": "Over-Stocked"},
    ]

@app.get("/api/forecast-data")
async def get_forecast():
    return [
        {"name": "Week 1", "actual": 4200, "forecast": 4100},
        {"name": "Week 2", "actual": 3800, "forecast": 3950},
        {"name": "Week 3", "actual": 3100, "forecast": 3200},
        {"name": "Week 4", "actual": 4500, "forecast": 4300},
        {"name": "Week 5", "actual": 2900, "forecast": 3100},
        {"name": "Week 6", "actual": None, "forecast": 3400},
    ]