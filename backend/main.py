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

def calculate_sensitivity(inputs: SimInputs):
    levels = [0.80, 0.85, 0.90, 0.95, 0.97, 0.98, 0.99]
    combined_std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    holding_cost = 25 
    return [{
        "sl": f"{int(sl*100)}%",
        "ss": float(round(norm.ppf(sl) * combined_std, 1)),
        "cost": float(round(norm.ppf(sl) * combined_std * holding_cost, 0))
    } for sl in levels]

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
            "service_level": float(inputs.service_level * 100),
            "risk": float(round((1 - inputs.service_level) * 100, 2))
        },
        "chart_data": chart_data,
        "sensitivity": calculate_sensitivity(inputs)
    }

@app.get("/api/inventory-data")
async def get_inventory():
    return [
        {"sku": "ITEM-001", "segment": "A", "demand": 850, "lead": 2, "status": "Healthy"},
        {"sku": "ITEM-042", "segment": "A", "demand": 420, "lead": 3, "status": "Critical"},
        {"sku": "ITEM-109", "segment": "B", "demand": 150, "lead": 5, "status": "Healthy"},
        {"sku": "ITEM-882", "segment": "C", "demand": 45, "lead": 10, "status": "Overstocked"},
    ]

@app.get("/api/forecast-data")
async def get_forecast():
    return [{"name": f"W{i}", "actual": np.random.randint(3000, 4500), "forecast": np.random.randint(3200, 4300)} for i in range(1, 13)]

@app.get("/")
async def health():
    return {"status": "online"}