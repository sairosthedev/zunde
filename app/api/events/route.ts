import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Event } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.date) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields: name and date are required" 
      }, { status: 400 })
    }
    
    const db = await getDatabase()

    const eventData = {
      ...body,
      createdAt: new Date(),
      status: "upcoming",
    }

    const result = await db.collection("events").insertOne(eventData)

    return NextResponse.json({
      success: true,
      eventId: result.insertedId,
    })
  } catch (error) {
    console.error("Event creation error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create event" 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log("Starting GET /api/events")
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI)
    
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      console.log("MongoDB URI not set, returning sample data")
      return NextResponse.json({ 
        success: true, 
        events: [
          {
            _id: "sample-1",
            name: "Sample Zunde Outreach Event",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            description: "This is a sample event. Please set up MongoDB to see real events.",
            departureLocations: ["Central Church", "North Church", "South Church"],
            maxParticipants: 100,
            registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            status: "upcoming",
            createdAt: new Date()
          }
        ],
        message: "MongoDB not configured. Showing sample data. Please set MONGODB_URI in .env.local"
      })
    }
    
    const db = await getDatabase()
    console.log("Database connection successful")
    
    const events = await db.collection("events").find({}).sort({ date: 1 }).toArray()
    console.log("Events fetched:", events.length)

    return NextResponse.json({ success: true, events })
  } catch (error) {
    console.error("Fetch events error:", error)
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch events" 
    }, { status: 500 })
  }
}
