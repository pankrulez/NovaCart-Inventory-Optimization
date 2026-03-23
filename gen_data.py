import pandas as pd
import numpy as np

# Create 100 SKUs with realistic supply chain variance
data = {
    'SKU': [f'NOVACART-{i:03d}' for i in range(1, 101)],
    'demand': np.random.randint(50, 500, 100),       # Avg weekly demand
    'demand_std': np.random.randint(5, 50, 100),    # Demand volatility
    'lead_time': np.random.randint(1, 6, 100),      # Weeks to deliver
    'lead_time_std': np.random.uniform(0.1, 1.5, 100), # Lead time volatility
    'cost': np.random.randint(10, 1000, 100),       # Unit cost
    'order_cost': [150] * 100                       # Flat shipping/admin cost
}

df = pd.DataFrame(data)
df.to_csv('inventory_sample.csv', index=False)
print("✅ inventory_sample.csv created with 100 SKUs!")