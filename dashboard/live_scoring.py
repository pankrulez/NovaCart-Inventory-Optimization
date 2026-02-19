import streamlit as st
import numpy as np
import plotly.graph_objects as go
from scipy.stats import norm
import time


# -------------------------------------------------
# Animated KPI
# -------------------------------------------------
def animated_kpi(title: str,
                 value: float,
                 prefix: str = "",
                 suffix: str = "",
                 decimals: int = 2):

    placeholder = st.empty()
    frames = 25
    sleep_time = 0.5 / frames

    for i in range(frames + 1):
        current_value = value * (i / frames)

        placeholder.markdown(f"""
            <div class="kpi-card">
                <div class="kpi-title">{title}</div>
                <div class="kpi-value">
                    {prefix}{current_value:,.{decimals}f}{suffix}
                </div>
            </div>
        """, unsafe_allow_html=True)

        time.sleep(sleep_time)


# -------------------------------------------------
# Main Render
# -------------------------------------------------
def render_live_scoring():

    st.markdown('<div class="section-title">Live Inventory Simulation</div>', unsafe_allow_html=True)

    # ======================================================
    # Intro Explainability
    # ======================================================
    with st.expander("What This Simulation Does"):
        st.markdown("""
        This tool models uncertainty in:
        - Demand variability
        - Supplier lead-time variability
        
        It calculates:
        - Safety stock
        - Reorder point
        - Stockout probability
        
        The goal is to maintain a chosen service level while controlling excess inventory.
        """)

    st.markdown("<div style='margin-top:25px;'></div>", unsafe_allow_html=True)

    # ======================================================
    # Guided Mode Toggle
    # ======================================================
    guided_mode = st.toggle("Enable Step-by-Step Guided Mode", value=False)

    if guided_mode:
        current_step = st.radio(
            "Navigate Steps",
            [
                "1️⃣ Understand Inputs",
                "2️⃣ Safety Stock Calculation",
                "3️⃣ Demand Distribution",
                "4️⃣ Risk Interpretation"
            ]
        )
    else:
        current_step = None

    st.markdown("<div style='margin-top:30px;'></div>", unsafe_allow_html=True)

    # ======================================================
    # STEP 1 — INPUTS
    # ======================================================
    if not guided_mode or current_step == "1️⃣ Understand Inputs":

        st.markdown("### Configure Demand & Lead-Time Assumptions")

        col1, col2, col3 = st.columns(3)

        with col1:
            avg_demand = st.slider("Avg Weekly Demand", 10, 500, 120)
            demand_std = st.slider("Demand Std Dev", 1, 150, 25)

        with col2:
            lead_time = st.slider("Lead Time (weeks)", 1, 12, 4)
            lead_time_std = st.slider("Lead Time Std Dev", 0, 6, 1)

        with col3:
            service_level = st.slider("Target Service Level", 0.80, 0.99, 0.96)

        if guided_mode:
            st.info("These parameters define how much uncertainty your system must absorb.")

        with st.expander("Understanding the Inputs"):
            st.markdown("""
            **Average Weekly Demand** – Expected weekly sales.  
            **Demand Std Dev** – Measures unpredictability in sales.  
            **Lead Time** – Time between placing and receiving order.  
            **Lead Time Std Dev** – Variability in supplier delivery.  
            **Target Service Level** – Desired probability of avoiding stockout.
            """)

    else:
        avg_demand = 120
        demand_std = 25
        lead_time = 4
        lead_time_std = 1
        service_level = 0.96

    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)

    # ======================================================
    # CALCULATIONS
    # ======================================================
    z = norm.ppf(service_level)

    mean_lt = avg_demand * lead_time
    std_lt = np.sqrt(
        (demand_std ** 2 * lead_time)
        + (avg_demand ** 2 * lead_time_std ** 2)
    )

    safety_stock = z * std_lt
    reorder_point = mean_lt + safety_stock

    # ======================================================
    # STEP 2 — SAFETY STOCK
    # ======================================================
    if not guided_mode or current_step == "2️⃣ Safety Stock Calculation":

        st.markdown('<div class="section-title">Safety Stock & Reorder Point</div>', unsafe_allow_html=True)

        st.markdown("<div style='margin-top:20px;'></div>", unsafe_allow_html=True)

        col1, col2 = st.columns(2)

        with col1:
            animated_kpi("Calculated Safety Stock", safety_stock)

        with col2:
            animated_kpi("Reorder Point", reorder_point)

        if guided_mode:
            st.info("Higher volatility or higher service targets increase safety stock.")
        
        st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)

        with st.expander("How Safety Stock Is Calculated"):
            st.markdown("""
            Safety Stock = Z × Standard Deviation of Lead-Time Demand

            Z → Derived from service level  
            Lead-Time Demand Std Dev → Combines demand and lead-time variability.
            """)

    st.markdown("<div style='margin-top:45px;'></div>", unsafe_allow_html=True)

    # ======================================================
    # STEP 3 — DISTRIBUTION
    # ======================================================
    if not guided_mode or current_step == "3️⃣ Demand Distribution":

        st.markdown('<div class="section-title">Demand Distribution During Lead Time</div>', unsafe_allow_html=True)

        x = np.linspace(mean_lt - 4 * std_lt, mean_lt + 4 * std_lt, 500)
        y = norm.pdf(x, mean_lt, std_lt)

        fig = go.Figure()

        fig.add_trace(go.Scatter(x=x, y=y, mode='lines', name="Demand Distribution"))

        fig.add_vline(
            x=reorder_point,
            line_width=3,
            line_dash="dash",
            line_color="red",
            annotation_text="Reorder Point"
        )

        fig.update_layout(
            template="plotly_dark",
            height=450,
            xaxis_title="Demand During Lead Time",
            yaxis_title="Probability Density",
            margin=dict(l=20, r=20, t=40, b=20)
        )

        st.plotly_chart(fig, use_container_width=True)

        if guided_mode:
            st.info("The reorder point must cover most of the demand distribution to avoid stockouts.")

        with st.expander("How to Interpret the Graph"):
            st.markdown("""
            • Center = Expected demand  
            • Wider curve = Higher uncertainty  
            • Red line = Reorder point  
            If demand exceeds reorder point → stockout occurs.
            """)

    st.markdown("<div style='margin-top:45px;'></div>", unsafe_allow_html=True)

    # ======================================================
    # STEP 4 — RISK INTERPRETATION
    # ======================================================
    if not guided_mode or current_step == "4️⃣ Risk Interpretation":

        st.markdown('<div class="section-title">Risk Evaluation</div>', unsafe_allow_html=True)

        stockout_probability = 1 - norm.cdf(reorder_point, mean_lt, std_lt)
        service_level_estimated = 1 - stockout_probability

        st.markdown("<div style='margin-top:20px;'></div>", unsafe_allow_html=True)

        col1, col2 = st.columns(2)

        with col1:
            animated_kpi("Estimated Service Level", float(service_level_estimated) * 100, suffix="%")

        with col2:
            animated_kpi("Stockout Probability", float(stockout_probability) * 100, suffix="%")

        if guided_mode:
            st.info("If stockout probability rises above acceptable levels, service targets are not met.")

        st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)
        
        with st.expander("Why Risk Matters"):
            st.markdown("""
            Stockouts result in:
            - Lost revenue  
            - Customer dissatisfaction  
            - Lower conversion rates  
            
            Balancing service level and inventory cost is critical.
            """)