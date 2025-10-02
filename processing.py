import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
import json
import os

CSV_PATH = 'cars_dataset_1000.csv'  # car dataset
df = pd.read_csv(CSV_PATH)

# === INITIAL SNAPSHOT ===
print("\n=== INITIAL HEAD ===")
print(df.head())

print("\n=== INITIAL INFO ===")
print(df.info())

print("\n=== INITIAL MISSING VALUES ===")
print(df.isnull().sum())

# 2) Clean Price column (remove $ if any)
df["Price"] = df["Price"].replace(r"[\$,]", "", regex=True).astype(float)

# 3) Fix categorical issues BEFORE imputation
df["Location"] = df["Location"].replace({"Subrb": "Suburb", "??": pd.NA})

# 4) Impute missing values
df["Odometer_km"] = df["Odometer_km"].fillna(df["Odometer_km"].median())
df["Doors"] = df["Doors"].fillna(df["Doors"].mode()[0])
df["Accidents"] = df["Accidents"].fillna(df["Accidents"].mode()[0])
df["Location"] = df["Location"].fillna(df["Location"].mode()[0])
df["CarModel"] = df["CarModel"].fillna(df["CarModel"].mode()[0])
df["Year"] = df["Year"].fillna(df["Year"].mode()[0])

# 5) Remove duplicates
df = df.drop_duplicates()

# 6) IQR capping
def iqr_fun(series, k=1.5):
    q1, q3 = series.quantile([0.25, 0.75])
    iqr = q3 - q1
    lower = q1 - k * iqr
    upper = q3 + k * iqr
    return lower, upper

low_price, high_price = iqr_fun(df["Price"])
low_odo, high_odo = iqr_fun(df["Odometer_km"])

df["Price"] = df["Price"].clip(lower=low_price, upper=high_price)
df["Odometer_km"] = df["Odometer_km"].clip(lower=low_odo, upper=high_odo)

# 7) One-hot encode categorical variables
df = pd.get_dummies(df, columns=["Location","CarModel"], drop_first=False, dtype="int")

# 8) Feature engineering
CURRENT_YEAR = 2025
df["CarAge"] = CURRENT_YEAR - df["Year"]
df["Doors_per_Accident"] = df["Doors"] / df["Accidents"].replace(0, 1)  # avoid div by zero
df["Odometer_per_Year"] = df["Odometer_km"] / df["CarAge"].replace(0, 1)  # avoid div by zero

# ❌ Removed LogPrice completely

# 9) Feature scaling (X only; keep targets & dummies unscaled)
dont_scale = {"Price"}   # LogPrice waa laga saaray
numeric_cols = df.select_dtypes(include=["int64","float64"]).columns.to_list()
exclude = [c for c in df.columns if c.startswith("Location_") or c.startswith("CarModel_")]
num_features_to_scale = [c for c in numeric_cols if c not in dont_scale and c not in exclude]

scaler = StandardScaler()
df[num_features_to_scale] = scaler.fit_transform(df[num_features_to_scale])

# Save scaler and training feature order
os.makedirs("models", exist_ok=True)
joblib.dump(scaler, "models/car_scaler.pkl")

TRAIN_COLUMNS = df.drop(columns=["Price"]).columns.tolist()
json.dump(TRAIN_COLUMNS, open("models/train_columns.json", "w"))

# === FINAL SNAPSHOT ===
print("\n=== FINAL HEAD ===")
print(df.head())

print("\n=== FINAL INFO ===")
print(df.info())

print("\n=== FINAL MISSING VALUES ===")
print(df.isnull().sum())

# 10) Save clean dataset
OUT_PATH = "clean_cars_dataset_1000.csv"
df.to_csv(OUT_PATH, index=False)
print(f"\n✅ Clean dataset saved to {OUT_PATH}")
