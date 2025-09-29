"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CameraOff, AlertCircle, CheckCircle } from "lucide-react"
import jsQR from "jsqr"

interface QRScannerProps {
  onScan: (data: string) => void
}

export function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")

  // Load available cameras (after user grants permission)
  useEffect(() => {
    async function loadDevices() {
      try {
        if (!navigator.mediaDevices?.enumerateDevices) return
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoInputs = devices.filter((d) => d.kind === "videoinput")
        setCameras(videoInputs)
        // Prefer the last camera (often the back camera on phones)
        if (videoInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoInputs[videoInputs.length - 1].deviceId)
        }
      } catch (e) {
        console.warn("Unable to enumerate devices", e)
      }
    }
    loadDevices()
  }, [selectedDeviceId])

  const startScanning = async () => {
    try {
      setError(null)

      // Primary constraints (prefer back camera on mobile)
      const videoConstraint: MediaTrackConstraints = selectedDeviceId
        ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 640 }, height: { ideal: 480 } }
        : { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } }

      const constraintsPrimary: MediaStreamConstraints = { video: videoConstraint, audio: false }

      // Fallback constraints (any available camera)
      const constraintsFallback: MediaStreamConstraints = { video: true, audio: false }

      let mediaStream: MediaStream
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraintsPrimary)
      } catch (primaryError) {
        console.warn("Primary camera constraints failed, trying fallback...", primaryError)
        mediaStream = await navigator.mediaDevices.getUserMedia(constraintsFallback)
      }

      if (videoRef.current) {
        const video = videoRef.current
        // iOS/Safari compatibility
        video.setAttribute("playsinline", "true")
        video.setAttribute("muted", "true")
        video.muted = true
        video.autoplay = true
        video.srcObject = mediaStream
        setStream(mediaStream)
        setIsScanning(true)

        // Ensure video starts
        const playPromise = video.play?.()
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.catch((e: unknown) => {
            console.warn("Video play() was interrupted:", e)
          })
        }

        // Also start after metadata if needed
        video.onloadedmetadata = () => {
          video.play?.()
        }

        // Start scanning for QR codes
        scanForQRCode()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      const message =
        (err as any)?.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access in your browser settings and reload."
          : (err as any)?.name === "NotFoundError"
          ? "No camera device found. Please connect a camera and try again."
          : "Unable to access camera. Please ensure camera permissions are granted."
      setError(message)
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
      
      // Use jsQR to detect QR codes
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      if (code) {
        // Prevent scanning the same code multiple times
        if (code.data !== lastScannedCode) {
          setLastScannedCode(code.data)
          setScanSuccess(true)
          
          // Show success for 2 seconds, then call onScan
          setTimeout(() => {
            onScan(code.data)
            setScanSuccess(false)
            setLastScannedCode(null)
          }, 2000)
          
          return
        }
      }

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

  // Reset scan state when stopping
  const handleStopScanning = () => {
    stopScanning()
    setScanSuccess(false)
    setLastScannedCode(null)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      {/* Camera selector (if multiple cameras available) */}
      {cameras.length > 1 && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Camera:</label>
          <select
            className="flex-1 bg-background border rounded px-2 py-1 text-sm"
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            {cameras.map((cam, idx) => (
              <option value={cam.deviceId} key={cam.deviceId}>
                {cam.label || `Camera ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-muted flex items-center justify-center h-[60vh] rounded-md overflow-hidden">
            {isScanning ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {scanSuccess ? (
                    <div className="w-48 h-48 border-2 border-green-500 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <span className="text-green-500 text-sm font-medium bg-background/80 px-2 py-1 rounded">
                          QR Code Detected!
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 border-2 border-accent rounded-lg border-dashed animate-pulse">
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-accent text-sm font-medium bg-background/80 px-2 py-1 rounded">
                          Position QR code here
                        </span>
                      </div>
                    </div>
                  )}
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
          <Button onClick={handleStopScanning} variant="outline" className="flex-1 bg-transparent">
            <CameraOff className="w-4 h-4 mr-2" />
            Stop Scanner
          </Button>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Point your camera at a participant's QR code ticket</p>
        <p>The system will automatically detect and process the code</p>
      </div>
    </div>
  )
}
