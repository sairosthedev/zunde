import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing MongoDB connection...")
    
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: "MongoDB URI not configured",
        message: "Please set MONGODB_URI in your .env.local file",
        suggestion: "Add MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zunde_registration to .env.local"
      })
    }

    // Test database connection
    const db = await getDatabase()
    console.log("MongoDB connection successful")

    // Test basic operations
    const testCollection = db.collection("system_test")
    
    // Insert a test document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: "MongoDB connection test successful"
    }
    
    const insertResult = await testCollection.insertOne(testDoc)
    console.log("Test document inserted:", insertResult.insertedId)

    // Read the test document
    const retrievedDoc = await testCollection.findOne({ _id: insertResult.insertedId })
    console.log("Test document retrieved:", retrievedDoc)

    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId })
    console.log("Test document cleaned up")

    // Test collections exist or can be created
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(col => col.name)
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      database: "zunde_registration",
      collections: collectionNames,
      operations: {
        insert: true,
        read: true,
        delete: true
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("MongoDB test failed:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "MongoDB connection failed",
      suggestions: [
        "Check your MONGODB_URI in .env.local",
        "Verify your MongoDB Atlas cluster is running",
        "Ensure your IP is whitelisted in MongoDB Atlas",
        "Check your database user permissions"
      ],
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
