# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from utils import prepare_features_from_raw  # saxay magaca function-ka

app = Flask(__name__)
CORS(app)

# Load models once at startup
MODELS = {
    "lr": joblib.load("models/lr_model.joblib"),
    "rf": joblib.load("models/rf_model.joblib"),
}


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Car Price Prediction API",
        "endpoints": {
            "POST /predict?model=lr|rf": {
                "expects_json": {
                    "Year": "int",
                    "Odometer_km": "number",
                    "Doors": "int",
                    "Accidents": "int",
                    "Location": "City|Suburb|Rural",
                    "CarModel": "string"
                }
            }
        }
    })


@app.route("/predict", methods=["POST"])
def predict():
    # 1) choose model
    choice = (request.args.get("model") or "").lower()
    if choice not in MODELS:
        return jsonify({"error": "Unknown model. Use model=lr or model=rf"}), 400
    model = MODELS[choice]

    # 2) read payload
    data = request.get_json(silent=True) or {}
    required = ["Year", "Odometer_km", "Doors", "Accidents", "Location", "CarModel"]
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        # preprocess single input
        x_new = prepare_features_from_raw(data)   # saxay magaca function-ka
        pred = float(model.predict(x_new)[0])
    except Exception as e:
        return jsonify({"error": f"Failed to prepare/predict: {e}"}), 500

    return jsonify({
        "model": "linear_regression" if choice == "lr" else "random_forest",
        "input": {
            "Year": int(data["Year"]),
            "Odometer_km": float(data["Odometer_km"]),
            "Doors": int(data["Doors"]),
            "Accidents": int(data["Accidents"]),
            "Location": str(data["Location"]),
            "CarModel": str(data["CarModel"])
        },
        "prediction": round(pred, 2)
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)
