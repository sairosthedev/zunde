"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRScanner } from "@/components/qr-scanner"
import { CheckInHistory } from "@/components/checkin-history"
import type { Event } from "@/lib/types"
import { Scan, UserCheck, UserX, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function CheckInScanner() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [busNumber, setBusNumber] = useState("")
  const [staffMember, setStaffMember] = useState("")
  const [location, setLocation] = useState("")
  const [ticketId, setTicketId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    participant?: any
  } | null>(null)
  const [scanMode, setScanMode] = useState<"checkin" | "checkout">("checkin")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()
      if (data.success) {
        setEvents(
          data.events.filter((event: Event) => event.status === "registration-open" || event.status === "upcoming"),
        )
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    }
  }

  const handleCheckIn = async (scannedTicketId?: string) => {
    const ticketToProcess = scannedTicketId || ticketId

    if (!ticketToProcess || !busNumber || !staffMember || !location) {
      setResult({
        success: false,
        message: "Please fill in all required fields",
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: ticketToProcess,
          busNumber,
          staffMember,
          location,
          action: scanMode,
        }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setTicketId("")
        // Clear the result after 3 seconds
        setTimeout(() => setResult(null), 3000)
      }
    } catch (error) {
      console.error("Check-in error:", error)
      setResult({
        success: false,
        message: "Check-in failed. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleQRScan = (scannedData: string) => {
    setTicketId(scannedData)
    handleCheckIn(scannedData)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Event Check-in Scanner</h1>
        <p className="text-muted-foreground">Scan QR codes or manually enter ticket IDs for participant check-in</p>
      </div>

      <Tabs defaultValue="scanner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="history">Check-in History</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          {/* Setup Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Scanner Setup
              </CardTitle>
              <CardDescription>Configure check-in details before scanning tickets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event">Event</Label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event._id} value={event._id!}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="busNumber">Bus Number</Label>
                  <Input
                    id="busNumber"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="e.g., Bus 1, Bus A"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="staffMember">Staff Member</Label>
                  <Input
                    id="staffMember"
                    value={staffMember}
                    onChange={(e) => setStaffMember(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Church Main, Assembly Hall"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Check-in Mode</Label>
                <div className="flex gap-2">
                  <Button
                    variant={scanMode === "checkin" ? "default" : "outline"}
                    onClick={() => setScanMode("checkin")}
                    className="flex-1"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Check In
                  </Button>
                  <Button
                    variant={scanMode === "checkout" ? "default" : "outline"}
                    onClick={() => setScanMode("checkout")}
                    className="flex-1"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Check Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scanner Interface */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* QR Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="w-5 h-5" />
                  QR Code Scanner
                </CardTitle>
                <CardDescription>Point camera at participant's QR code</CardDescription>
              </CardHeader>
              <CardContent>
                <QRScanner onScan={handleQRScan} />
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>Enter ticket ID manually if QR code is not readable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketId">Ticket ID</Label>
                  <Input
                    id="ticketId"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                    placeholder="ZUN-XXXXXXX-XXXXXX"
                    className="font-mono"
                  />
                </div>

                <Button
                  onClick={() => handleCheckIn()}
                  className="w-full"
                  disabled={loading || !ticketId || !busNumber || !staffMember || !location}
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {scanMode === "checkin" ? (
                        <UserCheck className="w-4 h-4 mr-2" />
                      ) : (
                        <UserX className="w-4 h-4 mr-2" />
                      )}
                      {scanMode === "checkin" ? "Check In" : "Check Out"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Result Display */}
          {result && (
            <Alert
              className={
                result.success
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-red-500 bg-red-50 dark:bg-red-950"
              }
            >
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <div
                    className={result.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}
                  >
                    {result.message}
                  </div>
                  {result.participant && (
                    <div className="mt-2 text-sm">
                      <strong>{result.participant.name}</strong>
                      {result.participant.busNumber && (
                        <Badge variant="outline" className="ml-2">
                          {result.participant.busNumber}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="history">
          <CheckInHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
