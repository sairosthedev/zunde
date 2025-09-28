"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("participant")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check admin credentials
      if (role === "admin" && email === "admin@zunde.com" && password === "admin123") {
        // Store admin session (in a real app, you'd use proper session management)
        localStorage.setItem("userRole", "admin")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("isAuthenticated", "true")
        
        // Redirect to admin dashboard
        router.push("/admin")
        return
      }

      // Check participant credentials (for now, any email/password combination works)
      if (role === "participant") {
        // Store participant session
        localStorage.setItem("userRole", "participant")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("isAuthenticated", "true")
        
        // Redirect to participant dashboard
        router.push("/participant")
        return
      }

      // Invalid credentials
      setError("Invalid email or password. Please try again.")
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/uz-sda-logo.png"
                alt="UZ SDA Association Logo"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-lg font-bold text-black">UZ SDA Association</h1>
                <p className="text-sm text-green-800">Zunde Registration System</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Content Area - Dark Green Background */}
        <div className="flex-1 bg-gradient-to-br from-green-700 to-emerald-800 flex items-center justify-center p-12">
          <div className="max-w-lg text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Welcome to Zunde Registration
            </h1>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Join us for a transformative spiritual experience
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <span className="text-lg">Spiritual Growth</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <span className="text-lg">Community Fellowship</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <span className="text-lg">Meaningful Connections</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area - Login Form */}
        <div className="flex-1 flex items-center justify-center p-12 bg-white">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Sign In
              </CardTitle>
              <p className="text-gray-600">
                Access your account
              </p>
            </CardHeader>
            
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Role Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700 font-medium">
                    Role
                  </Label>
                  <Select value={role} onValueChange={setRole} disabled={loading}>
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participant">Participant</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-3 text-lg font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Footer Text */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-green-700 hover:text-green-800 font-medium">
                    Contact administrator
                  </Link>
                </p>
                {role === "admin" && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 text-sm">
                      <strong>Admin Demo Credentials:</strong><br />
                      Email: admin@zunde.com<br />
                      Password: admin123
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
