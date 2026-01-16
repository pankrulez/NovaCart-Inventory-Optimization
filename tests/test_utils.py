import pandas as pd
import numpy as np
from src.utils import clip_negative_values, safe_divide


def test_clip_negative_values():
    df = pd.DataFrame({
        "a": [10, -5, 3],
        "b": [-1, 0, 4]
    })

    result = clip_negative_values(df, ["a", "b"])

    assert (result["a"] >= 0).all()
    assert (result["b"] >= 0).all()


def test_safe_divide():
    numerator = np.array([10, 20, 30])
    denominator = np.array([2, 0, 5])

    result = safe_divide(numerator, denominator)

    assert result[0] == 5
    assert result[1] == 0
    assert result[2] == 6