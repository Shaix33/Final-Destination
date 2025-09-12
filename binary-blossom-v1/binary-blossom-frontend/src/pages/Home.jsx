import React, { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example lat/lon — you can make these dynamic later
    fetch("http://127.0.0.1:8000/home/?lat=-28.7&lon=24.7")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading weather data...</p>;
  }

  if (!data) {
    return <p>Failed to load data</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🌱 Binary Blossom</h1>
      <p>Smart crop suggestions powered by weather data</p>

      <h2 className="mt-4 text-lg font-semibold">Current Weather</h2>
      <p>🌡️ {data.weather?.temperature} °C</p>
      <p>💧 {data.weather?.humidity}% humidity</p>
      <p>🌥️ Cloud cover: {data.weather?.cloud_cover}%</p>

      <h2 className="mt-4 text-lg font-semibold">Suggested Crops</h2>
      {data.crops && data.crops.length > 0 ? (
        <ul>
          {data.crops.map((crop, index) => (
            <li key={index}>
              {crop.name} – {crop.reason}
            </li>
          ))}
        </ul>
      ) : (
        <p>No crop suggestions available</p>
      )}
    </div>
  );
}
