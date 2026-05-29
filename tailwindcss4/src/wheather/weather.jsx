import React, { useState, useEffect } from "react";
import DarkModeToggle from "../darck_brightMode/Darck-Bright";

function Weather() {
  const [city, setCity] = useState("Addis Ababa");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapUrl, setMapUrl] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }
    if (!API_KEY) {
      setError(
        "Weather API Key is missing. Please set VITE_WEATHER_API_KEY in your .env file."
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();
      setWeatherData(data);

      // Generate Google Maps URL when weather data is received
      if (GOOGLE_MAPS_API_KEY) {
        const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${data.coord.lat},${data.coord.lon}&zoom=11`;
        setMapUrl(mapUrl);
      }
    } catch (err) {
      console.error("Failed to fetch weather:", err);
      setError(`Failed to fetch weather: ${err.message}`);
      setWeatherData(null);
      setMapUrl("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []); // Removed city from dependencies to prevent auto-fetch on typing

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <>
      <div className="weather-container p-8 max-w-4xl mx-auto bg-slate-800 rounded-xl text-white">
        <div className="flex justify-between ">
          <h1 className="text-3xl font-bold mb-6 text-center">Weather App</h1>{" "}
          <DarkModeToggle className="justify-between align-top ml-5" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            required
            className="flex-grow px-4 py-2 rounded bg-sky-200 hover:bg-lime-200 focus:bg-lime-200 text-black focus:outline-none"
            aria-label="City Name"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Get Weather
          </button>
        </form>
        {loading && (
          <div className="text-center py-8">
            <p className="text-xl">Loading weather data...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}
        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="weather-card bg-slate-700 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <div className="flex items-center mb-4">
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                  className="w-20 h-20"
                />
                <p className="text-4xl font-bold ml-4">
                  {Math.round(weatherData.main.temp)}°C
                </p>
              </div>
              <p className="text-xl capitalize mb-4">
                {weatherData.weather[0].description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-600 p-3 rounded">
                  <p className="font-medium">Feels like</p>
                  <p>{Math.round(weatherData.main.feels_like)}°C</p>
                </div>
                <div className="bg-slate-600 p-3 rounded">
                  <p className="font-medium">Humidity</p>
                  <p>{weatherData.main.humidity}%</p>
                </div>
                <div className="bg-slate-600 p-3 rounded">
                  <p className="font-medium">Wind Speed</p>
                  <p>{weatherData.wind.speed} m/s</p>
                </div>
                <div className="bg-slate-600 p-3 rounded">
                  <p className="font-medium">Pressure</p>
                  <p>{weatherData.main.pressure} hPa</p>
                </div>
              </div>
            </div>

            {/* Google Maps Integration */}
            <div className="map-container bg-slate-700 rounded-lg shadow-lg overflow-hidden">
              {GOOGLE_MAPS_API_KEY && mapUrl ? (
                <iframe
                  title={`${city} location`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ minHeight: "400px" }}
                  src={mapUrl}
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-lg mb-2">
                    Google Maps API key not configured
                  </p>
                  <p className="text-sm text-slate-300">
                    To enable maps, add VITE_GOOGLE_MAPS_API_KEY to your .env
                    file
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div>
        <footer className="bg-emerald-950 flex max-w-4xl mx-auto rounded-b-md align-center  mt-3 p-3 text-amber-200 hover:bg-lime-950 min-h-16">
          <p>developed by Mekuannent Biyazn</p>
        </footer>
      </div>
    </>
  );
}

export default Weather;
