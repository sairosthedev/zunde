import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Participant } from "@/lib/types"
import { generateTicketId, generateQRCode } from "@/lib/qr-generator"
import { sendRegistrationConfirmation } from "@/lib/notifications"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.contactNumber || !body.eventId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields: fullName, email, contactNumber, and eventId are required" 
      }, { status: 400 })
    }
    
    const db = await getDatabase()

    // Generate unique ticket ID and QR code
    const ticketId = generateTicketId()
    const qrCode = await generateQRCode(ticketId)

    const participant: Participant = {
      ...body,
      ticketId,
      qrCode,
      registrationDate: new Date(),
      status: "registered",
    }

    const result = await db.collection("participants").insertOne(participant)

    const event = await db.collection("events").findOne({ _id: new ObjectId(body.eventId) })

    if (event) {
      const notificationResult = await sendRegistrationConfirmation(participant, event, qrCode, {
        email: true,
        sms: true,
        whatsapp: false,
      })

      console.log("[v0] Notification results:", notificationResult)
    }

    return NextResponse.json({
      success: true,
      participantId: result.insertedId,
      ticketId,
      qrCode,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Registration failed" 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      console.log("MongoDB URI not set, returning sample participants data")
      return NextResponse.json({ 
        success: true, 
        participants: [
          {
            _id: "sample-participant-1",
            fullName: "John Doe",
            contactNumber: "+263 77 123 4567",
            email: "john.doe@example.com",
            churchAssembly: "Central Church",
            preferredDepartureLocation: "Central Church",
            emergencyContact: "Jane Doe",
            emergencyContactNumber: "+263 77 987 6543",
            eventId: "sample-1",
            ticketId: "ZUN-SAMPLE-001",
            registrationDate: new Date(),
            status: "registered",
            qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
          },
          {
            _id: "sample-participant-2",
            fullName: "Mary Smith",
            contactNumber: "+263 77 234 5678",
            email: "mary.smith@example.com",
            churchAssembly: "North Church",
            preferredDepartureLocation: "North Church",
            emergencyContact: "Peter Smith",
            emergencyContactNumber: "+263 77 876 5432",
            eventId: "sample-1",
            ticketId: "ZUN-SAMPLE-002",
            registrationDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            status: "checked-in",
            busNumber: "Bus A",
            qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
          }
        ],
        message: "MongoDB not configured. Showing sample data. Please set MONGODB_URI in .env.local"
      })
    }

    const db = await getDatabase()
    const query = eventId ? { eventId } : {}

    const participants = await db.collection("participants").find(query).sort({ registrationDate: -1 }).toArray()

    return NextResponse.json({ success: true, participants })
  } catch (error) {
    console.error("Fetch participants error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch participants" 
    }, { status: 500 })
  }
}
