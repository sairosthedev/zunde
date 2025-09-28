"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Clock, CheckCircle, UserX } from "lucide-react"

interface CheckInRecord {
  _id: string
  participantName: string
  ticketId: string
  eventName: string
  checkInTime: string
  checkOutTime?: string
  busNumber: string
  staffMember: string
  location: string
  status: "checked-in" | "checked-out"
}

export function CheckInHistory() {
  const [records, setRecords] = useState<CheckInRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCheckInHistory()
  }, [])

  const fetchCheckInHistory = async () => {
    try {
      // This would be a real API call in production
      // For demo purposes, we'll create mock data
      const mockRecords: CheckInRecord[] = [
        {
          _id: "1",
          participantName: "John Doe",
          ticketId: "ZUN-ABC123-DEF456",
          eventName: "Sunday Outreach - Downtown",
          checkInTime: new Date(Date.now() - 3600000).toISOString(),
          busNumber: "Bus 1",
          staffMember: "Mary Johnson",
          location: "Church Main",
          status: "checked-in",
        },
        {
          _id: "2",
          participantName: "Jane Smith",
          ticketId: "ZUN-GHI789-JKL012",
          eventName: "Sunday Outreach - Downtown",
          checkInTime: new Date(Date.now() - 7200000).toISOString(),
          checkOutTime: new Date(Date.now() - 1800000).toISOString(),
          busNumber: "Bus 2",
          staffMember: "David Wilson",
          location: "Assembly Hall",
          status: "checked-out",
        },
      ]

      setRecords(mockRecords)
    } catch (error) {
      console.error("Failed to fetch check-in history:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter(
    (record) =>
      record.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (record: CheckInRecord) => {
    if (record.status === "checked-out") {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <UserX className="w-3 h-3" />
          Checked Out
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Checked In
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Check-in History</h2>
        <p className="text-muted-foreground">Recent check-in and check-out activities</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ticket ID, or event"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Showing {filteredRecords.length} of {records.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Check-in Time</TableHead>
                  <TableHead>Check-out Time</TableHead>
                  <TableHead>Bus</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.participantName}</div>
                        <div className="text-sm text-muted-foreground font-mono">{record.ticketId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.eventName}</div>
                        <div className="text-sm text-muted-foreground">{record.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {new Date(record.checkInTime).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {new Date(record.checkOutTime).toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.busNumber}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{record.staffMember}</TableCell>
                    <TableCell>{getStatusBadge(record)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRecords.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No check-in records found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
