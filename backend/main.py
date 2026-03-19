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
    # Mathematics: Combined Uncertainty
    avg_ltd = inputs.avg_demand * inputs.avg_lead_time
    # Note: Lead time is usually in days, convert if necessary. Here assuming days.
    combined_std = np.sqrt(
        inputs.avg_lead_time * (inputs.demand_std**2) + 
        (inputs.avg_demand**2) * (inputs.lead_time_std**2)
    )
    
    z_score = norm.ppf(inputs.service_level)
    safety_stock = z_score * combined_std
    reorder_point = avg_ltd + safety_stock
    
    # Generate Chart Points
    x = np.linspace(avg_ltd - (4 * combined_std), avg_ltd + (4 * combined_std), 80)
    y = norm.pdf(x, avg_ltd, combined_std)
    chart_points = [{"x": float(xi), "y": float(yi)} for xi, yi in zip(x, y)]

    # Sensitivity Analysis
    levels = [0.80, 0.85, 0.90, 0.95, 0.98, 0.99]
    sensitivity = []
    for sl in levels:
        z = norm.ppf(sl)
        ss = z * combined_std
        sensitivity.append({
            "sl": f"{int(sl*100)}%",
            "ss": round(ss, 1),
            "cost": round(ss * 25, 0)
        })

    # CRITICAL: These keys must match Optimizer.tsx exactly
    return {
        "metrics": {
            "safety_stock": round(safety_stock, 2),
            "reorder_point": round(reorder_point, 2),
            "risk": round((1 - inputs.service_level) * 100, 2)
        },
        "chart": chart_points,
        "sensitivity": sensitivity
    }

@app.get("/api/pipeline")
async def get_pipeline():
    return [{"step": "Engine Ready", "desc": "Stochastic model initialized.", "status": "Active"}]

@app.get("/")
async def health(): return {"status": "Online"}