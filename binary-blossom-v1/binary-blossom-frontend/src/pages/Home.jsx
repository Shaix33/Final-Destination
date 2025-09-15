import React, { useState, useEffect } from "react";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [crops, setCrops] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Your Location");

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        fetch(`http://127.0.0.1:8000/home_data/?lat=${latitude}&lon=${longitude}`)
          .then((res) => res.json())
          .then((data) => {
            setWeather(data.weather);
            setCrops(data.crops || []);
            setForecast(data.daily || []);
            setLocation(data.location || "Your Location");
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching data:", err);
            setLoading(false);
          });
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <div>Loading weather and crop suggestions...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">🌱 Binary Blossom</h1>
      <p>Smart crop suggestions powered by weather data</p>

      {/* Current Weather */}
      <h2 className="mt-4 text-lg font-semibold">🌤️ Current Weather</h2>
      {weather ? (
        <div>
          <p>📍 Location: {location}</p>
          <p>🌡️ Temperature: {weather.temperature}°C</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌥️ Condition: {weather.summary || "N/A"}</p>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}

      {/* Crop Suggestions */}
      <h2 className="mt-4 text-lg font-semibold">🌾 Suggested Crops</h2>
      {crops.length ? (
        <ul>
          {crops.map((crop, idx) => (
            <li key={idx}>
              <strong>{crop.name}</strong> – {crop.reason}
            </li>
          ))}
        </ul>
      ) : (
        <p>No crop suggestions available.</p>
      )}

      {/* 7-Day Forecast */}
      <h2 className="mt-4 text-lg font-semibold">📅 7-Day Forecast</h2>
      {forecast.length ? (
        <table className="table-auto border border-collapse border-gray-300">
          <thead>
            <tr>
              <th>Date</th>
              <th>Max Temp</th>
              <th>Min Temp</th>
              <th>Rain (mm)</th>
              <th>Clouds (%)</th>
              <th>Wind (km/h)</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((day, idx) => (
              <tr key={idx}>
                <td>{day.date}</td>
                <td>{day.temperature_max}°C</td>
                <td>{day.temperature_min}°C</td>
                <td>{day.precipitation_sum} mm</td>
                <td>{day.cloud_cover_mean}%</td>
                <td>{day.wind_speed_max} km/h</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No forecast data available.</p>
      )}
    </div>
  );
}
