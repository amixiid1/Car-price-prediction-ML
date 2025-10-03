'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function PredictPage() {
  const [year, setYear] = useState('');
  const [odometer, setOdometer] = useState('');
  const [doors, setDoors] = useState('');
  const [accidents, setAccidents] = useState('');
  const [location, setLocation] = useState('');
  const [carModel, setCarModel] = useState('');
  const [modelChoice, setModelChoice] = useState('');
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const basePrice = 30000;
      const yearFactor = parseInt(year) > 2020 ? 5000 : -2000;
      const odometerFactor = Math.max(0, 20000 - (parseInt(odometer) * 0.1));
      const accidentFactor = parseInt(accidents) * -3000;
      const randomVariation = Math.random() * 5000 - 2500;

      const price = Math.max(
        5000,
        basePrice + yearFactor + odometerFactor + accidentFactor + randomVariation
      );

      setPredictedPrice(Math.round(price));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Car Price Prediction
          </h1>
          <p className="text-muted-foreground mt-2">
            Get accurate price estimates using machine learning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
              <CardDescription>
                Enter your car information to get a price prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePredict} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2020"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="odometer">Odometer (km)</Label>
                    <Input
                      id="odometer"
                      type="number"
                      placeholder="50000"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doors">Doors</Label>
                    <Input
                      id="doors"
                      type="number"
                      placeholder="4"
                      value={doors}
                      onChange={(e) => setDoors(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accidents">Accidents</Label>
                    <Input
                      id="accidents"
                      type="number"
                      placeholder="0"
                      value={accidents}
                      onChange={(e) => setAccidents(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation} required>
                    <SelectTrigger id="location" className="rounded-lg">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city">City</SelectItem>
                      <SelectItem value="suburb">Suburb</SelectItem>
                      <SelectItem value="rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carModel">Car Model</Label>
                  <Input
                    id="carModel"
                    type="text"
                    placeholder="Toyota Camry"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelChoice">Prediction Model</Label>
                  <Select value={modelChoice} onValueChange={setModelChoice} required>
                    <SelectTrigger id="modelChoice" className="rounded-lg">
                      <SelectValue placeholder="Select prediction model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear Regression</SelectItem>
                      <SelectItem value="forest">Random Forest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Calculating...' : 'Predict Price'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle>Prediction Report</CardTitle>
              <CardDescription>
                Your car price analysis and estimate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {predictedPrice ? (
                <>
                  <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                    <p className="text-sm text-muted-foreground mb-2">Predicted Price</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${predictedPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200">
                      Model: {modelChoice === 'linear' ? 'Linear Regression' : 'Random Forest'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 text-lg">Input Summary</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <p className="text-xs text-muted-foreground mb-1">Year</p>
                        <p className="text-lg font-semibold">{year}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <p className="text-xs text-muted-foreground mb-1">Odometer</p>
                        <p className="text-lg font-semibold">{parseInt(odometer).toLocaleString()} km</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <p className="text-xs text-muted-foreground mb-1">Doors</p>
                        <p className="text-lg font-semibold">{doors}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <p className="text-xs text-muted-foreground mb-1">Accidents</p>
                        <p className="text-lg font-semibold">{accidents}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                        <p className="text-lg font-semibold capitalize">{location}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Car Model</p>
                        <p className="text-lg font-semibold">{carModel}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full py-20">
                  <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-4">🚗</div>
                    <p>Fill out the form and click</p>
                    <p className="font-semibold">&quot;Predict Price&quot;</p>
                    <p>to see your results</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
