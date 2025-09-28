import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { CheckInRecord } from "@/lib/types"
import { ObjectId } from "mongodb"
import { sendCheckInConfirmation } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const { ticketId, busNumber, staffMember, location, action } = await request.json()
    
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ 
        success: false, 
        error: "MongoDB not configured. Please set MONGODB_URI in .env.local to enable check-in functionality.",
        suggestion: "Check-in requires database storage to track participant status"
      }, { status: 503 })
    }
    
    const db = await getDatabase()

    // Find participant by ticket ID
    const participant = await db.collection("participants").findOne({ ticketId })

    if (!participant) {
      return NextResponse.json({ success: false, error: "Invalid ticket ID" }, { status: 404 })
    }

    if (action === "checkin") {
      // Check if already checked in
      if (participant.status === "checked-in") {
        return NextResponse.json({ success: false, error: "Participant already checked in" }, { status: 400 })
      }

      // Create check-in record
      const checkInRecord: CheckInRecord = {
        participantId: participant._id.toString(),
        eventId: participant.eventId,
        checkInTime: new Date(),
        busNumber,
        staffMember,
        location,
      }

      await db.collection("checkins").insertOne(checkInRecord)

      // Update participant status
      await db.collection("participants").updateOne(
        { _id: participant._id },
        {
          $set: {
            status: "checked-in",
            busNumber,
          },
        },
      )

      const event = await db.collection("events").findOne({ _id: participant.eventId })

      if (event) {
        const notificationResult = await sendCheckInConfirmation(participant, event, busNumber, {
          email: false,
          sms: true,
          whatsapp: false,
        })

        console.log("[v0] Check-in notification results:", notificationResult)
      }

      return NextResponse.json({
        success: true,
        message: "Check-in successful",
        participant: {
          name: participant.fullName,
          ticketId: participant.ticketId,
          busNumber,
        },
      })
    } else if (action === "checkout") {
      // Find existing check-in record
      const checkInRecord = await db.collection("checkins").findOne({
        participantId: participant._id.toString(),
        checkOutTime: { $exists: false },
      })

      if (!checkInRecord) {
        return NextResponse.json({ success: false, error: "No check-in record found" }, { status: 400 })
      }

      // Update check-in record with check-out time
      await db.collection("checkins").updateOne({ _id: checkInRecord._id }, { $set: { checkOutTime: new Date() } })

      // Update participant status
      await db.collection("participants").updateOne({ _id: participant._id }, { $set: { status: "checked-out" } })

      return NextResponse.json({
        success: true,
        message: "Check-out successful",
        participant: {
          name: participant.fullName,
          ticketId: participant.ticketId,
        },
      })
    }
  } catch (error) {
    console.error("Check-in/out error:", error)
    return NextResponse.json({ success: false, error: "Check-in/out failed" }, { status: 500 })
  }
}
