"use client"

import { useEffect, useRef } from "react"
import Head from "next/head"

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      } catch (err) {
        console.error("Error accessing camera: ", err)
      }
    }

    startCamera()

    const interval = setInterval(() => {
      takePicture()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const takePicture = async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )
        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            // Ensure blob is not null
            const formData = new FormData()
            formData.append("image", blob)
            try {
              const response = await fetch("/api/upload-plant-image", {
                method: "POST",
                body: formData,
              })
              const result = await response.json()
              console.log("Image analysis result:", result)
            } catch (error) {
              console.error("Error sending image:", error)
            }
          }
        }, "image/jpeg")
      }
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Automatic Camera</title>
      </Head>
      <h1>Automatic Camera</h1>
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} width="640" height="480" />
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        canvas {
          margin-top: 20px;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  )
}
