import streamlit as st
import pandas as pd
from pathlib import Path

from dashboard.overview import render_overview
from dashboard.analytics import render_analytics
from dashboard.live_scoring import render_live_scoring
from dashboard.pipeline import render_pipeline
from dashboard.holding_cost import render_holding_cost
from dashboard.policy_comparison import render_policy_comparison
from dashboard.forecast_evaluation import render_forecast_evaluation
from dashboard.service_tradeoff import render_service_tradeoff

# ---------------------------------
# Page Configuration
# ---------------------------------
st.set_page_config(
    page_title="NovaCart Inventory Intelligence",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------
# Load Custom CSS
# ---------------------------------
def load_css():
    with open("assets/styles.css") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css()

# ---------------------------------
# Data Loading
# ---------------------------------
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

@st.cache_data
def load_data():
    df = pd.read_csv(DATA_DIR / "processed" / "feature_engineered_with_segments.csv")
    policy = pd.read_csv(DATA_DIR / "processed" / "inventory_replenishment_policy.csv")
    inventory = pd.read_csv(DATA_DIR / "raw" / "inventory_snapshot.csv")
    return df, policy, inventory

df, policy, inventory_df = load_data()

# ---------------------------------
# Sidebar Navigation (Styled)
# ---------------------------------
st.sidebar.markdown("""
    <div style="font-size:1.4rem;
                font-weight:600;
                background: linear-gradient(90deg,#6f8cff,#c084fc);
                -webkit-background-clip:text;
                -webkit-text-fill-color:transparent;">
        NovaCart Intelligence
    </div>
""", unsafe_allow_html=True)

st.sidebar.markdown(
    "<div style='margin-bottom:20px; opacity:0.7;'>Inventory Optimization System</div>",
    unsafe_allow_html=True
)

selected_tab = st.sidebar.radio(
    "Navigation",
    [
        "Project Overview",
        "Plots & Analytics",
        "Live Scoring",
        "Inventory Cost Simulator",
        "Policy Comparison",
        "Forecast Evaluation",
        "Service Level Tradeoff",
        "Project Pipeline"
    ]
)

# ---------------------------------
# Routing
# ---------------------------------
if selected_tab == "Project Overview":
    render_overview(df, policy, inventory_df)

elif selected_tab == "Plots & Analytics":
    render_analytics(df)

elif selected_tab == "Live Scoring":
    render_live_scoring()
    
elif selected_tab == "Inventory Cost Simulator":
    render_holding_cost()
    
elif selected_tab == "Policy Comparison":
    render_policy_comparison(policy, inventory_df)

elif selected_tab == "Forecast Evaluation":
    render_forecast_evaluation(df)

elif selected_tab == "Service Level Tradeoff":
    render_service_tradeoff()

elif selected_tab == "Project Pipeline":
    render_pipeline()