# 📦 Inventory Optimization for NovaCart (Demand Forecasting Project)

![CI](https://github.com/<your-username>/<repo-name>/actions/workflows/ci.yml/badge.svg)

## 📌 Project Overview

NovaCart Online Retail Pvt. Ltd. operates a large pan-India e-commerce fulfilment network.
This project focuses on improving inventory planning at the **East Zone Fulfilment Centre (EZFC)**, where the company has recently faced:

- High stockouts for fast-moving SKUs

- Excess inventory for slow-moving products

- Inconsistent demand forecasts across categories

- High variability in supplier lead times

The goal of this project is not just to forecast demand, but to convert forecasts into operational inventory decisions such as reorder points and safety stock.

---

## 🎯 Business Objectives

The project aims to support NovaCart’s supply chain teams by building a data-driven, operations-ready inventory replenishment framework that can:

- Forecast weekly SKU-level demand

- Identify volatile and unpredictable SKUs

- Reduce stockouts while protecting service levels

- Minimize excess inventory and working capital lock-in

- Recommend clear replenishment rules usable by warehouse teams

### Target Business Outcomes

- Service Level: ≥ 96%

- Stockout Rate: ≤ 2%

- Excess Inventory Reduction: ≥ 15%

## 🧠 How This Project Is Different

Most demand forecasting projects stop at model accuracy.
This project goes end-to-end:

`Demand → Forecast Error → Safety Stock → Reorder Point → Stress Testing`

Key differentiators:

- SKU segmentation (ABC/XYZ) before modeling

- Forecasts evaluated from an inventory risk perspective, not accuracy alone

- Explicit handling of supplier lead-time uncertainty

- Scenario simulation for real-world disruptions

## 📂 Dataset Summary

The project uses four datasets:

- Sales Fact – Historical customer demand

- Inventory Snapshot – Warehouse stock positions

- Products Master – Category, pricing, and product attributes

- Suppliers Master – Vendor lead times and reliability

All datasets are validated for:

- Key consistency

- Missing values

- Business rule violations

- Date correctness

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

## 📊 Key Results (Indicative)

- High-value SKUs protected with stable service levels

- Reduced stockout exposure for fast-moving products

- Lower inventory buffers for long-tail SKUs

- Clear trade-offs between service level and working capital

`The final output is a SKU-level replenishment policy table that can be directly used by supply chain teams.`

## 🧪 Testing & Continuous Integration (CI)

This project includes basic unit tests and automated CI checks to ensure that core logic remains correct and reproducible.

### Unit Tests

Key business and modeling logic is covered using pytest, including:

- Data utility functions (safe arithmetic, data cleaning)

- Time-aware demand forecasting helpers

- Inventory optimization logic (safety stock & reorder point calculations)

Tests are located in the `tests/` directory and focus on validating business-critical assumptions, not just code execution.

To run tests locally:
```
pytest
```
### Continuous Integration (CI)

A GitHub Actions CI pipeline automatically runs all unit tests on:

- Every push to the repository

- Every pull request to main

This ensures:

- Inventory formulas remain consistent

- Forecasting logic changes are validated

- Regressions are caught early

The CI configuration is defined in:
```
.github/workflows/ci.yml
```

## 🚀 Future Improvements

- Multi-warehouse network optimization

- Real-time demand signals

- Automated retraining pipelines

- Interactive dashboard for planners

## 📬 Final Note

This project was built to reflect how inventory problems are actually solved in practice, not just how models are trained.

If you’re reviewing this as a recruiter or hiring manager:

- Start with the Inventory Optimization and Scenario Simulation notebooks

- Those show the most real-world thinking