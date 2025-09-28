import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Users, Shield, BarChart3, ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header with Logo */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/uz-sda-logo.png"
                alt="UZ SDA Association Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-black">UZ SDA Association</h1>
                <p className="text-sm text-green-800">Zunde Registration System</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/register">
                <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  Register
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <Image
              src="/images/uz-sda-logo.png"
              alt="UZ SDA Association Logo"
              width={120}
              height={120}
              className="mx-auto mb-6 rounded-2xl shadow-lg"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Zunde Registration
              <span className="block text-yellow-600">& Check-in System</span>
            </h1>
            <p className="text-xl text-green-800 max-w-3xl mx-auto mb-10 leading-relaxed">
              Streamline your Zunde outreach preaching events with our digital registration and QR-coded check-in system. 
              Efficient, secure, and designed for the UZ SDA Association.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex justify-center max-w-lg mx-auto">
            <Link href="/register" className="flex-1">
              <Button size="lg" className="w-full h-14 text-lg bg-red-600 hover:bg-red-700">
                Register for Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Why Choose Our System?</h2>
            <p className="text-xl text-green-800 max-w-2xl mx-auto">
              Built specifically for UZ SDA Association's Zunde outreach events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl mb-4 text-black">QR-Coded E-Tickets</CardTitle>
              <CardContent className="p-0">
                <p className="text-green-800 mb-4 leading-relaxed">
                  Generate unique QR-coded tickets for each participant. Quick, secure, and contactless check-in process.
                </p>
                <div className="flex items-center justify-center text-yellow-600 font-semibold">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Instant Generation
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl mb-4 text-black">Real-time Tracking</CardTitle>
              <CardContent className="p-0">
                <p className="text-green-800 mb-4 leading-relaxed">
                  Monitor attendance, bus assignments, and participant status in real-time. Perfect for event coordination.
                </p>
                <div className="flex items-center justify-center text-blue-600 font-semibold">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Live Updates
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl mb-4 text-black">Analytics Dashboard</CardTitle>
              <CardContent className="p-0">
                <p className="text-green-800 mb-4 leading-relaxed">
                  Comprehensive reports and analytics for better event planning and participant management.
                </p>
                <div className="flex items-center justify-center text-red-600 font-semibold">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Data Insights
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-xl text-green-800 max-w-2xl mx-auto">
              Simple, efficient process designed for UZ SDA Association events
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 font-bold text-lg">1</span>
                </div>
                <div>
                  <CardTitle className="text-2xl mb-4 text-black flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-yellow-600" />
                    Event Registration
                  </CardTitle>
                  <CardContent className="p-0">
                    <p className="text-green-800 mb-6 leading-relaxed">
                      Register for Zunde outreach events online. Provide your details and receive a QR-coded e-ticket via email or SMS. 
                      Choose your preferred departure location and bus assignment.
                    </p>
                    <Link href="/register">
                      <Button className="bg-red-600 hover:bg-red-700">
                        Start Registration
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <div>
                  <CardTitle className="text-2xl mb-4 text-black flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-blue-600" />
                    Check-in Process
                  </CardTitle>
                  <CardContent className="p-0">
                    <p className="text-green-800 mb-6 leading-relaxed">
                      Present your QR code at departure points for quick and secure bus boarding. Real-time attendance tracking 
                      ensures smooth coordination and safety.
                    </p>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-20">
          <Card className="bg-gradient-to-r from-green-700 to-emerald-800 text-white border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="flex items-center justify-center mb-8">
                <Image
                  src="/images/uz-sda-logo.png"
                  alt="UZ SDA Association Logo"
                  width={80}
                  height={80}
                  className="rounded-xl mr-4"
                />
                <div className="text-left">
                  <h2 className="text-3xl font-bold mb-2">UZ SDA Association</h2>
                  <p className="text-green-100">University of Zimbabwe, Harare</p>
                </div>
              </div>
              
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                The UZ SDA Association organizes Zunde outreach preaching events to serve communities and spread the gospel. 
                Our digital registration and check-in system ensures efficient event management and participant safety.
              </p>
              
              <div className="flex justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400">
                    Register for Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/images/uz-sda-logo.png"
                alt="UZ SDA Association Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h3 className="font-bold text-lg">UZ SDA Association</h3>
                <p className="text-yellow-500 text-sm">Zunde Registration System</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-300 text-sm">
                © 2025 UZ SDA Association. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                University of Zimbabwe, Harare, Zimbabwe
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}