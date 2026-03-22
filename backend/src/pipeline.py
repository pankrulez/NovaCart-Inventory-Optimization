import pandas as pd
import joblib
import numpy as np
from pathlib import Path

# Import your existing logic using relative imports
from .utils import load_raw_data, DATA_PATH_PROCESSED
from .forecasting import train_lag_regression, forecast_with_lag_model
from .inventory import apply_inventory_policy

# Define paths
MODEL_PATH = Path(__file__).resolve().parent.parent.parent / "backend" / "models"
MODEL_PATH.mkdir(parents=True, exist_ok=True)

def run_production_pipeline():
    print("🚀 Starting NovaCart Production Pipeline...")
    
    # 1. Load Raw Data (Using your utils.py function)
    sales, inventory, products, suppliers = load_raw_data()
    
    # --- DATA PREPARATION & CLEANING ---
    # Fix naming: Convert everything to a standard 'SKU' for internal logic
    for df in [sales, inventory, products]:
        if 'sku_id' in df.columns:
            df.rename(columns={'sku_id': 'SKU'}, inplace=True)
            
    # Convert dates and aggregate sales to Weekly Demand
    sales['date'] = pd.to_datetime(sales['date'])
    sales['week'] = sales['date'].dt.to_period('W').apply(lambda r: r.start_time)
    
    weekly_sales = sales.groupby(['SKU', 'week'])['units_sold'].sum().reset_index()
    
    # Calculate Weekly Stats (Required by inventory.py)
    stats_df = weekly_sales.groupby('SKU').agg(
        avg_weekly_demand=('units_sold', 'mean'),
        std_weekly_demand=('units_sold', 'std')
    ).reset_index().fillna(0)

    # 2. ABC SEGMENTATION (Required by inventory.py)
    # Calculate revenue per SKU to determine ABC segments
    revenue_df = sales.groupby('SKU')['gross_revenue'].sum().reset_index()
    revenue_df = revenue_df.sort_values(by='gross_revenue', ascending=False)
    revenue_df['cum_res'] = revenue_df['gross_revenue'].cumsum() / revenue_df['gross_revenue'].sum()
    revenue_df['SKU_segment'] = revenue_df['cum_res'].apply(lambda x: 'A' if x <= 0.7 else ('B' if x <= 0.9 else 'C'))

    # 3. MERGE LEAD TIMES (From suppliers_master.csv)
    # Mapping 'lead_time_variability' to 'std_lead_time'
    suppliers_clean = suppliers.rename(columns={
        'avg_lead_time': 'avg_lead_time', 
        'lead_time_variability': 'std_lead_time'
    })
    
    # Build the master processing dataframe
    master_df = stats_df.merge(revenue_df[['SKU', 'SKU_segment']], on='SKU')
    master_df = master_df.merge(products[['SKU', 'supplier_id']], on='SKU')
    master_df = master_df.merge(suppliers_clean[['supplier_id', 'avg_lead_time', 'std_lead_time']], on='supplier_id')

    # 4. TRAIN FORECASTING MODELS & APPLY POLICY
    trained_models = {}
    baseline_records = []

    for sku in master_df['SKU'].unique():
        sku_series = weekly_sales[weekly_sales['SKU'] == sku].sort_values('week')['units_sold']
        
        # Train if enough history exists
        if len(sku_series) > 6:
            model, features = train_lag_regression(sku_series)
            trained_models[sku] = {"model": model, "features": features}
            forecast_val = forecast_with_lag_model(model, features, sku_series)
        else:
            forecast_val = sku_series.mean()

        # Apply Inventory Policy logic from your inventory.py
        sku_row = master_df[master_df['SKU'] == sku].iloc[0]
        ss, rop = apply_inventory_policy(sku_row)

        baseline_records.append({
            "SKU": sku,
            "forecast_demand": round(forecast_val, 2),
            "safety_stock": round(ss, 0),
            "reorder_point": round(rop, 0),
            "avg_weekly_demand": round(sku_row['avg_weekly_demand'], 2),
            "std_weekly_demand": round(sku_row['std_weekly_demand'], 2),
            "SKU_segment": sku_row['SKU_segment'],
            "avg_lead_time": sku_row['avg_lead_time']
        })

    # 5. SAVE ARTIFACTS
    joblib.dump(trained_models, MODEL_PATH / "sku_models.pkl")
    
    production_baseline = pd.DataFrame(baseline_records)
    # Add extra metrics for the Dashboard Health Score
    production_baseline['service_level'] = 0.96
    production_baseline['holding_cost'] = production_baseline['safety_stock'] * 2.5
    
    production_baseline.to_csv(DATA_PATH_PROCESSED / "production_baseline.csv", index=False)
    
    print(f"✅ Pipeline Complete! Processed {len(production_baseline)} SKUs.")
    print(f"📍 Artifacts saved in {DATA_PATH_PROCESSED}")

if __name__ == "__main__":
    run_production_pipeline()