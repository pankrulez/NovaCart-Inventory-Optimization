import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
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


def render_forecast_evaluation(df):

    st.markdown('<div class="section-title">Forecast Accuracy Evaluation</div>', unsafe_allow_html=True)

    try:
        df = pd.read_csv("data/processed/forecast_results.csv")
    except FileNotFoundError:
        st.error("Run forecasting notebook to generate forecast_results.csv")
        return

    df["error"] = df["actual_demand"] - df["forecast_demand"]
    df["abs_error"] = abs(df["error"])
    df["ape"] = df["abs_error"] / df["actual_demand"].replace(0, np.nan)

    mae = df["abs_error"].mean()
    mape = df["ape"].mean() * 100
    rmse = np.sqrt((df["error"] ** 2).mean())

    st.markdown("""
        <div class="glass-card">
        Evaluates forecasting performance using standard regression metrics.
        </div>
    """, unsafe_allow_html=True)

    st.markdown("<div style='margin-top:30px;'></div>", unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)

    with col1:
        animated_kpi("MAE", mae)

    with col2:
        animated_kpi("MAPE (%)", mape)

    with col3:
        animated_kpi("RMSE", rmse)

    st.markdown("<div style='margin-top:40px;'></div>", unsafe_allow_html=True)

    st.markdown("""
        <div class="glass-card">
        <b>Error Distribution</b>
        </div>
    """, unsafe_allow_html=True)

    fig = px.histogram(df, x="error", nbins=40)
    fig.update_layout(template="plotly_dark", height=450)
    st.plotly_chart(fig, use_container_width=True)