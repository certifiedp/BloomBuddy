"use client"

import { useEffect, useState } from "react"
import { fetchAccessToken } from "@humeai/voice"
import { createClient } from "@supabase/supabase-js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import ClientComponent from "@/components/clientComponent"

function getPlantEmoji(sensorData: {
  light: number
  soilPH: number
  soilMoisture: number
}): string {
  if (sensorData.soilMoisture < 50) {
    return "🥵"
  } else if (sensorData.light < 40) {
    return "😴"
  } else if (sensorData.soilPH < 5.5 || sensorData.soilPH > 7.5) {
    return "😖"
  } else if (sensorData.soilMoisture > 75 && sensorData.light > 70) {
    return "😎"
  } else {
    return "🌱"
  }
}

export default function PlantDashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [sensorData, setSensorData] = useState({
    light: 0,
    soilPH: 0,
    soilMoisture: 0,
  })
  const [systemPrompt, setSystemPrompt] = useState<string>("")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchSensorData = async () => {
      const { data, error } = await supabase
        .from("plant")
        .select("*")
        .eq("id", "48890957-933e-45cf-888f-74096f277ebd")
        .single()

      if (error) {
        console.error("Error fetching sensor data:", error)
        return
      }

      if (data) {
        setSensorData({
          light: data.light * 10,
          soilPH: data.ph,
          soilMoisture: data.moisture * 25,
        })

        const newSystemPrompt = `You are a plant personified.
          Take on a persona of with the following characteristics: ${JSON.stringify(
            data
          )}
          Your main goal is to have a conversation with your owner.
          If, based on your current status, you need some kind of care like watering,
          you should insert that naturally into the conversation.
          If you characteristic value are all 0, you should ignore them as your sensors
          are probably broken. Your mood is determined by your overall health based on your
          characteristic values. You should communicate based on your mood, for example, if
          you need water, you should sound grumpy and raspy. For interpreting sensor values,
          you shouldn't use the values directly, but rather describe them in a way that
          makes it easy for the user to understand. Additionally, for water, 50% or above is
          generally considered enough, but you may want to inform the user that you will need
          watering in the near future.`

        setSystemPrompt(newSystemPrompt)
      }
    }

    fetchSensorData()
    const interval = setInterval(fetchSensorData, 100)

    return () => clearInterval(interval)
  }, [accessToken])

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await fetchAccessToken({
          apiKey: String(process.env.NEXT_PUBLIC_HUME_API_KEY),
          secretKey: String(process.env.NEXT_PUBLIC_HUME_SECRET_KEY),
        })
        setAccessToken(token)
      } catch (error) {
        console.error("Failed to fetch access token:", error)
      }
    }

    getAccessToken()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Bloom Buddy</h1>
      <br />
      <br />

      <Card className="relative mx-auto mb-8 size-64 p-0">
        <CardContent className="h-full p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/spinningplant.gif"
            alt="Spinning Plant"
            className="size-full rounded object-cover"
          />
          <div className="absolute left-2 top-2 text-4xl">
            {getPlantEmoji(sensorData)}
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        {accessToken && (
          <ClientComponent
            accessToken={accessToken}
            systemPrompt={systemPrompt}
          />
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Light</CardTitle>
          </CardHeader>
          <CardContent>
            {sensorData.light !== null ? (
              <>
                <Progress value={sensorData.light} className="w-full" />
                <p className="mt-2 text-center">{sensorData.light}%</p>
              </>
            ) : (
              <p className="text-center">Loading...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Soil pH</CardTitle>
          </CardHeader>
          <CardContent>
            {sensorData.soilPH !== null ? (
              <>
                <Progress value={sensorData.soilPH * 10} className="w-full" />
                <p className="mt-2 text-center">{sensorData.soilPH} pH</p>
              </>
            ) : (
              <p className="text-center">Loading...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Soil Moisture</CardTitle>
          </CardHeader>
          <CardContent>
            {sensorData.soilMoisture !== null ? (
              <>
                <Progress value={sensorData.soilMoisture} className="w-full" />
                <p className="mt-2 text-center">{sensorData.soilMoisture}%</p>
              </>
            ) : (
              <p className="text-center">Loading...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
