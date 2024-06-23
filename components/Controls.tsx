"use client"

import { useState } from "react"
import { useVoice } from "@humeai/voice-react"
import { Mic, Pause, Play } from "lucide-react"

import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"

export default function Controls() {
  const { toast } = useToast()
  const { connect, disconnect } = useVoice()
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    connect()
      .then(() => {
        setIsConnected(true)
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to start the chat session. Please try again.",
        })
      })
  }

  if (isConnected) {
    return (
      <div className="flex w-full items-center justify-center">
        <Button
          onClick={() => {
            disconnect()
            setIsConnected(false)
          }}
        >
          <Mic className="size-4" />
          <Pause className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Button onClick={handleConnect}>
        <Mic className="size-4" />
        <Play className="size-4" />
      </Button>
    </div>
  )
}
