import streamlit as st
import numpy as np
import time
import plotly.graph_objects as go


# -------------------------------------------------
# Animated KPI Component
# -------------------------------------------------
def animated_kpi(title: str,
                 value: float,
                 prefix: str = "",
                 suffix: str = "",
                 decimals: int = 2):

    placeholder = st.empty()
    frames = 30
    duration = 0.6
    sleep_time = duration / frames

    for i in range(frames + 1):
        current_value = value * (i / frames)

        placeholder.markdown(f"""
            <div class="kpi-card bg-neutral">
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
def render_holding_cost():

    st.markdown('<div class="section-title">Inventory Holding Cost Simulator</div>', unsafe_allow_html=True)

    # ==================================================
    # WHAT THIS SECTION DOES
    # ==================================================

    with st.expander("What This Simulator Does"):
            st.markdown("""
            This section evaluates the financial trade-off between:
            - Holding inventory (capital tied up in stock)
            - Placing frequent orders (operational ordering cost)
            It demonstrates how order quantity decisions directly impact total annual inventory cost.
            """, unsafe_allow_html=True)


    # ==================================================
    # INPUT SECTION
    # ==================================================
    st.markdown('<div class="section-title">Input Assumptions</div>', unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)

    with col1:
        annual_demand = st.number_input("Annual Demand (units)", min_value=100, value=10000)
        order_quantity = st.number_input("Order Quantity (units)", min_value=1, value=500)

    with col2:
        holding_cost_per_unit = st.number_input("Holding Cost per Unit ($)", min_value=0.1, value=5.0)
        ordering_cost = st.number_input("Ordering Cost per Order ($)", min_value=1.0, value=200.0)

    with col3:
        unit_cost = st.number_input("Unit Cost ($)", min_value=0.1, value=50.0)

    st.markdown("""
    <small>
    Annual Demand: Total units required per year.  
    <ul>
        <li>Order Quantity: Units ordered per replenishment cycle.</li>
        <li>Holding Cost: Annual storage & capital cost per unit.</li>
        <li>Ordering Cost: Administrative & logistics cost per order.</li>
        <li>Unit Cost: Purchase price per unit (used for capital impact).</li>
    </ul>
    </small>
    """, unsafe_allow_html=True)

    st.divider()

    # ==================================================
    # CALCULATIONS
    # ==================================================
    average_inventory = order_quantity / 2
    annual_holding_cost = average_inventory * holding_cost_per_unit
    number_of_orders = annual_demand / order_quantity
    annual_ordering_cost = number_of_orders * ordering_cost
    total_inventory_cost = annual_holding_cost + annual_ordering_cost
    working_capital = average_inventory * unit_cost

    eoq = np.sqrt((2 * annual_demand * ordering_cost) / holding_cost_per_unit)
    eoq_difference = order_quantity - eoq

    # ==================================================
    # COST KPIs
    # ==================================================
    st.markdown('<div class="section-title">Annual Cost Breakdown</div>', unsafe_allow_html=True)

    col_a, col_b, col_c = st.columns(3)

    with col_a:
        animated_kpi("Annual Holding Cost", annual_holding_cost, prefix="$")

    with col_b:
        animated_kpi("Annual Ordering Cost", annual_ordering_cost, prefix="$")

    with col_c:
        animated_kpi("Total Inventory Cost", total_inventory_cost, prefix="$")
    
    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)

    st.markdown("""
    Holding cost increases with larger order sizes.  
    Ordering cost increases with smaller order sizes.
    """)

    st.divider()

    # ==================================================
    # EOQ SECTION
    # ==================================================
    st.markdown('<div class="section-title">Economic Order Quantity (EOQ)</div>', unsafe_allow_html=True)

    col1, col2 = st.columns(2)

    with col1:
        animated_kpi("Calculated EOQ", eoq, decimals=1)

    with col2:
        animated_kpi("Difference from EOQ", eoq_difference, decimals=1)
    
    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)


    st.markdown("""
    EOQ represents the order size that minimizes total annual inventory cost.
    Deviating significantly from EOQ increases either holding or ordering cost.
    """)

    st.divider()

    # ==================================================
    # COST CURVE
    # ==================================================
    st.markdown('<div class="section-title">Cost vs Order Quantity Curve</div>', unsafe_allow_html=True)

    q_values = np.linspace(1, annual_demand, 200)
    holding_curve = (q_values / 2) * holding_cost_per_unit
    ordering_curve = (annual_demand / q_values) * ordering_cost
    total_curve = holding_curve + ordering_curve

    fig = go.Figure()

    fig.add_trace(go.Scatter(x=q_values, y=holding_curve, mode='lines', name="Holding Cost"))
    fig.add_trace(go.Scatter(x=q_values, y=ordering_curve, mode='lines', name="Ordering Cost"))
    fig.add_trace(go.Scatter(x=q_values, y=total_curve, mode='lines', line=dict(width=4), name="Total Cost"))

    fig.add_vline(x=eoq, line_width=3, line_dash="dash", line_color="red", annotation_text="EOQ")

    fig.update_layout(
        template="plotly_dark",
        height=500,
        xaxis_title="Order Quantity",
        yaxis_title="Annual Cost",
        margin=dict(l=20, r=20, t=40, b=20)
    )

    st.plotly_chart(fig, use_container_width=True)

    st.markdown("""
    The U-shaped curve demonstrates the trade-off:
    - Small orders → High ordering cost  
    - Large orders → High holding cost  
    EOQ balances the two.
    """)

    st.divider()

    # ==================================================
    # CAPITAL IMPACT
    # ==================================================
    st.markdown('<div class="section-title">Working Capital Impact</div>', unsafe_allow_html=True)

    animated_kpi("Working Capital Tied Up", working_capital, prefix="$")
    
    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)

    st.markdown("""
    Working capital reflects the average financial value locked in inventory.
    Higher order quantities increase capital exposure.
    """)