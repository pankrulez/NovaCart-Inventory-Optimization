import streamlit as st
import plotly.express as px


def render_analytics(df):

    st.markdown('<div class="section-title">Analytics & Insights</div>', unsafe_allow_html=True)

    tab1, tab2 = st.tabs(["Category Demand", "SKU Segmentation"])

    # =====================================================
    # TAB 1 — CATEGORY DEMAND
    # =====================================================
    with tab1:

        # Informational Header Card
        st.markdown("""
            <div class="glass-card">
            <b>Category-Level Demand Distribution</b><br><br>
            This analysis aggregates total historical demand across product categories.
            <br><br>
            It helps identify:
            <ul>
                <li>High-volume categories requiring tighter replenishment cycles</li>
                <li>Categories sensitive to stockout risk</li>
                <li>Demand concentration across the portfolio</li>
            </ul>
            </div>
        """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        category_demand = (
            df.groupby("category")["units_sold"]
            .sum()
            .reset_index()
        )

        fig = px.bar(
            category_demand,
            x="category",
            y="units_sold",
            color="units_sold",
            color_continuous_scale="blues"
        )

        fig.update_layout(
            template="plotly_dark",
            margin=dict(l=20, r=20, t=20, b=20)
        )

        st.plotly_chart(fig, use_container_width=True)

        st.markdown("""
        Categories with higher cumulative demand require
        stronger service-level protection and shorter review cycles.
        """)

    # =====================================================
    # TAB 2 — SKU SEGMENTATION
    # =====================================================
    with tab2:

        # Informational Header Card
        st.markdown("""
            <div class="glass-card">
            <b>ABC–XYZ Portfolio Segmentation</b><br><br>
            SKUs are classified using:
            <ul>
                <li><b>ABC</b> → Based on revenue contribution</li>
                <li><b>XYZ</b> → Based on demand volatility</li>
            </ul>
            This enables differentiated replenishment strategies.
            </div>
        """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        segment_dist = (
            df[["sku_id", "SKU_segment"]]
            .drop_duplicates()["SKU_segment"]
            .value_counts()
            .reset_index()
        )

        fig2 = px.pie(
            segment_dist,
            names="SKU_segment",
            values="count",
            hole=0.4
        )

        fig2.update_layout(
            template="plotly_dark",
            margin=dict(l=20, r=20, t=20, b=20),
            legend_title="SKU Segment"
        )

        st.plotly_chart(fig2, use_container_width=True)

        # -----------------------------------------
        # Legend Explanation Card
        # -----------------------------------------
        st.markdown("""
            <div class="glass-card">
            <b>Segment Interpretation</b><br><br>
            <b>AX</b> → High revenue contribution, stable demand.  
            Requires strong service-level protection.<br><br>
            
            <b>BX</b> → Moderate revenue contribution, stable demand.  
            Balanced replenishment strategy is suitable.<br><br>
            
            <b>CX</b> → Low revenue contribution, stable demand.  
            Can tolerate leaner inventory buffers.
            </div>
        """, unsafe_allow_html=True)