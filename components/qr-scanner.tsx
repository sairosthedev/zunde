"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CameraOff, AlertCircle } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
}

export function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startScanning = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsScanning(true)

        // Start scanning for QR codes
        scanForQRCode()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please ensure camera permissions are granted.")
    }
  }

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const scanForQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      setTimeout(scanForQRCode, 100)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Simple QR code detection simulation
      // In a real implementation, you would use a QR code library like jsQR
      // For demo purposes, we'll simulate scanning by checking for manual input

      setTimeout(scanForQRCode, 100)
    } catch (err) {
      console.error("Error scanning QR code:", err)
      setTimeout(scanForQRCode, 100)
    }
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  // Simulate QR code scanning for demo
  const simulateQRScan = () => {
    const mockTicketId = `ZUN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    onScan(mockTicketId)
    stopScanning()
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            {isScanning ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-accent rounded-lg border-dashed animate-pulse">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-accent text-sm font-medium bg-background/80 px-2 py-1 rounded">
                        Position QR code here
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Camera not active</p>
                <p className="text-sm text-muted-foreground">Click "Start Scanner" to begin scanning QR codes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {!isScanning ? (
          <Button onClick={startScanning} className="flex-1">
            <Camera className="w-4 h-4 mr-2" />
            Start Scanner
          </Button>
        ) : (
          <>
            <Button onClick={stopScanning} variant="outline" className="flex-1 bg-transparent">
              <CameraOff className="w-4 h-4 mr-2" />
              Stop Scanner
            </Button>
            <Button onClick={simulateQRScan} variant="secondary" className="flex-1">
              Simulate Scan (Demo)
            </Button>
          </>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Point your camera at a participant's QR code ticket</p>
        <p>The system will automatically detect and process the code</p>
      </div>
    </div>
  )
}
