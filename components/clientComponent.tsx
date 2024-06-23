"use client"

import { useEffect } from "react"
import { VoiceProvider } from "@humeai/voice-react"

import AudioVisualizer from "./AudioVisualizer"
import Controls from "./Controls"

export default function ClientComponent({
  accessToken,
  systemPrompt,
}: {
  accessToken: string
  systemPrompt: string
}) {
  return (
    <VoiceProvider
      auth={{ type: "accessToken", value: accessToken }}
      sessionSettings={{
        context: {
          text: systemPrompt,
          type: "editable",
        },
      }}
    >
      <AudioVisualizer />
      {/* <Messages /> */}
      <Controls />
    </VoiceProvider>
  )
}
