import sys
import os
from pathlib import Path

# Add the current directory (backend/) to the Python path
sys.path.append(str(Path(__file__).parent))

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from scipy.stats import norm
from core.inventory import calculate_z_score, calculate_safety_stock, calculate_reorder_point

app = FastAPI(title="NovaCart Inventory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup paths
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "processed" / "feature_engineered_with_segments.csv"

@app.get("/")
async def root():
    return {"status": "NovaCart API is Live", "version": "1.0.0"}

@app.get("/api/inventory-data")
async def get_inventory_data():
    try:
        # Load your processed CSV
        df = pd.read_csv(DATA_PATH)
        # Convert to JSON for the frontend (first 100 rows for performance)
        return df.head(100).to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data load error: {str(e)}")

# Data structure for the Simulation Input
class SimulationInput(BaseModel):
    avg_demand: float
    demand_std: float
    avg_lead_time: float
    lead_time_std: float
    service_level: float

@app.post("/api/simulate")
async def simulate_inventory(data: SimulationInput):
    try:
        # 1. Standard Calculations (Reusing your inventory.py logic)
        z = calculate_z_score(data.service_level)
        
        # Combined Standard Deviation (Lead Time Demand)
        std_lt = np.sqrt(
            (data.demand_std ** 2 * data.avg_lead_time)
            + (data.avg_demand ** 2 * data.lead_time_std ** 2)
        )

        safety_stock = z * std_lt
        mean_lt_demand = data.avg_demand * data.avg_lead_time
        reorder_point = mean_lt_demand + safety_stock
        
        # 2. Risk Metrics
        stockout_prob = 1 - norm.cdf(reorder_point, mean_lt_demand, std_lt)
        
        # 3. Generate Distribution Curve (for the Frontend Chart)
        # We send 50 points instead of 500 to keep the JSON payload light
        x_axis = np.linspace(mean_lt_demand - 4 * std_lt, mean_lt_demand + 4 * std_lt, 50)
        y_axis = norm.pdf(x_axis, mean_lt_demand, std_lt)

        return {
            "metrics": {
                "safety_stock": float(np.round(safety_stock, 2)),
                "reorder_point": float(np.round(reorder_point, 2)),
                "stockout_probability": float(np.round(stockout_prob * 100, 2)),
                "estimated_service_level": float(np.round((1 - stockout_prob) * 100, 2))
            },
            "chart_data": [
                {"x": float(x), "y": float(y)} for x, y in zip(x_axis, y_axis)
            ],
            "annotations": {
                "mean_lt_demand": mean_lt_demand,
                "z_score": z
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/forecast-data")
async def get_forecast():
    # Mocking data that looks like your actual SKU demand
    data = [
        {"name": "Week 1", "actual": 120, "forecast": 125},
        {"name": "Week 2", "actual": 132, "forecast": 130},
        {"name": "Week 3", "actual": 101, "forecast": 115},
        {"name": "Week 4", "actual": 145, "forecast": 140},
        {"name": "Week 5", "actual": 150, "forecast": 155},
        {"name": "Week 6", "actual": 140, "forecast": 160},
    ]
    return data

if __name__ == "__main__":
    import uvicorn
    # Get port from environment or default to 8000
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)