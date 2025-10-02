# utils.py
import json
import joblib
import pandas as pd

CURRENT_YEAR = 2025

# Load once at import
TRAIN_COLUMNS = json.load(open("models/train_columns.json"))
SCALER = joblib.load("models/car_scaler.pkl")  # saved during car preprocessing

def prepare_features_from_raw(record: dict) -> pd.DataFrame:
    """
    Convert raw input (Year, Odometer_km, Doors, Accidents, Location, CarModel)
    into the engineered, one-hot, scaled feature row that matches training.
    Returns a 1-row DataFrame with columns == TRAIN_COLUMNS.
    """
    # --- safe type casting ---
    try:
        year = int(record.get("Year", CURRENT_YEAR))
        odo = float(record.get("Odometer_km", 0.0))
        doors = int(record.get("Doors", 4))
        acc = int(record.get("Accidents", 0))
    except ValueError:
        raise ValueError("Invalid input types: Year, Odometer_km, Doors, Accidents must be numbers")
    
    loc = str(record.get("Location", "City"))
    model = str(record.get("CarModel", "Unknown"))

    # === engineered features (same as training pipeline) ===
    car_age = CURRENT_YEAR - year
    doors_per_acc = doors / (acc if acc > 0 else 1)
    odo_per_year = odo / (car_age if car_age > 0 else 1)

    # --- build base row with zeros ---
    row = {col: 0.0 for col in TRAIN_COLUMNS}

    # --- assign numeric/engineered features ---
    for name, val in [
        ("Year", year),
        ("Odometer_km", odo),
        ("Doors", doors),
        ("Accidents", acc),
        ("CarAge", car_age),
        ("Doors_per_Accident", doors_per_acc),
        ("Odometer_per_Year", odo_per_year),
    ]:
        if name in row:
            row[name] = float(val)

    # --- One-hot encoding for Location ---
    loc_col = f"Location_{loc}"
    if loc_col in row:
        row[loc_col] = 1.0
    else:
        common_loc = [c for c in TRAIN_COLUMNS if c.startswith("Location_")][0]
        row[common_loc] = 1.0

    # --- One-hot encoding for CarModel ---
    model_col = f"CarModel_{model}"
    if model_col in row:
        row[model_col] = 1.0
    else:
        common_model = [c for c in TRAIN_COLUMNS if c.startswith("CarModel_")][0]
        row[common_model] = 1.0

    # --- create DataFrame with proper column order ---
    df_one = pd.DataFrame([row], columns=TRAIN_COLUMNS)

    # --- scale numeric columns ---
    if hasattr(SCALER, "feature_names_in_"):
        cols_to_scale = [c for c in SCALER.feature_names_in_ if c in df_one.columns]
        df_one[cols_to_scale] = SCALER.transform(df_one[cols_to_scale])

    return df_one
