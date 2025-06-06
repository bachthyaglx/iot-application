import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import { socket } from '../utils/socket'

type SensorChartProps = {
  type: string
  unit: string
  label: string
  color: string
}

export default function SensorChart({ type, unit, label, color }: SensorChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart<'line', number[], string> | null>(null)
  const [value, setValue] = useState('--')
  const [time, setTime] = useState('--')

  useEffect(() => {
    if (!chartRef.current) return
    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [] as string[],
        datasets: [{
          label,
          data: [] as number[],
          borderColor: color,
          backgroundColor: 'transparent'
        }]
      },
      options: {
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { display: false } },
          y: { beginAtZero: false }
        }
      }
    })

    chartInstance.current = chart

    socket.emit('subscribe', { type })
    socket.emit('get-latest', { type })

    const handleUpdate = (data: { timestamp: string; value: number }) => {
      const ts = new Date(data.timestamp).toLocaleTimeString()
      chart.data.labels?.push(ts)
      chart.data.datasets[0].data.push(data.value)

      if ((chart.data.labels ?? []).length > 20) {
        chart.data.labels?.shift()
        chart.data.datasets[0].data.shift()
      }

      chart.update()
      setValue(String(data.value))
      setTime(ts)
    }

    socket.on(`${type}:update`, handleUpdate)
    socket.on(`latest-${type}`, handleUpdate)

    return () => {
      socket.emit('unsubscribe', { type })
      socket.off(`${type}:update`, handleUpdate)
      socket.off(`latest-${type}`, handleUpdate)
      chart.destroy()
    }
  }, [type, label, color])

  return (
    <div className="chart-box" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
      <div><strong>{label}</strong>: <span>{value}</span> {unit}</div>
      <div>🕒 {time}</div>
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
