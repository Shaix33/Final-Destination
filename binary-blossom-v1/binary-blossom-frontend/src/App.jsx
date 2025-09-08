import { useState, useEffect } from "react";

function App() {
  const [weather, setWeather] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`/home/?lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              setWeather(data.weather);
              setCrops(data.crops);
              setLoading(false);
            })
            .catch(err => {
              console.error("Error fetching data:", err);
              setLoading(false);
            });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading weather and crop suggestions...</div>;

  return (
    <div>
      <h1>🌱 Binary Blossom</h1>
      <p>Smart crop suggestions powered by weather data</p>
      <h2>Current Weather</h2>
      <p>Location: {weather.location}</p>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Condition: {weather.condition}</p>

      <h2>Suggested Crops</h2>
      <ul>
        {crops.map((crop, idx) => <li key={idx}>{crop}</li>)}
      </ul>
    </div>
  );
}

export default App;
