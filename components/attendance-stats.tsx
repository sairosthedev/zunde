"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Event, Participant } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface AttendanceStatsProps {
  participants: Participant[]
  events: Event[]
}

export function AttendanceStats({ participants, events }: AttendanceStatsProps) {
  // Calculate attendance stats by event
  const eventStats = events.map((event) => {
    const eventParticipants = participants.filter((p) => p.eventId === event._id)
    const checkedIn = eventParticipants.filter((p) => p.status === "checked-in" || p.status === "checked-out").length
    const registered = eventParticipants.length
    const attendanceRate = registered > 0 ? (checkedIn / registered) * 100 : 0

    return {
      name: event.name,
      registered,
      checkedIn,
      attendanceRate: Math.round(attendanceRate),
    }
  })

  // Overall status distribution
  const statusDistribution = [
    { name: "Registered", value: participants.filter((p) => p.status === "registered").length, color: "#8884d8" },
    { name: "Checked In", value: participants.filter((p) => p.status === "checked-in").length, color: "#82ca9d" },
    { name: "Checked Out", value: participants.filter((p) => p.status === "checked-out").length, color: "#ffc658" },
    { name: "No Show", value: participants.filter((p) => p.status === "no-show").length, color: "#ff7c7c" },
  ].filter((item) => item.value > 0)

  // Departure location stats
  const locationStats = participants.reduce(
    (acc, participant) => {
      const location = participant.preferredDepartureLocation
      if (!acc[location]) {
        acc[location] = { registered: 0, checkedIn: 0 }
      }
      acc[location].registered++
      if (participant.status === "checked-in" || participant.status === "checked-out") {
        acc[location].checkedIn++
      }
      return acc
    },
    {} as Record<string, { registered: number; checkedIn: number }>,
  )

  const locationData = Object.entries(locationStats).map(([location, stats]) => ({
    location,
    registered: stats.registered,
    checkedIn: stats.checkedIn,
    attendanceRate: Math.round((stats.checkedIn / stats.registered) * 100),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Attendance Statistics</h2>
        <p className="text-muted-foreground">Track attendance rates and participation metrics</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {participants.filter((p) => p.status === "checked-in" || p.status === "checked-out").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {participants.length > 0
                ? Math.round(
                    (participants.filter((p) => p.status === "checked-in" || p.status === "checked-out").length /
                      participants.length) *
                      100,
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Event Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Event</CardTitle>
            <CardDescription>Registration vs actual attendance for each event</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registered" fill="#8884d8" name="Registered" />
                <Bar dataKey="checkedIn" fill="#82ca9d" name="Attended" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Current status of all participants</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Departure Location Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance by Departure Location</CardTitle>
          <CardDescription>Registration and attendance rates for each departure point</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationData.map((location) => (
              <div key={location.location} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{location.location}</span>
                  <span className="text-sm text-muted-foreground">
                    {location.checkedIn}/{location.registered} ({location.attendanceRate}%)
                  </span>
                </div>
                <Progress value={location.attendanceRate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
