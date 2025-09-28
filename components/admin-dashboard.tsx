"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventManagement } from "@/components/event-management"
import { NotificationCenter } from "@/components/notification-center"
import type { Event, Participant } from "@/lib/types"
import { Users, Calendar, CheckCircle, Clock } from "lucide-react"

export function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    checkedIn: 0,
    pending: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [eventsResponse, participantsResponse] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/participants"),
      ])

      const eventsData = await eventsResponse.json()
      const participantsData = await participantsResponse.json()

      if (eventsData.success) {
        setEvents(eventsData.events)
      }

      if (participantsData.success) {
        setParticipants(participantsData.participants)

        // Calculate stats
        const checkedIn = participantsData.participants.filter(
          (p: Participant) => p.status === "checked-in" || p.status === "checked-out",
        ).length

        const pending = participantsData.participants.filter((p: Participant) => p.status === "registered").length

        setStats({
          totalEvents: eventsData.events?.length || 0,
          totalParticipants: participantsData.participants.length,
          checkedIn,
          pending,
        })
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
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

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalEvents}</div>
            <p className="text-xs text-gray-500 mt-1">Active and upcoming events</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-green-600">All systems operational</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Participants</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.totalParticipants}</div>
            <p className="text-xs text-gray-500 mt-1">All registrations</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs text-blue-600">+12 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Checked In</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.checkedIn}</div>
            <p className="text-xs text-gray-500 mt-1">Attended events</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-xs text-red-600">{Math.round((stats.checkedIn / Math.max(stats.totalParticipants, 1)) * 100)}% attendance rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting check-in</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-xs text-yellow-600">Requires attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
        <Tabs defaultValue="events" className="space-y-0">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4">
            <TabsList className="bg-transparent border-0 p-0 h-auto">
              <TabsTrigger 
                value="events" 
                className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-lg text-white hover:text-green-100 px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Event Management
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-lg text-white hover:text-green-100 px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="events" className="p-6 space-y-4">
            <EventManagement events={events} onEventsChange={fetchData} />
          </TabsContent>



          <TabsContent value="notifications" className="p-6 space-y-4">
            <NotificationCenter events={events} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
