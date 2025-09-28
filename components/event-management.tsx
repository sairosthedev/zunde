"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Event } from "@/lib/types"
import { Plus, Calendar, MapPin, Users, Edit } from "lucide-react"

interface EventManagementProps {
  events: Event[]
  onEventsChange: () => void
}

export function EventManagement({ events, onEventsChange }: EventManagementProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    departureLocations: "",
    maxParticipants: "",
    registrationDeadline: "",
  })

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const eventData = {
        ...formData,
        date: new Date(formData.date),
        registrationDeadline: new Date(formData.registrationDeadline),
        departureLocations: formData.departureLocations.split(",").map((loc) => loc.trim()),
        maxParticipants: Number.parseInt(formData.maxParticipants),
        status: "registration-open",
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()

      if (data.success) {
        setShowCreateDialog(false)
        setFormData({
          name: "",
          description: "",
          date: "",
          departureLocations: "",
          maxParticipants: "",
          registrationDeadline: "",
        })
        onEventsChange()
      } else {
        alert("Failed to create event")
      }
    } catch (error) {
      console.error("Event creation error:", error)
      alert("Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Event Management</h2>
          <p className="text-muted-foreground">Create and manage outreach events</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Set up a new outreach event for participant registration</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Sunday Outreach - Downtown"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the event"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input
                  id="registrationDeadline"
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, registrationDeadline: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureLocations">Departure Locations</Label>
                <Input
                  id="departureLocations"
                  value={formData.departureLocations}
                  onChange={(e) => setFormData((prev) => ({ ...prev, departureLocations: e.target.value }))}
                  placeholder="Church Main, Assembly Hall, Community Center (comma separated)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maxParticipants: e.target.value }))}
                  placeholder="100"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
                  <CardDescription className="text-sm">{event.description}</CardDescription>
                </div>
                <Badge
                  variant={
                    event.status === "registration-open"
                      ? "default"
                      : event.status === "upcoming"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {event.status.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
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
                {event.departureLocations.length} departure locations
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                Max {event.maxParticipants} participants
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {events.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No events created yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Create your first event to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
