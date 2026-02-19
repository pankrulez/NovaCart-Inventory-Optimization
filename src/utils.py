from typing import Tuple
import pandas as pd
import numpy as np
from pathlib import Path

BASE_PATH = Path(__file__).parent.parent
DATA_PATH_RAW = BASE_PATH / "data" / "raw"
DATA_PATH_PROCESSED = BASE_PATH / "data" / "processed"

def load_raw_data(DATA_PATH = DATA_PATH_RAW) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Load commonly used raw datasets across notebooks.
    
    Returns
    -------
        sales_df, inventory_df, products_df, suppliers_df
    """
    sales = pd.read_csv(f"{DATA_PATH}/sales_fact.csv")
    inventory = pd.read_csv(f"{DATA_PATH}/inventory_snapshot.csv")
    products = pd.read_csv(f"{DATA_PATH}/products_master.csv")
    suppliers = pd.read_csv(f"{DATA_PATH}/suppliers_master.csv")

    return sales, inventory, products, suppliers


def load_processed_data(DATA_PATH = DATA_PATH_PROCESSED) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Load cleaned and processed datasets used across notebooks.

    Parameters
    ----------
    DATA_PATH_PROCESSED : Path
        Base directory where processed CSV files are stored.

    Returns
    -------
    Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]
        sales_df, inventory_df, products_df, suppliers_df
    """
    sales = pd.read_csv(f"{DATA_PATH}/sales_clean.csv")
    inventory = pd.read_csv(f"{DATA_PATH}/inventory_clean.csv")
    products = pd.read_csv(f"{DATA_PATH}/products_clean.csv")
    suppliers = pd.read_csv(f"{DATA_PATH}/suppliers_clean.csv")

    return sales, inventory, products, suppliers


def check_missing_values(df: pd.DataFrame) -> pd.Series:
    """
    Return a sorted count of missing values per column.

    Parameters
    ----------
    df : pd.DataFrame
        Input dataframe.

    Returns
    -------
    pd.Series
        Missing value counts sorted in descending order.
    """
    return df.isna().sum().sort_values(ascending=False)


def clip_negative_values(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """
    Clip negative values to zero for specified numeric columns.

    Parameters
    ----------
    df : pd.DataFrame
        Input dataframe.
    columns : list[str]
        Columns to clip.

    Returns
    -------
    pd.DataFrame
        Dataframe with clipped values.
    """
    for col in columns:
        df[col] = df[col].clip(lower=0)
    return df


def safe_divide(numerator: np.ndarray, denominator: np.ndarray) -> np.ndarray:
    """
    Perform element-wise division while avoiding division by zero.

    Parameters
    ----------
    numerator : np.ndarray
    denominator : np.ndarray

    Returns
    -------
    np.ndarray
        Result of safe division.
    """
    return np.where(denominator == 0, 0, numerator / denominator)