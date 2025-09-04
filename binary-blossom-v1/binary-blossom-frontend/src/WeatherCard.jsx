export default function WeatherCard({ status, time }) {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Backend Status: {status}</h2>
      <p>Time: {time}</p>
    </div>
  )
}