"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Event } from "@/lib/types"
import { Send, Mail, MessageSquare, Smartphone, CheckCircle, AlertCircle } from "lucide-react"

interface NotificationCenterProps {
  events: Event[]
}

export function NotificationCenter({ events }: NotificationCenterProps) {
  const [selectedEvent, setSelectedEvent] = useState("")
  const [notificationType, setNotificationType] = useState("reminder")
  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    whatsapp: false,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    sent?: number
    total?: number
  } | null>(null)

  const handleSendNotifications = async () => {
    if (!selectedEvent) {
      setResult({
        success: false,
        message: "Please select an event",
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEvent,
          type: notificationType,
          preferences,
        }),
      })

      const data = await response.json()
      setResult(data)

      // Clear result after 5 seconds
      setTimeout(() => setResult(null), 5000)
    } catch (error) {
      console.error("Notification sending error:", error)
      setResult({
        success: false,
        message: "Failed to send notifications. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedEventData = events.find((e) => e._id === selectedEvent)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Notification Center</h2>
        <p className="text-muted-foreground">Send bulk notifications to event participants</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Notifications
          </CardTitle>
          <CardDescription>Send reminders, updates, or announcements to registered participants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Event</label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id!}>
                    {event.name} - {new Date(event.date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEventData && (
              <p className="text-sm text-muted-foreground">
                Event Date:{" "}
                {new Date(selectedEventData.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {/* Notification Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notification Type</label>
            <Select value={notificationType} onValueChange={setNotificationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reminder">Event Reminder</SelectItem>
                <SelectItem value="update">Event Update</SelectItem>
                <SelectItem value="announcement">General Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Communication Channels</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={preferences.email}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, email: !!checked }))}
                />
                <label htmlFor="email" className="flex items-center gap-2 text-sm cursor-pointer">
                  <Mail className="w-4 h-4" />
                  Email (includes full details and formatting)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms"
                  checked={preferences.sms}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, sms: !!checked }))}
                />
                <label htmlFor="sms" className="flex items-center gap-2 text-sm cursor-pointer">
                  <Smartphone className="w-4 h-4" />
                  SMS (short text message)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp"
                  checked={preferences.whatsapp}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, whatsapp: !!checked }))}
                />
                <label htmlFor="whatsapp" className="flex items-center gap-2 text-sm cursor-pointer">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp (formatted message with emojis)
                </label>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendNotifications}
            className="w-full"
            disabled={loading || !selectedEvent || (!preferences.email && !preferences.sms && !preferences.whatsapp)}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Sending Notifications...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send {notificationType === "reminder" ? "Reminders" : "Notifications"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

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
          <AlertDescription
            className={result.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}
          >
            <div className="font-medium">{result.message}</div>
            {result.sent !== undefined && result.total !== undefined && (
              <div className="text-sm mt-1">
                Successfully sent to {result.sent} out of {result.total} participants
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <strong>Event Reminders:</strong> Sent 24 hours before the event with departure details and instructions
          </div>
          <div>
            <strong>Event Updates:</strong> For changes to timing, location, or other important information
          </div>
          <div>
            <strong>Announcements:</strong> General messages to all participants about the event
          </div>
          <div className="pt-2 border-t">
            <strong>Note:</strong> Notifications are sent only to participants with "registered" status. Participants
            who have already checked in will not receive reminders.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
