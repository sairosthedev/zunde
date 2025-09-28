"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RegistrationForm } from "@/components/registration-form"
import type { Event } from "@/lib/types"
import { Calendar, MapPin, Users } from "lucide-react"

export function EventRegistration() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (selectedEvent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{selectedEvent.name}</h2>
            <p className="text-muted-foreground">Complete your registration below</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedEvent(null)}>
            Back to Events
          </Button>
        </div>

        <RegistrationForm event={selectedEvent} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select an Event</h2>
        <p className="text-muted-foreground">Choose the outreach event you'd like to attend</p>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No events available for registration at this time.</p>
            <p className="text-sm text-muted-foreground mt-2">Please check back later or contact the organizers.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event._id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{event.name}</CardTitle>
                    <CardDescription className="text-sm">{event.description}</CardDescription>
                  </div>
                  <Badge variant={event.status === "registration-open" ? "default" : "secondary"}>
                    {event.status === "registration-open" ? "Open" : "Upcoming"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.departureLocations.length} departure locations available
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Max {event.maxParticipants} participants
                </div>

                <Button
                  className="w-full"
                  onClick={() => setSelectedEvent(event)}
                  disabled={event.status === "registration-closed" || event.status === "completed"}
                >
                  {(event.status === "registration-open" || event.status === "upcoming") ? "Register Now" : "Registration Closed"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
