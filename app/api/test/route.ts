import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Test endpoint called")
    return NextResponse.json({ 
      success: true, 
      message: "API is working",
      timestamp: new Date().toISOString(),
      mongodb_uri_set: !!process.env.MONGODB_URI
    })
  } catch (error) {
    console.error("Test endpoint error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Test failed" 
    }, { status: 500 })
  }
}
