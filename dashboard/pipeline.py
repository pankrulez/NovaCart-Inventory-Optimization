import streamlit as st
import time


def render_pipeline():

    st.markdown('<div class="section-title">End-to-End Project Pipeline</div>', unsafe_allow_html=True)

    steps = [
        (
            "1️⃣ Business Understanding",
            "bg-stage-1",
            """
            <ul>
                <li>Identified rising stockouts and excess inventory imbalance</li>
                <li>Defined service level target (≥96%)</li>
                <li>Aligned objectives with supply chain, finance, and operations teams</li>
                <li>Framed the problem as uncertainty-aware replenishment</li>
            </ul>
            """
        ),
        (
            "2️⃣ Data Validation & Cleaning",
            "bg-stage-2",
            """
            <ul>
                <li>Verified primary and foreign key consistency</li>
                <li>Checked for null values and logical violations</li>
                <li>Validated chronological order of time-series data</li>
                <li>Standardized schema across sales, inventory, and supplier tables</li>
            </ul>
            """
        ),
        (
            "3️⃣ Exploratory Data Analysis",
            "bg-stage-3",
            """
            <ul>
                <li>Analyzed demand distribution across categories</li>
                <li>Studied SKU concentration and revenue contribution</li>
                <li>Examined supplier lead-time variability</li>
                <li>Identified high-volatility and high-impact SKUs</li>
            </ul>
            """
        ),
        (
            "4️⃣ Feature Engineering",
            "bg-stage-4",
            """
            <ul>
                <li>Created lag features and rolling averages</li>
                <li>Engineered volatility metrics (standard deviation, CV)</li>
                <li>Added seasonality and calendar indicators</li>
                <li>Built price-impact and promotional sensitivity features</li>
            </ul>
            """
        ),
        (
            "5️⃣ SKU Segmentation (ABC–XYZ)",
            "bg-stage-5",
            """
            <ul>
                <li>Applied ABC classification based on revenue contribution</li>
                <li>Applied XYZ classification based on demand variability</li>
                <li>Created 3x3 segmentation matrix (AX to CZ)</li>
                <li>Enabled differentiated replenishment strategies</li>
            </ul>
            """
        ),
        (
            "6️⃣ Demand Forecasting",
            "bg-stage-6",
            """
            <ul>
                <li>Forecasted weekly SKU-level demand</li>
                <li>Used time-aware validation strategy</li>
                <li>Evaluated forecast error metrics</li>
                <li>Identified volatile SKUs requiring higher buffers</li>
            </ul>
            """
        ),
        (
            "7️⃣ Inventory Optimization",
            "bg-stage-7",
            """
            <ul>
                <li>Calculated safety stock using demand & lead-time variability</li>
                <li>Derived reorder points aligned with service targets</li>
                <li>Incorporated supplier lead-time variability</li>
                <li>Compared optimized policy vs current policy</li>
            </ul>
            """
        ),
        (
            "8️⃣ Scenario Simulation & Stress Testing",
            "bg-stage-8",
            """
            <ul>
                <li>Simulated demand surges</li>
                <li>Evaluated stockout probability</li>
                <li>Tested supplier delay scenarios</li>
                <li>Assessed robustness of replenishment strategy</li>
            </ul>
            """
        ),
    ]

    for title, bg_class, description in steps:
        st.markdown(f"""
            <div class="glass-card {bg_class}" style="margin-bottom:28px; padding:22px;">
                <div class="pipeline-title">{title}</div>
                {description}
            </div>
        """, unsafe_allow_html=True)

        time.sleep(0.15)  # Delay between steps