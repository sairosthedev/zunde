import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not set, MongoDB features will be limited')
  console.warn('Please create a .env.local file with MONGODB_URI=mongodb+srv://macdonald:macdonald24@zunde.3zjtuav.mongodb.net/zunde_registration?retryWrites=true&w=majority')
  // Don't throw error, just log warning
}

const uri = process.env.MONGODB_URI || "mongodb+srv://macdonald:macdonald24@zunde.3zjtuav.mongodb.net/zunde_registration?retryWrites=true&w=majority"
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  // Create a mock promise that rejects when MongoDB is not configured
  clientPromise = Promise.reject(new Error('MongoDB not configured'))
}

export async function getDatabase(): Promise<Db> {
  try {
    console.log("Attempting to connect to MongoDB...")
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set")
    
    const client = await clientPromise
    console.log("MongoDB client connected successfully")
    
    const db = client.db("zunde_registration")
    console.log("Database 'zunde_registration' accessed successfully")
    
    return db
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export default clientPromise
