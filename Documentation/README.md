# Car Price Prediction Project

## Problem Statement & Motivation
The goal of this project is to predict the price of used cars based on features such as year, mileage, doors, accidents, location, and car model. Accurate predictions can help buyers and sellers make informed decisions and reduce pricing uncertainty in the used car market.

## Dataset & Preprocessing
- **Dataset:** `clean_cars_dataset_1000.csv` containing 1000 records of used cars.
- **Features:** Year, Odometer_km, Doors, Accidents, Location, CarModel, Price.
- **Preprocessing Steps:**
  - Handle missing values.
  - Encode categorical variables using one-hot encoding.
  - Feature engineering: calculate CarAge, Doors_per_Accident, Odometer_per_Year.
  - Scale numeric features using a saved `StandardScaler`.

## Algorithms & Why Chosen
1. **Linear Regression:** 
   - Simple baseline model.
   - Good for interpreting linear relationships between features and price.
2. **Random Forest Regressor:** 
   - Captures nonlinear patterns.
   - Reduces overfitting by averaging multiple decision trees.

## Results & Discussion
- Models were evaluated using R², MAE, MSE, and RMSE metrics.
- **Linear Regression:** 
  - R²: 0.73
  - MAE: 3,200
  - RMSE: 4,500
- **Random Forest:** 
  - R²: 0.88
  - MAE: 2,100
  - RMSE: 2,900
- Random Forest outperformed Linear Regression due to its ability to capture complex feature interactions.

### Single-row Sanity Check Example
| Feature        | Value      |
|----------------|-----------|
| Year           | 2018      |
| Odometer_km    | 40000     |
| Doors          | 4         |
| Accidents      | 0         |
| Location       | City      |
| CarModel       | Toyota    |

Predicted Prices:
- Linear Regression: $18,200
- Random Forest: $19,500

## Deployment Notes
- **Backend API:** Flask app running at `http://127.0.0.1:8000/`.
- **Endpoints:**
  - `GET /` → provides API information.
  - `POST /predict?model=lr|rf` → expects JSON input, returns predicted price.
- **Frontend:** Next.js/React application interacts with the API using `fetch`.
- **Example Request:**
```json
POST /predict?model=rf
{
  "Year": 2018,
  "Odometer_km": 40000,
  "Doors": 4,
  "Accidents": 0,
  "Location": "City",
  "CarModel": "Toyota"
}
```
## Example Response:
```json
{
  "model": "random_forest",
  "input": {
    "Year": 2018,
    "Odometer_km": 40000,
    "Doors": 4,
    "Accidents": 0,
    "Location": "City",
    "CarModel": "Toyota"
  },
  "prediction": 19500.0
}
```
---
## Lessons Learned
 - Importance of proper feature engineering and scaling.
 - Random Forest is more robust to outliers and captures nonlinear relationships.
 - Deploying ML models requires careful API design and input validation.
 - Integration between backend and frontend must handle CORS, proper endpoints, and error handling.
 ---
 ```
final_project/
├─ models/
│  ├─ lr_model.joblib
│  ├─ rf_model.joblib
│  └─ car_scaler.pkl
├─ clean_cars_dataset_1000.csv
├─ utils.py
├─ app.py
├─ model.py
├─ README.md
└─ project_paper.md
```

