import streamlit as st
import pandas as pd
import time


def animated_kpi(title: str, value: float, decimals: int = 2):

    placeholder = st.empty()
    frames = 25
    sleep_time = 0.4 / frames

    for i in range(frames + 1):
        current_value = value * (i / frames)

        placeholder.markdown(f"""
            <div class="kpi-card bg-neutral">
                <div class="kpi-title">{title}</div>
                <div class="kpi-value">
                    {current_value:,.{decimals}f}
                </div>
            </div>
        """, unsafe_allow_html=True)

        time.sleep(sleep_time)


def render_policy_comparison(policy_df, inventory_df):

    st.markdown('<div class="section-title">Current vs Optimized Policy</div>', unsafe_allow_html=True)

    inventory_current = inventory_df.rename(columns={
        "safety_stock": "current_safety_stock",
        "reorder_point": "current_reorder_point"
    })

    policy_optimized = policy_df.rename(columns={
        "adjusted_safety_stock": "optimized_safety_stock",
        "adjusted_reorder_point": "optimized_reorder_point"
    })

    merged = policy_optimized.merge(
        inventory_current[[
            "sku_id",
            "current_safety_stock",
            "current_reorder_point"
        ]],
        on="sku_id",
        how="left"
    )

    merged["ss_change"] = merged["optimized_safety_stock"] - merged["current_safety_stock"]
    merged["rop_change"] = merged["optimized_reorder_point"] - merged["current_reorder_point"]

    st.markdown("""
        <div class="glass-card">
        Compares legacy replenishment thresholds with optimized,
        volatility-aware policy outputs.
        </div>
    """, unsafe_allow_html=True)

    st.markdown("<div style='margin-top:30px;'></div>", unsafe_allow_html=True)

    col1, col2 = st.columns(2)

    with col1:
        animated_kpi("Avg Safety Stock Change", merged["ss_change"].mean())

    with col2:
        animated_kpi("Avg Reorder Point Change", merged["rop_change"].mean())

    st.markdown("<div style='margin-top:35px;'></div>", unsafe_allow_html=True)

    st.markdown("""
        <div class="glass-card">
        <b>Detailed Comparison (Sample)</b>
        </div>
    """, unsafe_allow_html=True)

    st.dataframe(
        merged[[
            "sku_id",
            "current_safety_stock",
            "optimized_safety_stock",
            "ss_change",
            "current_reorder_point",
            "optimized_reorder_point",
            "rop_change"
        ]].head(50),
        use_container_width=True
    )