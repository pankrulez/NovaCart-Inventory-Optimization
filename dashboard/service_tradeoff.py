import streamlit as st
import numpy as np
import plotly.graph_objects as go
from scipy.stats import norm


def render_service_tradeoff():

    st.markdown('<div class="section-title">Service Level vs Working Capital</div>', unsafe_allow_html=True)

    st.markdown("""
        <div class="glass-card">
        Demonstrates how increasing service targets increases safety stock
        and capital exposure.
        </div>
    """, unsafe_allow_html=True)

    st.markdown("<div style='margin-top:30px;'></div>", unsafe_allow_html=True)

    # Narrow centered inputs
    col_center = st.columns([1, 2, 1])[1]

    with col_center:
        avg_demand = st.number_input("Average Weekly Demand", 10, 500, 120)
        demand_std = st.number_input("Demand Std Dev", 1, 150, 25)
        lead_time = st.number_input("Lead Time (weeks)", 1, 12, 4)
        lead_time_std = st.number_input("Lead Time Std Dev", 0.0, 6.0, 1.0)
        unit_cost = st.number_input("Unit Cost ($)", 1.0, 500.0, 50.0)

    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)

    service_levels = np.linspace(0.85, 0.99, 50)
    capital_required = []

    for sl in service_levels:
        z = norm.ppf(sl)

        std_lt = np.sqrt(
            (demand_std ** 2 * lead_time)
            + (avg_demand ** 2 * lead_time_std ** 2)
        )

        safety_stock = z * std_lt
        capital_required.append(safety_stock * unit_cost)

    fig = go.Figure()

    fig.add_trace(go.Scatter(
        x=service_levels * 100,
        y=capital_required,
        mode="lines"
    ))

    fig.update_layout(
        template="plotly_dark",
        height=500,
        xaxis_title="Service Level (%)",
        yaxis_title="Working Capital Required ($)"
    )

    st.plotly_chart(fig, use_container_width=True)