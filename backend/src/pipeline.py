import pandas as pd
import numpy as np
from pathlib import Path
from .utils import load_raw_data, DATA_PATH_PROCESSED
from .inventory import apply_inventory_policy
from .forecasting import train_lag_regression, forecast_with_lag_model

def run_production_pipeline():
    # Load raw data using your utils
    sales, inventory, products, suppliers = load_raw_data()
    
    # Standardize SKU column names
    for df in [sales, inventory, products]:
        if 'sku_id' in df.columns:
            df.rename(columns={'sku_id': 'SKU'}, inplace=True)

    # 1. Weekly Aggregation
    sales['date'] = pd.to_datetime(sales['date'])
    sales['week'] = sales['date'].dt.to_period('W').apply(lambda r: r.start_time)
    weekly_sales = sales.groupby(['SKU', 'week'])['units_sold'].sum().reset_index()
    
    stats_df = weekly_sales.groupby('SKU').agg(
        avg_weekly_demand=('units_sold', 'mean'),
        std_weekly_demand=('units_sold', 'std')
    ).reset_index().fillna(0)

    # 2. ABC Segmentation Logic
    revenue_df = sales.groupby('SKU')['gross_revenue'].sum().reset_index()
    revenue_df = revenue_df.sort_values(by='gross_revenue', ascending=False)
    revenue_df['cum_res'] = revenue_df['gross_revenue'].cumsum() / revenue_df['gross_revenue'].sum()
    revenue_df['SKU_segment'] = revenue_df['cum_res'].apply(lambda x: 'A' if x <= 0.7 else ('B' if x <= 0.9 else 'C'))

    # 3. Master Merge: CRITICAL - Include current_stock and cost_price
    # This provides the "Real Data" context for the Optimizer
    master_df = stats_df.merge(revenue_df[['SKU', 'SKU_segment']], on='SKU')
    master_df = master_df.merge(products[['SKU', 'supplier_id', 'cost_price']], on='SKU')
    master_df = master_df.merge(inventory[['SKU', 'current_stock']], on='SKU')
    master_df = master_df.merge(suppliers.rename(columns={
        'avg_lead_time': 'avg_lt', 
        'lead_time_variability': 'std_lt'
    }), on='supplier_id')

    baseline_records = []
    for sku in master_df['SKU'].unique():
        sku_data = master_df[master_df['SKU'] == sku].iloc[0]
        sku_series = weekly_sales[weekly_sales['SKU'] == sku].sort_values('week')['units_sold']
        
        # Real Model Forecast
        forecast_val = forecast_with_lag_model(*train_lag_regression(sku_series), sku_series) if len(sku_series) > 6 else sku_series.mean()

        # Calculate Policy using your math engine
        ss, rop = apply_inventory_policy(pd.Series({
            'avg_weekly_demand': sku_data['avg_weekly_demand'],
            'std_weekly_demand': sku_data['std_weekly_demand'],
            'avg_lead_time': sku_data['avg_lt'],
            'std_lead_time': sku_data['std_lt'],
            'SKU_segment': sku_data['SKU_segment']
        }))

        baseline_records.append({
            "SKU": sku,
            "forecast_demand": round(forecast_val, 2),
            "safety_stock": int(ss),
            "reorder_point": int(rop),
            "avg_weekly_demand": round(sku_data['avg_weekly_demand'], 2),
            "std_weekly_demand": round(sku_data['std_weekly_demand'], 2),
            "SKU_segment": sku_data['SKU_segment'],
            "avg_lead_time": sku_data['avg_lt'],
            "std_lead_time": sku_data['std_lt'],
            "current_stock": int(sku_data['current_stock']), # Real Data
            "cost_price": float(sku_data['cost_price']),      # Real Data
            "holding_cost": round(ss * (sku_data['cost_price'] * 0.25), 2)
        })

    # Save artifact
    pd.DataFrame(baseline_records).to_csv(DATA_PATH_PROCESSED / "production_baseline.csv", index=False)
    print(f"✅ Pipeline Success: Created baseline for {len(baseline_records)} SKUs with real inventory levels.")

if __name__ == "__main__":
    run_production_pipeline()