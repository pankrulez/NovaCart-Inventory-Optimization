import os
import io
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm

app = FastAPI()

# --- CORS ---
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").strip().rstrip('/')
origins = ["http://localhost:3000", "http://127.0.0.1:3000", frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
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

# --- ENDPOINTS ---

@app.post("/api/simulate")
async def simulate(inputs: SimInputs):
    avg_ltd = inputs.avg_demand * inputs.avg_lead_time
    combined_std = np.sqrt(inputs.avg_lead_time * (inputs.demand_std**2) + (inputs.avg_demand**2) * (inputs.lead_time_std**2))
    z = norm.ppf(inputs.service_level)
    ss = float(z * combined_std)
    rop = float(avg_ltd + ss)
    x = np.linspace(avg_ltd - (4 * combined_std), avg_ltd + (4 * combined_std), 80)
    y = norm.pdf(x, avg_ltd, combined_std)
    return {
        "safety_stock": round(ss, 2),
        "reorder_point": round(rop, 2),
        "risk_percent": round(float((1 - inputs.service_level) * 100), 2),
        "chart_points": [{"demand": float(xi), "prob": float(yi)} for xi, yi in zip(x, y)]
    }

@app.post("/api/optimize")
async def optimize(inputs: OptimizeInputs):
    D, S, H = inputs.annual_demand, inputs.ordering_cost, inputs.unit_cost * inputs.holding_rate
    eoq = np.sqrt((2 * D * S) / H)
    q_range = np.linspace(max(10, eoq * 0.2), eoq * 2.5, 40)
    cost_points = [{"qty": round(float(q), 0), "order_cost": round((D/q)*S, 2), "hold_cost": round((q/2)*H, 2), "total_cost": round((D/q)*S + (q/2)*H, 2)} for q in q_range]
    return {"eoq": round(float(eoq), 0), "annual_orders": round(float(D/eoq), 1), "min_cost": round(float((D/eoq)*S + (eoq/2)*H), 2), "cost_points": cost_points}

@app.post("/api/datalab/upload")
async def upload_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # 1. Batch Calculations
        df['cv'] = df['demand_std'] / df['demand']
        # Stochastic ROP calculation for every row
        df['rop'] = (df['demand'] * df['lead_time']) + (1.645 * np.sqrt(df['lead_time']*df['demand_std']**2 + df['demand']**2*df['lead_time_std']**2))
        
        # 2. Risk Segmentation for Bar Chart
        # Categorize products by their volatility (CV)
        bins = [0, 0.1, 0.2, 0.3, float('inf')]
        labels = ['Low', 'Medium', 'High', 'Critical']
        df['risk_level'] = pd.cut(df['cv'], bins=bins, labels=labels)
        risk_dist = df['risk_level'].value_counts().reindex(labels).reset_index()
        risk_dist.columns = ['level', 'count']

        # 3. Scatter Plot Data (Subset to 50 for performance)
        scatter_data = df[['SKU', 'demand', 'lead_time', 'rop']].head(50).to_dict(orient='records')

        # 4. Final Aggregated Response
        return {
            "skus": len(df),
            "avg_lead": f"{round(df['lead_time'].mean(), 1)} Weeks",
            "variance": f"{round(df['cv'].mean() * 100, 1)}%",
            "at_risk": int((df['cv'] > 0.3).sum()),
            "risk_chart": risk_dist.to_dict(orient='records'),
            "scatter_points": scatter_data,
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.get("/api/pipeline")
async def get_pipeline():
    return [
        {
            "step": "Data Ingestion",
            "status": "Active",
            "desc": "FastAPI REST Endpoint Listener",
            "icon_type": "database"
        },
        {
            "step": "Stochastic Modeling",
            "status": "Active",
            "desc": "SciPy Normal Distribution Engine",
            "icon_type": "cpu"
        },
        {
            "step": "Optimization Logic",
            "status": "Active",
            "desc": "NumPy EOQ Intersection Calculator",
            "icon_type": "zap"
        }
    ]

@app.get("/")
async def health():
    return {"status": "Live", "endpoints": ["/api/simulate", "/api/optimize", "/api/datalab/upload"]}