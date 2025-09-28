import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { sendEventReminder } from "@/lib/notifications"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { eventId, type, preferences } = await request.json()
    const db = await getDatabase()

    // Get event details
    const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) })
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    // Get all participants for the event
    const participants = await db.collection("participants").find({ eventId, status: "registered" }).toArray()

    if (participants.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No participants found for this event",
        sent: 0,
      })
    }

    let successCount = 0
    const results = []

    // Send notifications based on type
    if (type === "reminder") {
      for (const participant of participants) {
        try {
          const result = await sendEventReminder(
            participant as any,
            event as any,
            preferences || { email: true, sms: true, whatsapp: false },
          )

          if (result.success) {
            successCount++
          }

          results.push({
            participantId: participant._id,
            name: participant.fullName,
            success: result.success,
            results: result.results,
          })

          // Add small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          console.error(`Failed to send reminder to ${participant.fullName}:`, error)
          results.push({
            participantId: participant._id,
            name: participant.fullName,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} of ${participants.length} notifications`,
      sent: successCount,
      total: participants.length,
      results,
    })
  } catch (error) {
    console.error("Bulk notification error:", error)
    return NextResponse.json({ success: false, error: "Failed to send notifications" }, { status: 500 })
  }
}
