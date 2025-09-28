import { EventRegistration } from "@/components/event-registration"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Shield, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 p-4 bg-yellow-100 rounded-full w-fit">
              <UserPlus className="h-12 w-12 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Register for Zunde Outreach Preaching Events
            </h1>
            <p className="text-green-800 text-lg">
              Join our transformative spiritual experience and receive your QR-coded e-ticket
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-lg text-black">Step 1: Register</CardTitle>
                <CardDescription className="text-green-800">
                  Fill out the registration form with your personal details and event preferences
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-black">Step 2: Get E-Ticket</CardTitle>
                <CardDescription className="text-green-800">
                  Receive your unique QR-coded digital ticket via email, SMS, or WhatsApp
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-lg text-black">Step 3: Stay Updated</CardTitle>
                <CardDescription className="text-green-800">
                  Get event reminders, bus schedules, and important updates automatically
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">Registration Benefits</h2>
              <p className="text-green-800">What you get when you register with our system</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Safe & Secure Check-in</h3>
                    <p className="text-sm text-green-800">Contactless QR code scanning for faster and safer bus boarding</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Real-time Updates</h3>
                    <p className="text-sm text-green-800">Instant notifications about schedule changes and important announcements</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Digital Convenience</h3>
                    <p className="text-sm text-green-800">No paper tickets needed - show your phone or print at home</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Emergency Contact</h3>
                    <p className="text-sm text-green-800">Your emergency contact information is securely stored for safety</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EventRegistration />
        </div>
      </main>
    </div>
  )
}
