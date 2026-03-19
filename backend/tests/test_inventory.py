import pandas as pd
from src.inventory import (
    calculate_z_score,
    calculate_safety_stock,
    calculate_reorder_point,
    segment_multiplier,
    apply_inventory_policy,
)


def test_calculate_z_score():
    z = calculate_z_score(0.95)
    assert z > 1.6 and z < 1.7  # approx 1.645


def test_calculate_safety_stock_positive():
    ss = calculate_safety_stock(
        avg_demand=100,
        demand_std=10,
        avg_lead_time=5,
        lead_time_std=1,
        service_level=0.96,
    )

    assert ss > 0


def test_calculate_reorder_point():
    rop = calculate_reorder_point(
        avg_demand=50,
        avg_lead_time=4,
        safety_stock=20,
    )

    assert rop == 50 * 4 + 20


def test_segment_multiplier():
    assert segment_multiplier("AX") == 1.2
    assert segment_multiplier("BY") == 1.0
    assert segment_multiplier("CZ") == 0.8


def test_apply_inventory_policy():
    row = pd.Series({
        "avg_weekly_demand": 40,
        "std_weekly_demand": 8,
        "avg_lead_time": 3,
        "std_lead_time": 1,
        "SKU_segment": "AX",
    })

    safety_stock, rop = apply_inventory_policy(row)

    assert safety_stock > 0
    assert rop > safety_stock