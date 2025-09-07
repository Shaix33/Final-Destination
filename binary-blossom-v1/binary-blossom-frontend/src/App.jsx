import { useEffect, useState } from "react";

function App() {
  const [weather, setWeather] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/home/") // Make sure Django backend is running
      .then((res) => res.json())
      .then((data) => {
        setWeather(data.weather || null);
        setCrops(data.crops || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const getBackgroundClass = () => {
    if (!weather) return "bg-gray-100";
    const condition = weather.condition?.toLowerCase() || "";

    if (condition.includes("sun")) return "bg-yellow-100";
    if (condition.includes("rain")) return "bg-blue-100";
    if (condition.includes("cloud")) return "bg-gray-300";
    return "bg-gray-100";
  };

  return (
    <div className={`min-h-screen p-6 ${getBackgroundClass()} transition-colors duration-500`}>
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">🌱 Binary Blossom</h1>
        <p className="mb-6 text-gray-700">Smart crop suggestions powered by weather data</p>

        <h2 className="text-2xl font-semibold mb-2">Current Weather</h2>
        {loading ? (
          <p>Loading weather...</p>
        ) : weather ? (
          <div className="mb-6">
            <p><strong>Location:</strong> {weather.location}</p>
            <p><strong>Temperature:</strong> {weather.temperature}°C</p>
            <p><strong>Condition:</strong> {weather.condition}</p>
          </div>
        ) : (
          <p>Unable to load weather.</p>
        )}

        <h2 className="text-2xl font-semibold mb-2">Suggested Crops</h2>
        {loading ? (
          <p>Loading crop suggestions...</p>
        ) : crops.length > 0 ? (
          <ul className="list-disc list-inside">
            {crops.map((crop) => (
              <li key={crop}>{crop}</li>
            ))}
          </ul>
        ) : (
          <p>No crop suggestions available.</p>
        )}
      </div>
    </div>
  );
}

export default App;
