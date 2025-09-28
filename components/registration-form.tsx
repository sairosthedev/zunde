"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Event, Participant } from "@/lib/types"
import { TicketDisplay } from "@/components/ticket-display"
import { Loader2, CheckCircle } from "lucide-react"

interface RegistrationFormProps {
  event: Event
}

export function RegistrationForm({ event }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    churchAssembly: "",
    preferredDepartureLocation: "",
    emergencyContact: "",
    emergencyContactNumber: "",
    notificationPreference: "email", // email, sms, whatsapp
  })

  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<{ ticketId: string; qrCode: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.email.includes("@")) newErrors.email = "Please enter a valid email"
    if (!formData.churchAssembly.trim()) newErrors.churchAssembly = "Church assembly is required"
    if (!formData.preferredDepartureLocation)
      newErrors.preferredDepartureLocation = "Please select a departure location"
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required"
    if (!formData.emergencyContactNumber.trim())
      newErrors.emergencyContactNumber = "Emergency contact number is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const participantData: Omit<Participant, "_id" | "ticketId" | "registrationDate" | "status" | "qrCode"> = {
        ...formData,
        eventId: event._id!,
      }

      const response = await fetch("/api/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(participantData),
      })

      const data = await response.json()

      if (data.success) {
        setTicket({
          ticketId: data.ticketId,
          qrCode: data.qrCode,
        })
      } else {
        alert("Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (ticket) {
    return <TicketDisplay event={event} participant={formData} ticketId={ticket.ticketId} qrCode={ticket.qrCode} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-accent" />
          Registration Form
        </CardTitle>
        <CardDescription>Please fill in all required information to complete your registration</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="Enter your phone number"
                className={errors.contactNumber ? "border-destructive" : ""}
              />
              {errors.contactNumber && <p className="text-sm text-destructive">{errors.contactNumber}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email address"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="churchAssembly">Church Assembly *</Label>
            <Input
              id="churchAssembly"
              value={formData.churchAssembly}
              onChange={(e) => setFormData((prev) => ({ ...prev, churchAssembly: e.target.value }))}
              placeholder="Enter your church assembly name"
              className={errors.churchAssembly ? "border-destructive" : ""}
            />
            {errors.churchAssembly && <p className="text-sm text-destructive">{errors.churchAssembly}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureLocation">Preferred Departure Location *</Label>
            <Select
              value={formData.preferredDepartureLocation}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, preferredDepartureLocation: value }))}
            >
              <SelectTrigger className={errors.preferredDepartureLocation ? "border-destructive" : ""}>
                <SelectValue placeholder="Select departure location" />
              </SelectTrigger>
              <SelectContent>
                {event.departureLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.preferredDepartureLocation && (
              <p className="text-sm text-destructive">{errors.preferredDepartureLocation}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Emergency contact full name"
                className={errors.emergencyContact ? "border-destructive" : ""}
              />
              {errors.emergencyContact && <p className="text-sm text-destructive">{errors.emergencyContact}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactNumber">Emergency Contact Number *</Label>
              <Input
                id="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContactNumber: e.target.value }))}
                placeholder="Emergency contact phone"
                className={errors.emergencyContactNumber ? "border-destructive" : ""}
              />
              {errors.emergencyContactNumber && (
                <p className="text-sm text-destructive">{errors.emergencyContactNumber}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationPreference">Notification Preference *</Label>
            <Select
              value={formData.notificationPreference}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, notificationPreference: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="How would you like to receive updates?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email - Event updates and e-ticket delivery</SelectItem>
                <SelectItem value="sms">SMS - Text messages for important updates</SelectItem>
                <SelectItem value="whatsapp">WhatsApp - Messages via WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              You'll receive your e-ticket and event updates via your preferred method
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Registration...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
