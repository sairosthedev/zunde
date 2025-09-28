"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/types"
import { Download, CheckCircle, Calendar, MapPin, User, Phone } from "lucide-react"

interface TicketDisplayProps {
  event: Event
  participant: {
    fullName: string
    contactNumber: string
    email: string
    churchAssembly: string
    preferredDepartureLocation: string
    emergencyContact: string
    emergencyContactNumber: string
  }
  ticketId: string
  qrCode: string
}

export function TicketDisplay({ event, participant, ticketId, qrCode }: TicketDisplayProps) {
  const downloadTicket = () => {
    // Create a printable version of the ticket matching the specification
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Zunde Outreach Preaching Event - ${ticketId}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                background: #f8f9fa;
                margin: 0;
              }
              .ticket { 
                border: 3px solid #16a34a; 
                padding: 30px; 
                max-width: 450px; 
                margin: 0 auto; 
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .header { 
                text-align: center; 
                margin-bottom: 25px; 
                border-bottom: 2px solid #16a34a;
                padding-bottom: 15px;
              }
              .header h1 {
                color: #16a34a;
                font-size: 24px;
                margin: 0 0 5px 0;
                font-weight: bold;
              }
              .header h2 {
                color: #333;
                font-size: 18px;
                margin: 0;
                font-weight: normal;
              }
              .qr-code { 
                text-align: center; 
                margin: 25px 0; 
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
              }
              .details { 
                margin: 15px 0; 
                line-height: 1.6;
              }
              .details p {
                margin: 8px 0;
                font-size: 14px;
              }
              .details strong {
                color: #16a34a;
                font-weight: bold;
              }
              .footer { 
                text-align: center; 
                margin-top: 25px; 
                font-size: 12px; 
                color: #666;
                border-top: 1px solid #e5e7eb;
                padding-top: 15px;
              }
              .ticket-id {
                background: #16a34a;
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="header">
                <h1>Zunde Outreach Preaching Event</h1>
                <h2>${event.name}</h2>
              </div>
              <div class="details">
                <p><strong>Participant:</strong> ${participant.fullName}</p>
                <p><strong>Event Date:</strong> ${new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric", 
                  month: "long",
                  day: "numeric"
                })}</p>
                <p><strong>Departure:</strong> ${participant.preferredDepartureLocation}</p>
                <p><strong>Contact:</strong> ${participant.contactNumber}</p>
                <p><strong>Church Assembly:</strong> ${participant.churchAssembly}</p>
              </div>
              <div class="ticket-id">
                Ticket ID: ${ticketId}
              </div>
              <div class="qr-code">
                <img src="${qrCode}" alt="QR Code" style="width: 180px; height: 180px;" />
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Unique Ticket ID / QR Code</p>
              </div>
              <div class="footer">
                <p><strong>Present this ticket (digital or printed) at departure point</strong></p>
                <p>Powered by Zunde Check-in System</p>
                <p>For support, contact: macdonald@zunde.org</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <h2 className="text-2xl font-bold text-black">Registration Successful!</h2>
        </div>
        <p className="text-green-800 text-lg">
          Your e-ticket has been generated and will be sent to you via your preferred notification method.
        </p>
        <p className="text-green-700 mt-2">
          Save or print this ticket for event check-in. You'll also receive event reminders and updates.
        </p>
      </div>

      <Card className="max-w-lg mx-auto border-2 border-green-600 shadow-xl">
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="mb-2">
            <h1 className="text-xl font-bold">Zunde Outreach Preaching Event</h1>
            <h2 className="text-lg font-medium">{event.name}</h2>
          </div>
          <Badge className="bg-yellow-500 text-black font-bold">
            Ticket ID: {ticketId}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="text-center bg-gray-50 p-4 rounded-lg">
            <img
              src={qrCode || "/placeholder.svg"}
              alt="QR Code"
              className="w-40 h-40 mx-auto border-2 border-green-600 rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-2 font-medium">Unique Ticket ID / QR Code</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-semibold text-green-800">Participant:</span>
                <span className="ml-2 font-medium">{participant.fullName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-semibold text-green-800">Event Date:</span>
                <span className="ml-2">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-semibold text-green-800">Departure:</span>
                <span className="ml-2">{participant.preferredDepartureLocation}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-semibold text-green-800">Contact:</span>
                <span className="ml-2">{participant.contactNumber}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-green-600 mt-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <span className="font-semibold text-green-800">Church Assembly:</span>
                <span className="ml-2">{participant.churchAssembly}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={downloadTicket} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Download/Print Ticket
            </Button>
          </div>

          <div className="text-center text-xs text-gray-600 space-y-1">
            <p className="font-semibold">Present this ticket (digital or printed) at departure point</p>
            <p>Powered by Zunde Check-in System</p>
            <p>For support, contact: [Hotline/Email]</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Register Another Participant
        </Button>
      </div>
    </div>
  )
}
