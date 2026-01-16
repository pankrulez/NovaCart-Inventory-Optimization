from typing import Tuple
import pandas as pd
import numpy as np

def load_raw_data(base_path="data/raw/"):
    """
    Load commonly used raw datasets across notebooks.
    
    Returns
    -------
        sales_df, inventory_df, products_df, suppliers_df
    """
    sales = pd.read_csv(f"{base_path}/sales.csv")
    inventory = pd.read_csv(f"{base_path}/inventory.csv")
    products = pd.read_csv(f"{base_path}/products.csv")
    suppliers = pd.read_csv(f"{base_path}/suppliers.csv")

    return sales, inventory, products, suppliers


def load_processed_data(
    base_path: str = "data/processed/"
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Load cleaned and processed datasets used across notebooks.

    Parameters
    ----------
    base_path : str
        Base directory where processed CSV files are stored.

    Returns
    -------
    Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]
        sales_df, inventory_df, products_df, suppliers_df
    """
    sales = pd.read_csv(f"{base_path}/sales_clean.csv")
    inventory = pd.read_csv(f"{base_path}/inventory_clean.csv")
    products = pd.read_csv(f"{base_path}/products_clean.csv")
    suppliers = pd.read_csv(f"{base_path}/suppliers_clean.csv")

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