from typing import Tuple, Iterable
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_percentage_error, root_mean_squared_error


def train_test_split_time(
    series: pd.Series, test_size: float = 0.2
) -> Tuple[pd.Series, pd.Series]:
    """
    Perform a time-aware train-test split.

    Parameters
    ----------
    series : pd.Series
        Time-ordered series.
    test_size : float
        Fraction of data used for testing.

    Returns
    -------
    Tuple[pd.Series, pd.Series]
        Train and test series.
    """
    split_idx = int(len(series) * (1 - test_size))
    return series.iloc[:split_idx], series.iloc[split_idx:]


def naive_forecast(train_series: pd.Series, horizon: int) -> np.ndarray:
    """
    Generate a naive forecast using the last observed value.

    Parameters
    ----------
    train_series : pd.Series
        Training time series.
    horizon : int
        Number of future periods to forecast.

    Returns
    -------
    np.ndarray
        Forecasted values.
    """
    return np.repeat(train_series.iloc[-1], horizon)


def prepare_lag_features(
    series: pd.Series, lags: Iterable[int] = (1, 2, 4)
) -> pd.DataFrame:
    """
    Create lagged features for time-series regression.

    Parameters
    ----------
    series : pd.Series
        Input time series.
    lags : Iterable[int]
        Lag periods.

    Returns
    -------
    pd.DataFrame
        Dataframe with target and lag features.
    """
    df = pd.DataFrame({"y": series})
    for lag in lags:
        df[f"lag_{lag}"] = series.shift(lag)

    return df.dropna()


def train_lag_regression(
    series: pd.Series,
) -> Tuple[LinearRegression, list[str]]:
    """
    Train a lag-based linear regression model.

    Parameters
    ----------
    series : pd.Series
        Input time series.

    Returns
    -------
    Tuple[LinearRegression, list[str]]
        Trained model and feature column names.
    """
    data = prepare_lag_features(series)
    X = data.drop("y", axis=1)
    y = data["y"]

    model = LinearRegression()
    model.fit(X, y)

    return model, list(X.columns)


def safe_train_regression(series: pd.Series):
    if len(series) < 6: # Need enough for lags + 1 target
        return None, None
    try:
        return train_lag_regression(series)
    except:
        return None, None


def forecast_with_lag_model(
    model: LinearRegression,
    feature_cols: list[str],
    recent_series: pd.Series,
) -> float:
    """
    Generate a one-step forecast using a trained lag model.

    Parameters
    ----------
    model : LinearRegression
        Trained regression model.
    feature_cols : list[str]
        Feature column names.
    recent_series : pd.Series
        Most recent observations.

    Returns
    -------
    float
        Forecasted value.
    """
    features = {
        col: recent_series.iloc[-int(col.split("_")[1])]
        for col in feature_cols
    }

    X_pred = pd.DataFrame([features])
    return float(model.predict(X_pred)[0])


def evaluate_forecast(
    y_true: pd.Series, y_pred: np.ndarray
) -> dict[str, float]:
    """
    Evaluate forecast accuracy.

    Parameters
    ----------
    y_true : pd.Series
        Actual values.
    y_pred : np.ndarray
        Predicted values.

    Returns
    -------
    dict[str, float]
        MAPE and RMSE metrics.
    """
    return {
        "MAPE": mean_absolute_percentage_error(y_true, y_pred),
        "RMSE": root_mean_squared_error(y_true, y_pred),
    }