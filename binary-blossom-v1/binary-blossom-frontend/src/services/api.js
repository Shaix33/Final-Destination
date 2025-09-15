export async function getWeatherAndCrops(lat, lon) {
  const url = `http://127.0.0.1:8000/home_data/?lat=${lat}&lon=${lon}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}
