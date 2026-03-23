# 📦 NovaCart: Enterprise Inventory Optimization Platform

[![CI](https://github.com/pankrulez/NovaCart-Inventory-Optimization/actions/workflows/ci.yml/badge.svg)](https://github.com/pankrulez/NovaCart-Inventory-Optimization/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![SciPy](https://img.shields.io/badge/SciPy-8CAAE6?logo=scipy&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=white)

## 📌 Project Overview

NovaCart Online Retail Pvt. Ltd. operates a large pan-India e-commerce fulfilment network. This project focuses on solving critical inventory planning challenges at the **East Zone Fulfilment Centre (EZFC)**, including high stockouts for fast-moving SKUs, excess working capital lock-in, and unpredictable supplier lead times.

**This is not just a demand forecasting model.** It is an end-to-end, operations-ready web application that translates raw historical data and statistical forecasts into actionable procurement decisions (Reorder Points, Safety Stock, and Economic Order Quantities).

---

## 🏗️ System Architecture (Hybrid Cloud)

The project has evolved from a monolithic Python script into a highly scalable, decoupled architecture:

* **Presentation Layer (Frontend):** Built with **Next.js 14**, React, Tailwind CSS, and Recharts. Deployed to the edge (Vercel) for ultra-low latency interactive dashboards.
* **Modeling Core (Backend):** Built with **FastAPI** and Python. Deployed as a dedicated microservice container (Render) to handle heavy `SciPy` and `NumPy` stochastic calculations and matrix vectorizations.
* **Data Pipeline:** Automated ETL scripts transform raw CSVs into feature-engineered production artifacts (`production_baseline.csv`, `sku_models.pkl`).

---

## 🚀 Core Platform Modules

### 1. Command Center (Home)
* **Inventory Health Score:** A dynamic metric calculated via the inverse Coefficient of Variation (CV) across the entire SKU catalog.
* **Priority Action Feed:** Automatically sorts the processed pipeline data to identify and flag the highest-volatility SKUs, ensuring operational focus is directed to critical stockout threats first.

### 2. Live Optimizer (ROP & EOQ)
* **Stochastic Safety Stock:** Calculates dynamic buffers using the standard deviation of both demand and supplier lead time.
* **Total Cost Minimization:** Features an Economic Order Quantity (EOQ) calculator that intersects holding costs and ordering costs to find the procurement "sweet spot."
* **Lead Time Sensitivity:** Quantifies the exact dollar amount of capital locked up by supplier delays.

### 3. Forecasting Engine
* **Lag-Regression Modeling:** Replaces basic trend lines with a stochastic auto-regressive model.
* **Confidence Bounds:** Generates 95% confidence intervals driven by the model's backtested Mean Absolute Percentage Error (MAPE).

### 4. Data Lab (Batch Processing Sandbox)
* **Vectorized Inference:** Allows supply chain managers to upload new custom CSV datasets. The FastAPI backend maps the SciPy engine across hundreds of SKUs simultaneously.
* **Data Quality Diagnostics:** Automatically scans uploads prior to simulation to report **Missing Values (%)**, **Duplicate Rows**, and **Demand Outliers** (via Interquartile Range analysis).

---

## 📂 Project Structure

```text
NovaCart-Inventory-Optimization/
│
├── frontend/                  # Next.js UI Application
│   ├── src/app/               # App Router & Layouts
│   ├── src/components/        # Dashboard Modules (Optimizer, Forecast, DataLab)
│   └── package.json
│
├── backend/                   # FastAPI Modeling Core
│   ├── main.py                # REST API Endpoints
│   ├── requirements.txt
│   ├── src/                   # Core Python Modules (forecasting, inventory)
│   ├── tests/                 # Pytest Suite
│   └── data/                  # Raw and Processed Artifacts
│
├── notebooks/                 # Original EDA & Model Prototyping
├── pytest.ini                 # Pytest Configuration
└── .github/workflows/         # CI/CD Pipelines
```

---

## 💻 How to Run Locally
Because the architecture is decoupled, you must spin up both the backend and frontend servers.

1. **Start the FastAPI Engine**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# (Optional) Generate the production artifacts from raw data
python -m src.pipeline    

# Start the REST API
uvicorn main:app --reload --port 8000
```

2. **Start the Next.js Client**
Open a new terminal window:

```Bash
cd frontend
npm install

# Ensure the client points to the local Python server
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start the development server
npm run dev
```

Navigate to `http://localhost:3000` to view the application.

---

## 🧪 Testing & Continuous Integration (CI)
This project strictly adheres to CI/CD best practices to ensure core inventory logic remains mathematically sound.

- **Pytest Suite**: Validates business-critical formulas (e.g., safe arithmetic, time-aware demand forecasting, EOQ calculations) located in `backend/tests/`.

- **GitHub Actions**: A CI pipeline (`.github/workflows/ci.yml`) automatically executes test suites on every push and pull request to `main`. Python paths (`PYTHONPATH`) are explicitly configured to ensure isolated, reproducible test environments.

To run tests locally:
```Bash
# From the root directory
pytest backend/tests -v
```

---

## 📬 Note for Engineering Managers & Recruiters
This repository demonstrates the leap from building a machine learning model in a notebook to deploying a full-stack data product.

While the `notebooks/` directory showcases the exploratory data analysis and mathematical proofs, the `frontend/` and `backend/` directories demonstrate software engineering best practices: API design, state management, vectorization, containerized deployment, and UI/UX optimization for non-technical business stakeholders.