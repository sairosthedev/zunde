"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, Mail, MessageSquare, Users, Calendar } from "lucide-react"

export default function TestSystemPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const testDatabaseConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/mongodb-test")
      const data = await response.json()
      setTestResults(prev => ({ ...prev, database: data }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, database: { success: false, error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testEventCreation = async () => {
    setLoading(true)
    try {
      const eventData = {
        name: "Test Zunde Outreach Event",
        description: "This is a test event to verify the system is working",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        departureLocations: ["Central Church", "North Church", "South Church"],
        maxParticipants: 50,
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })
      const data = await response.json()
      setTestResults(prev => ({ ...prev, eventCreation: data }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, eventCreation: { success: false, error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testParticipantRegistration = async () => {
    setLoading(true)
    try {
      // First get events to get an eventId
      const eventsResponse = await fetch("/api/events")
      const eventsData = await eventsResponse.json()
      
      if (!eventsData.success || eventsData.events.length === 0) {
        setTestResults(prev => ({ ...prev, participantRegistration: { success: false, error: "No events available for testing" } }))
        return
      }

      const eventId = eventsData.events[0]._id
      const participantData = {
        fullName: "Test Participant",
        email: "test@example.com",
        contactNumber: "+263 77 123 4567",
        churchAssembly: "Test Church",
        preferredDepartureLocation: "Central Church",
        emergencyContact: "Emergency Contact",
        emergencyContactNumber: "+263 77 987 6543",
        eventId: eventId,
        notificationPreference: "email"
      }

      const response = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(participantData),
      })
      const data = await response.json()
      setTestResults(prev => ({ ...prev, participantRegistration: data }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, participantRegistration: { success: false, error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testCheckIn = async () => {
    setLoading(true)
    try {
      // Get participants to find a ticket ID
      const participantsResponse = await fetch("/api/participants")
      const participantsData = await participantsResponse.json()
      
      if (!participantsData.success || participantsData.participants.length === 0) {
        setTestResults(prev => ({ ...prev, checkIn: { success: false, error: "No participants available for testing" } }))
        return
      }

      const participant = participantsData.participants[0]
      const checkInData = {
        ticketId: participant.ticketId,
        busNumber: "Test Bus 1",
        staffMember: "Test Staff",
        location: "Test Location",
        action: "checkin"
      }

      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkInData),
      })
      const data = await response.json()
      setTestResults(prev => ({ ...prev, checkIn: data }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, checkIn: { success: false, error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "test",
          message: "This is a test notification from the Zunde system"
        }),
      })
      const data = await response.json()
      setTestResults(prev => ({ ...prev, notifications: data }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, notifications: { success: false, error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    setTestResults({})
    
    await testDatabaseConnection()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await testEventCreation()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await testParticipantRegistration()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await testCheckIn()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await testNotifications()
    setLoading(false)
  }

  const getStatusIcon = (result: any) => {
    if (!result) return null
    if (result.success) return <CheckCircle className="w-5 h-5 text-green-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusBadge = (result: any) => {
    if (!result) return <Badge variant="secondary">Not Tested</Badge>
    if (result.success) return <Badge className="bg-green-500">Success</Badge>
    return <Badge variant="destructive">Failed</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">System Testing Dashboard</h1>
          <p className="text-green-800 text-lg">
            Test all components of the Zunde Registration System
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg text-black">Database Connection</CardTitle>
              <div className="flex items-center justify-center gap-2">
                {getStatusIcon(testResults.database)}
                {getStatusBadge(testResults.database)}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testDatabaseConnection} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Test Database
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-lg text-black">Event Creation</CardTitle>
              <div className="flex items-center justify-center gap-2">
                {getStatusIcon(testResults.eventCreation)}
                {getStatusBadge(testResults.eventCreation)}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testEventCreation} 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Test Event Creation
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-lg text-black">Participant Registration</CardTitle>
              <div className="flex items-center justify-center gap-2">
                {getStatusIcon(testResults.participantRegistration)}
                {getStatusBadge(testResults.participantRegistration)}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testParticipantRegistration} 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Test Registration
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-lg text-black">Check-in System</CardTitle>
              <div className="flex items-center justify-center gap-2">
                {getStatusIcon(testResults.checkIn)}
                {getStatusBadge(testResults.checkIn)}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testCheckIn} 
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Test Check-in
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg text-black">Notifications</CardTitle>
              <div className="flex items-center justify-center gap-2">
                {getStatusIcon(testResults.notifications)}
                {getStatusBadge(testResults.notifications)}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testNotifications} 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Test Notifications
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-lg text-black">Run All Tests</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline">Comprehensive</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runAllTests} 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Run All Tests
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black">Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(testResults).map(([test, result]) => (
                <div key={test} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg capitalize">{test.replace(/([A-Z])/g, ' $1')}</h3>
                    {getStatusIcon(result)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href="/admin">Go to Admin Dashboard</a>
              </Button>
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <a href="/register">Test Registration</a>
              </Button>
              <Button asChild variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50">
                <a href="/login">Test Login</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
