"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Home, Star } from "lucide-react";

interface PredictionResult {
  input: {
    Year: number;
    Odometer_km: number;
    Doors: number;
    Accidents: number;
    Location: string;
    CarModel: string;
  };
  model: string;
  prediction: number;
}

export default function HomePage() {
  const [formData, setFormData] = useState({
    Year: "",
    Odometer_km: "",
    Doors: "4",
    Accidents: "0",
    Location: "City",
    CarModel: "Unknown",
    selectedPredictor: "rf", // default model key
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    if (!formData.Year || !formData.Odometer_km) {
      setError("Please fill Year and Odometer_km");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl = "http://127.0.0.1:8000"; // Flask server
      const modelParam = formData.selectedPredictor; // "lr" or "rf"

      const payload = {
        Year: parseInt(formData.Year),
        Odometer_km: parseFloat(formData.Odometer_km),
        Doors: parseInt(formData.Doors),
        Accidents: parseInt(formData.Accidents),
        Location: formData.Location,
        CarModel: formData.CarModel,
      };

      const response = await fetch(`${apiUrl}/predict?model=${modelParam}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      console.error(err);
      setError(
        "Error calculating prediction. Check your inputs & backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Car Price Prediction</h1>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label>Year</Label>
            <Input
              type="number"
              value={formData.Year}
              onChange={(e) => handleInputChange("Year", e.target.value)}
            />
          </div>
          <div>
            <Label>Odometer_km</Label>
            <Input
              type="number"
              value={formData.Odometer_km}
              onChange={(e) =>
                handleInputChange("Odometer_km", e.target.value)
              }
            />
          </div>
          <div>
            <Label>Doors</Label>
            <Input
              type="number"
              value={formData.Doors}
              onChange={(e) => handleInputChange("Doors", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label>Accidents</Label>
            <Input
              type="number"
              value={formData.Accidents}
              onChange={(e) =>
                handleInputChange("Accidents", e.target.value)
              }
            />
          </div>
          <div>
            <Label>Location</Label>
            <Select
              value={formData.Location}
              onValueChange={(value) => handleInputChange("Location", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="City">City</SelectItem>
                <SelectItem value="Suburb">Suburb</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Car Model</Label>
            <Input
              value={formData.CarModel}
              onChange={(e) => handleInputChange("CarModel", e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <Label>Predictor</Label>
          <Select
            value={formData.selectedPredictor}
            onValueChange={(value) =>
              handleInputChange("selectedPredictor", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lr">Linear Regression</SelectItem>
              <SelectItem value="rf">Random Forest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md mb-6"
        >
          {loading ? "Predicting..." : "Predict Price"}
        </button>

        {prediction && (
          <Card className="p-4 bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle>Predicted Price</CardTitle>
              <CardDescription>
                Model used: {prediction.model}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                ${prediction.prediction.toLocaleString()}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>Year: {prediction.input.Year}</div>
                <div>Odometer_km: {prediction.input.Odometer_km}</div>
                <div>Doors: {prediction.input.Doors}</div>
                <div>Accidents: {prediction.input.Accidents}</div>
                <div>Location: {prediction.input.Location}</div>
                <div>CarModel: {prediction.input.CarModel}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
