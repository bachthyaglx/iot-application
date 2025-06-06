import React, { useState } from 'react'
import SensorChart from '../components/SensorChart'

const sensors = [
  { type: 'temperature', unit: '°C', label: 'Temperature', color: 'red' },
  { type: 'humidity', unit: '%', label: 'Humidity', color: 'blue' },
  { type: 'voltage', unit: 'V', label: 'Voltage', color: 'green' }
]

export default function Dashboard() {
  const [visible, setVisible] = useState(() =>
    Object.fromEntries(sensors.map(({ type }) => [type, true]))
  )

  const toggleChart = (type: string) => {
    setVisible(prev => ({ ...prev, [type]: !prev[type] }))
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Realtime Sensor Dashboard</h2>

      <div style={{ marginBottom: 20 }}>
        {sensors.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => toggleChart(type)}
            style={{
              marginRight: '10px',
              background: visible[type] ? '#4caf50' : '#f44336',
              color: 'white',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {visible[type] ? `Hide ${label}` : `Show ${label}`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {sensors.map(sensor =>
          visible[sensor.type] ? (
            <SensorChart key={sensor.type} {...sensor} />
          ) : null
        )}
      </div>
    </div>
  )
}
