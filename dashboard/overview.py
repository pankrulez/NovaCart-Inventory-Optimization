import streamlit as st


def render_overview(df, policy, inventory_df):

    # ==========================================
    # EXECUTIVE OVERVIEW (UNCHANGED STRUCTURE)
    # ==========================================

    st.markdown('<div class="section-title">Executive Overview</div>', unsafe_allow_html=True)

    col1, col2, col3, col4 = st.columns(4)

    total_skus = policy["sku_id"].nunique()
    avg_ss = policy["adjusted_safety_stock"].mean()
    avg_rop = policy["adjusted_reorder_point"].mean()

    col1.markdown(f"""
        <div class="kpi-card bg-neutral">
            <div class="kpi-title">Service Level Target</div>
            <div class="kpi-value kpi-green">96%</div>
        </div>
    """, unsafe_allow_html=True)

    col2.markdown(f"""
        <div class="kpi-card bg-neutral">
            <div class="kpi-title">Total SKUs Modeled</div>
            <div class="kpi-value">{total_skus}</div>
        </div>
    """, unsafe_allow_html=True)

    col3.markdown(f"""
        <div class="kpi-card bg-neutral">
            <div class="kpi-title">Avg Optimized Safety Stock</div>
            <div class="kpi-value">{avg_ss:,.1f}</div>
        </div>
    """, unsafe_allow_html=True)

    col4.markdown(f"""
        <div class="kpi-card bg-neutral">
            <div class="kpi-title">Avg Optimized Reorder Point</div>
            <div class="kpi-value">{avg_rop:,.1f}</div>
        </div>
    """, unsafe_allow_html=True)
    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)

    st.divider()

    # ==========================================
    # PROBLEM vs SOLUTION SECTION
    # ==========================================

    st.markdown('<div class="section-title">Problem & Solution Overview</div>', unsafe_allow_html=True)

    col_left, col_right = st.columns(2)

    # 🟧 Problem Statement
    col_left.markdown("""
        <div class="glass-card bg-orange">
        <b>🟧 Operational Challenges</b><br><br>
        • Rising stockouts for high-velocity SKUs<br>
        • Overstocking of long-tail SKUs increasing carrying costs<br>
        • Inconsistent demand forecasting across categories<br>
        • Supplier lead-time variability causing replenishment uncertainty<br><br>
        Inventory decisions were rule-based rather than uncertainty-aware.
        </div>
    """, unsafe_allow_html=True)

    # 🟢 Solution
    col_right.markdown("""
        <div class="glass-card bg-solution-green">
        <b>🟢 Optimization Strategy</b><br><br>
        • Built SKU-level weekly demand forecasting models<br>
        • Applied ABC/XYZ segmentation for differentiated replenishment<br>
        • Calculated safety stock using demand and lead-time variability<br>
        • Derived optimized reorder points aligned with service targets<br>
        • Implemented scenario-based stress testing framework
        </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)


    st.divider()

    # ==========================================
    # PROJECT ARCHITECTURE OVERVIEW
    # ==========================================

    st.markdown('<div class="section-title">Project Architecture Overview</div>', unsafe_allow_html=True)

    st.markdown("""
        <div class="glass-card">
        <b>Data Layer</b><br>
        Historical sales, inventory snapshots, and supplier lead-time data were validated and cleaned.
        <br><br>
        <b>Modeling Layer</b><br>
        Forecasting models estimated weekly demand while capturing volatility patterns.
        <br><br>
        <b>Optimization Layer</b><br>
        Safety stock and reorder points were derived using statistical uncertainty modeling.
        <br><br>
        <b>Simulation Layer</b><br>
        Stress-testing scenarios evaluated system robustness under demand surges and supplier delays.
        </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)


    st.divider()

    # ==========================================
    # DECISION IMPACT FRAMEWORK
    # ==========================================

    st.markdown('<div class="section-title">Decision Impact Framework</div>', unsafe_allow_html=True)

    st.markdown("""
        <div class="glass-card">
        The system transforms inventory planning from static thresholds to
        data-driven decision logic.

        It enables:
        <ul>
            <li>Protection of high-priority SKUs</li>
            <li>Controlled risk exposure for volatile items</li>
            <li>Quantifiable service-level alignment</li>
            <li>Capital-efficient replenishment strategy</li>
        </ul>
        </div>
    """, unsafe_allow_html=True)
    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)
