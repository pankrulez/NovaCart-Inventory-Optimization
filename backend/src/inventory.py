from typing import Tuple
import numpy as np
from scipy.stats import norm
import pandas as pd


def calculate_z_score(service_level: float) -> float:
    """
    Convert service level into a Z-score.

    Parameters
    ----------
    service_level : float
        Desired service level (e.g., 0.96).

    Returns
    -------
    float
        Corresponding Z-score.
    """
    return float(norm.ppf(service_level))


def calculate_safety_stock(
    avg_demand: float,
    demand_std: float,
    avg_lead_time: float,
    lead_time_std: float,
    service_level: float = 0.96,
) -> float:
    """
    Calculate safety stock considering demand and lead time uncertainty.

    Parameters
    ----------
    avg_demand : float
        Average weekly demand.
    demand_std : float
        Standard deviation of weekly demand.
    avg_lead_time : float
        Average supplier lead time (weeks).
    lead_time_std : float
        Standard deviation of lead time.
    service_level : float
        Desired service level.

    Returns
    -------
    float
        Safety stock quantity.
    """
    z = calculate_z_score(service_level)

    return float(
        z
        * np.sqrt(
            (demand_std ** 2 * avg_lead_time)
            + (avg_demand ** 2 * lead_time_std ** 2)
        )
    )


def calculate_reorder_point(
    avg_demand: float, avg_lead_time: float, safety_stock: float
) -> float:
    """
    Calculate reorder point (ROP).

    Parameters
    ----------
    avg_demand : float
        Average weekly demand.
    avg_lead_time : float
        Average lead time.
    safety_stock : float
        Safety stock.

    Returns
    -------
    float
        Reorder point.
    """
    return avg_demand * avg_lead_time + safety_stock


def segment_multiplier(sku_segment: str) -> float:
    """
    Determine safety stock multiplier based on SKU segment.

    Parameters
    ----------
    sku_segment : str
        Combined ABC/XYZ segment (e.g., 'AX', 'CZ').

    Returns
    -------
    float
        Multiplier value.
    """
    if sku_segment.startswith("A"):
        return 1.2
    elif sku_segment.startswith("B"):
        return 1.0
    else:
        return 0.8


def apply_inventory_policy(
    row: pd.Series, service_level: float = 0.96
) -> Tuple[float, float]:
    """
    Apply inventory policy to a single SKU.

    Parameters
    ----------
    row : pd.Series
        Row containing demand, lead time, and SKU segment data.
    service_level : float
        Desired service level.

    Returns
    -------
    Tuple[float, float]
        Adjusted safety stock and reorder point.
    """
    base_ss = calculate_safety_stock(
        avg_demand=row["avg_weekly_demand"],
        demand_std=row["std_weekly_demand"],
        avg_lead_time=row["avg_lead_time"],
        lead_time_std=row["std_lead_time"],
        service_level=service_level,
    )

    multiplier = segment_multiplier(row["SKU_segment"])
    adjusted_ss = base_ss * multiplier

    rop = calculate_reorder_point(
        row["avg_weekly_demand"],
        row["avg_lead_time"],
        adjusted_ss,
    )

    return adjusted_ss, rop