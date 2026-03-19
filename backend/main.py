import os
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm
from typing import List

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

# --- Tab 2: Live Optimizer Logic ---
def get_sensitivity(inputs: SimInputs):
    levels = [0.80, 0.90, 0.95, 0.98, 0.99]
    std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    return [{"sl": f"{int(l*100)}%", "ss": round(norm.ppf(l)*std, 1), "cost": round(norm.ppf(l)*std*25, 0)} for l in levels]

@app.post("/api/simulate")
async def simulate(inputs: SimInputs):
    avg_ltd = inputs.avg_demand * inputs.avg_lead_time
    std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    ss = norm.ppf(inputs.service_level) * std
    
    x = np.linspace(avg_ltd - (4*std), avg_ltd + (4*std), 80)
    y = norm.pdf(x, avg_ltd, std)
    
    return {
        "metrics": {"ss": round(ss, 2), "rop": round(avg_ltd + ss, 2), "risk": round((1-inputs.service_level)*100, 2)},
        "chart": [{"x": float(xi), "y": float(yi)} for xi, yi in zip(x, y)],
        "sensitivity": get_sensitivity(inputs)
    }

# --- Tab 3: File Upload Placeholder ---
@app.post("/api/upload-inventory")
async def upload_inventory(file: UploadFile = File(...)):
    # In a real app, use pandas.read_csv(file.file)
    return {"message": f"Successfully processed {file.filename}", "skus_analyzed": 142, "health_score": "88%"}

# --- Tab 4: Pipeline Stages ---
@app.get("/api/pipeline")
async def get_pipeline():
    return [
        {"step": "Data Ingestion", "desc": "Connects to ERP/SQL for raw transactional data.", "status": "Completed"},
        {"step": "Stochastic Modeling", "desc": "Calculates variance in demand & lead times.", "status": "Completed"},
        {"step": "Optimization", "desc": "Determines ROP using Service Level targets.", "status": "Completed"},
        {"step": "Visualization", "desc": "Renders React-based executive dashboards.", "status": "Completed"}
    ]

@app.get("/")
async def health(): return {"status": "online"}