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
    # Calculations
    avg_ltd = inputs.avg_demand * inputs.avg_lead_time
    combined_std = np.sqrt(
        inputs.avg_lead_time * (inputs.demand_std**2) + 
        (inputs.avg_demand**2) * (inputs.lead_time_std**2)
    )
    
    z_score = norm.ppf(inputs.service_level)
    ss = float(z_score * combined_std)
    rop = float(avg_ltd + ss)
    risk = float((1 - inputs.service_level) * 100)
    
    # Points
    x = np.linspace(avg_ltd - (4 * combined_std), avg_ltd + (4 * combined_std), 80)
    y = norm.pdf(x, avg_ltd, combined_std)
    
    # Flat return structure
    return {
        "safety_stock": round(ss, 2),
        "reorder_point": round(rop, 2),
        "risk_percent": round(risk, 2),
        "chart_points": [{"demand": float(xi), "prob": float(yi)} for xi, yi in zip(x, y)]
    }

@app.get("/api/pipeline")
async def get_pipeline():
    return [{"step": "Engine Active", "desc": "Scipy-powered stochastic model is online.", "status": "Active"}]

@app.get("/")
async def health(): return {"status": "Online"}