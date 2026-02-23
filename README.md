# 📦 Inventory Optimization for NovaCart (Demand Forecasting Project)
*Demand Forecasting + Inventory Replenishment Framework*

![CI](https://github.com/pankrulez/NovaCart-Inventory-Optimization/actions/workflows/ci.yml/badge.svg)

## 📌 Project Overview

NovaCart operates a large pan-India e-commerce fulfillment network.
This project improves inventory planning at the **East Zone Fulfilment Centre (EZFC)**, addressing:

- Stockouts of fast-moving SKUs

- Excess inventory for slow-moving SKUs

- Forecast inconsistency across categories

- Supplier lead-time variability

The objective is to convert demand forecasts into **operational inventory decisions** (Safety Stock & Reorder Points).

---

## 🎯 Business Goals

- Weekly SKU-level demand forecasting

- SKU volatility identification (ABC/XYZ)

- Service Level ≥ 96%

- Stockout Rate ≤ 2%

- ≥ 15% reduction in excess inventory

- Clear replenishment rules usable by warehouse teams

---

## 🔁 End-to-End Framework

Unlike typical forecasting projects, this is operations-driven:

`Demand → Forecast Error → Safety Stock → Reorder Point → Stress Testing`

Key elements:

- ABC/XYZ SKU segmentation

- Forecast evaluation from an inventory-risk perspective

- Explicit modeling of supplier lead-time uncertainty

- Scenario simulation for demand and supplier shocks

---

## 📂 Dataset Summary

The project uses four datasets:

- **Sales Fact** – Historical customer demand

- **Inventory Snapshot** – Warehouse stock positions

- **Products Master** – Category, pricing, and product attributes

- **Suppliers Master** – Vendor lead times and reliability

---

## 🛠️ Project Structure
```
NovaCart-Inventory-Optimization/
│
├── data/
│   ├── raw/
│   ├── processed/
│
├── notebooks/
│   ├── 01_business_understanding.ipynb
│   ├── 02_data_validation_cleaning.ipynb
│   ├── 03_exploratory_data_analysis.ipynb
│   ├── 04_feature_engineering.ipynb
│   ├── 05_sku_segmentation_abc_xyz.ipynb
│   ├── 06_demand_forecasting.ipynb
│   ├── 07_inventory_optimization.ipynb
│   ├── 08_scenario_simulation.ipynb
│
├── reports/
│   └── business_summary.md
│
├── src/
│   ├── forecasting.py
│   ├── inventory.py
│   └── utils.py
│
└── README.md
```

---

## 🔍 Key Steps & Methodology
1. Business Understanding

    - Defined service level, stockout, and inventory cost objectives

    - Identified operational constraints from a warehouse perspective

2. Data Validation & Cleaning

    - Verified SKU and supplier relationships

    - Handled missing and invalid values

    - Flagged potential stockout events

3. Exploratory Data Analysis

    - Demand concentration and Pareto analysis

    - Category-level seasonality

    - Demand volatility and stockout patterns

    - Supplier lead-time variability

4. Feature Engineering

    - Lagged and rolling demand features

    - Price and promotion signals

    - Seasonality indicators

    - Supplier risk and lead-time features

5. SKU Segmentation (ABC / XYZ)

    - ABC: Revenue importance

    - XYZ: Demand predictability

    - Combined into actionable SKU segments (AX, BY, CZ, etc.)

6. Demand Forecasting

    - Weekly SKU-level forecasting

    - Baseline (naive) vs lag-based regression models

    - Time-aware train/test split

    - Focus on forecast error and bias

7. Inventory Optimization

    - Safety stock using demand & lead-time uncertainty

    - Reorder point (ROP) calculation

    - Segment-specific inventory buffers

8. Scenario Simulation & Stress Testing

    - Demand surge (festive / promotions)

    - Supplier delay scenarios

    - Service level impact analysis
    
---

## 📊 Key Outcomes

- Service levels stabilized for high-value SKUs

- Reduced stockout exposure on fast movers

- Leaner buffers for long-tail products

- Clear service-level vs working-capital trade-offs

The final output is a SKU-level replenishment policy table ready for operational use.

---

## 🧪 Testing & Continuous Integration (CI)

- pytest unit tests for forecasting & inventory logic

- GitHub Actions CI on push & PR

- Validates safety stock, ROP formulas, and time-aware logic

To run tests locally:
```
pytest
```
CI config:
```
.github/workflows/ci.yml
```

---

## 🚀 Future Work

- Multi-warehouse optimization

- Real-time demand integration

- Automated retraining

- Planner-facing dashboard
