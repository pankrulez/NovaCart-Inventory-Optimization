import pandas as pd
import numpy as np
from backend.src.forecasting import (
    train_test_split_time,
    naive_forecast,
    prepare_lag_features,
    evaluate_forecast,
)


def test_train_test_split_time():
    series = pd.Series(range(10))
    train, test = train_test_split_time(series, test_size=0.2)

    assert len(train) == 8
    assert len(test) == 2
    assert train.iloc[-1] == 7
    assert test.iloc[0] == 8


def test_naive_forecast():
    train = pd.Series([5, 7, 9])
    forecast = naive_forecast(train, horizon=3)

    assert len(forecast) == 3
    assert (forecast == 9).all()


def test_prepare_lag_features():
    series = pd.Series(range(10))
    df = prepare_lag_features(series, lags=[1, 2])

    assert "lag_1" in df.columns
    assert "lag_2" in df.columns
    assert len(df) == 8  # first 2 rows dropped


def test_evaluate_forecast():
    y_true = pd.Series([10, 20, 30])
    y_pred = np.array([10, 18, 33])

    metrics = evaluate_forecast(y_true, y_pred)

    assert "MAPE" in metrics
    assert "RMSE" in metrics
    assert metrics["MAPE"] >= 0
    assert metrics["RMSE"] >= 0