"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Event, Participant } from "@/lib/types"
import { Search, Download, Filter } from "lucide-react"

interface ParticipantsListProps {
  participants: Participant[]
  events: Event[]
  onParticipantsChange: () => void
}

export function ParticipantsList({ participants, events }: ParticipantsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.ticketId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || participant.status === statusFilter
    const matchesEvent = eventFilter === "all" || participant.eventId === eventFilter

    return matchesSearch && matchesStatus && matchesEvent
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge variant="secondary">Registered</Badge>
      case "checked-in":
        return <Badge variant="default">Checked In</Badge>
      case "checked-out":
        return <Badge variant="outline">Checked Out</Badge>
      case "no-show":
        return <Badge variant="destructive">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getEventName = (eventId: string) => {
    const event = events.find((e) => e._id === eventId)
    return event?.name || "Unknown Event"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Participants</h2>
        <p className="text-muted-foreground">View and manage event registrations</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ticket ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Event</label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event._id} value={event._id!}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registered Participants</CardTitle>
              <CardDescription>
                Showing {filteredParticipants.length} of {participants.length} participants
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.map((participant) => (
                  <TableRow key={participant._id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{participant.fullName}</div>
                        <div className="text-sm text-muted-foreground">{participant.churchAssembly}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getEventName(participant.eventId)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{participant.contactNumber}</div>
                        <div className="text-sm text-muted-foreground">{participant.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{participant.preferredDepartureLocation}</TableCell>
                    <TableCell>{getStatusBadge(participant.status)}</TableCell>
                    <TableCell className="font-mono text-sm">{participant.ticketId}</TableCell>
                    <TableCell>{new Date(participant.registrationDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredParticipants.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No participants found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
