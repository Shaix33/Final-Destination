import { useEffect, useState } from 'react'
import { getHealthCheck } from './services/api'
import WeatherCard from './components/WeatherCard'

export default function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getHealthCheck().then(setData).catch(console.error)
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Binary Blossom Frontend</h1>
      {data ? <WeatherCard {...data} /> : <p>Loading...</p>}
    </div>
  )
}