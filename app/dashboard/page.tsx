"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const AudioVisualizer = () => {
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0))

  useEffect(() => {
    const interval = setInterval(() => {
      setAudioLevels(audioLevels.map(() => Math.random() * 100))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-20 items-center justify-center space-x-px">
      {audioLevels.map((level, index) => (
        <div
          key={index}
          className="w-2 rounded-full bg-pink-400"
          style={{
            height: `${level}%`,
            maxHeight: "80%",
            transform: `scaleY(${index < 5 || index > 14 ? 0.5 : 1})`,
          }}
        />
      ))}
    </div>
  )
}

const SensorReading = ({
  label,
  value,
  unit,
}: {
  label: string
  value: number | null
  unit: string
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{label}</CardTitle>
    </CardHeader>
    <CardContent>
      {value !== null ? (
        <>
          <Progress value={value} className="w-full" />
          <p className="mt-2 text-center">
            {value}
            {unit}
          </p>
        </>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </CardContent>
  </Card>
)

export default function PlantDashboard() {
  const [isTalking, setIsTalking] = useState(false)
  const [sensorData, setSensorData] = useState({
    light: 75,
    soilPH: 6.5,
    soilMoisture: 60,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData({
        light: Math.floor(Math.random() * 100),
        soilPH: Math.round((Math.random() * 3 + 5) * 10) / 10,
        soilMoisture: Math.floor(Math.random() * 100),
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Plant Dashboard</h1>

      <Card className="mx-auto mb-8 size-64 p-0">
        <CardContent className="h-full p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/spinningplant.gif"
            alt="Spinning Plant"
            className="size-full object-cover"
          />
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Audio Visualizer</h2>
        <AudioVisualizer />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <SensorReading label="Light" value={sensorData.light} unit="%" />
        <SensorReading label="Soil pH" value={sensorData.soilPH} unit="pH" />
        <SensorReading
          label="Soil Moisture"
          value={sensorData.soilMoisture}
          unit="%"
        />
      </div>

      <Button onClick={() => setIsTalking(!isTalking)} className="w-full">
        {isTalking ? "Stop Talking" : "Talk to Plant"}
      </Button>
    </div>
  )
}
