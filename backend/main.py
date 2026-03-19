import os
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm
from typing import List, Dict

app = FastAPI()

# --- Dynamic CORS Setup ---
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").strip().rstrip('/')
origins = ["http://localhost:3000", "http://127.0.0.1:3000", frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class SimInputs(BaseModel):
    avg_demand: float
    demand_std: float
    avg_lead_time: float
    lead_time_std: float
    service_level: float

# --- Business Logic: Sensitivity Analysis ---
def get_sensitivity(inputs: SimInputs):
    levels = [0.80, 0.85, 0.90, 0.95, 0.97, 0.98, 0.99, 0.999]
    combined_std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    
    # Static carrying cost assumption ($25/unit) for visualization
    holding_cost_per_unit = 25 
    
    data = []
    for sl in levels:
        z = norm.ppf(sl)
        ss = z * combined_std
        data.append({
            "service_level": f"{round(sl*100, 1)}%",
            "safety_stock": round(ss, 0),
            "carrying_cost": round(ss * holding_cost_per_unit, 0)
        })
    return data

@app.get("/")
async def health_check():
    return {"status": "online", "gateway": frontend_url}

@app.post("/api/simulate")
async def simulate(inputs: SimInputs):
    # Calculate Lead Time Demand Std Dev
    combined_std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    
    z_score = norm.ppf(inputs.service_level)
    safety_stock = z_score * combined_std
    reorder_point = (inputs.avg_demand * inputs.avg_lead_time) + safety_stock
    
    # Generate Normal Distribution Curve
    x = np.linspace(reorder_point - (4 * combined_std), reorder_point + (4 * combined_std), 100)
    y = norm.pdf(x, inputs.avg_demand * inputs.avg_lead_time, combined_std)
    chart_data = [{"x": float(xi), "y": float(yi)} for xi, yi in zip(x, y)]

    return {
        "metrics": {
            "safety_stock": round(safety_stock, 2),
            "reorder_point": round(reorder_point, 2),
            "estimated_service_level": inputs.service_level * 100,
            "stockout_probability": round((1 - inputs.service_level) * 100, 2)
        },
        "chart_data": chart_data,
        "sensitivity": get_sensitivity(inputs)
    }

@app.get("/api/inventory-data")
async def get_inventory():
    # Mock data for frontend showcase
    return [
        {"SKU": "WH-402", "SKU_segment": "A - High Value", "avg_weekly_demand": 450.5, "avg_lead_time": 2},
        {"SKU": "WH-109", "SKU_segment": "B - Medium", "avg_weekly_demand": 120.2, "avg_lead_time": 5},
        {"SKU": "WH-882", "SKU_segment": "C - Low", "avg_weekly_demand": 15.8, "avg_lead_time": 12},
    ]

@app.get("/api/forecast-data")
async def get_forecast():
    return [
        {"name": "Week 1", "actual": 4000, "forecast": 4200},
        {"name": "Week 2", "actual": 3000, "forecast": 3800},
        {"name": "Week 3", "actual": 2000, "forecast": 3200},
        {"name": "Week 4", "actual": 2780, "forecast": 2900},
    ]