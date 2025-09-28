"use client"

import { AdminDashboard } from "@/components/admin-dashboard"
import { ParticipantsList } from "@/components/participants-list"
import { AttendanceStats } from "@/components/attendance-stats"
import { Button } from "@/components/ui/button"
import { Home, Users, ClipboardList, BarChart3, LogOut, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { Event, Participant } from "@/lib/types"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [events, setEvents] = useState<Event[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "participants", label: "Participants", icon: Users },
    { id: "checkins", label: "Check-ins", icon: ClipboardList },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ]

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
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-green-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-800 font-bold text-xl">Z</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Zunde Camp</h1>
              <p className="text-green-200 text-xs">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? "bg-white text-green-800 font-medium"
                        : "text-white hover:bg-green-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-green-700">
          <Button
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
            onClick={() => {
              localStorage.removeItem("userRole")
              localStorage.removeItem("userEmail")
              localStorage.removeItem("isAuthenticated")
              window.location.href = "/"
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
            </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {navigationItems.find(item => item.id === activeTab)?.label || "Dashboard"}
            </h1>
            <p className="text-gray-600 mt-1">
              {activeTab === "dashboard" && "Overview of your Zunde outreach events and statistics"}
              {activeTab === "participants" && "Manage and view all registered participants"}
              {activeTab === "checkins" && "Track check-ins and attendance for events"}
              {activeTab === "reports" && "Generate and view detailed camp reports and analytics"}
            </p>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 bg-gray-50">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "participants" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <ParticipantsList participants={participants} events={events} onParticipantsChange={fetchData} />
            </div>
          )}
          {activeTab === "checkins" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <AttendanceStats participants={participants} events={events} />
            </div>
          )}
          {activeTab === "reports" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Under Construction</h2>
                <p className="text-gray-600 mb-8">
                  The comprehensive reporting system is currently being developed. This feature will provide:
                </p>
                
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Financial Reports</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Attendance Analytics</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ArrowRight className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Export to PDF/Excel</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Church-wise Breakdown</h3>
                  </div>
          </div>

                <p className="text-gray-500 mt-8">
                  Coming soon! This feature will be available before the camp starts.
                </p>
              </div>
        </div>
          )}
      </main>
      </div>
    </div>
  )
}
