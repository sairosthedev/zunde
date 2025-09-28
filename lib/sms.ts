interface SMSData {
  to: string
  message: string
}

export async function sendSMS(smsData: SMSData): Promise<boolean> {
  try {
    // In production, integrate with SMS service like Twilio, AWS SNS, or similar
    // For demo purposes, we'll simulate SMS sending
    console.log("[v0] Simulating SMS send:", {
      to: smsData.to,
      message: smsData.message.substring(0, 50) + "...",
    })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return true
  } catch (error) {
    console.error("SMS sending failed:", error)
    return false
  }
}

export function generateTicketSMS(
  participantName: string,
  eventName: string,
  ticketId: string,
  departureLocation: string,
): string {
  return `Hi ${participantName}! Your registration for "${eventName}" is confirmed. Ticket ID: ${ticketId}. Departure: ${departureLocation}. Check your email for full details. - Zunde Outreach`
}

export function generateReminderSMS(
  participantName: string,
  eventName: string,
  departureTime: string,
  departureLocation: string,
): string {
  return `Reminder: ${participantName}, your outreach event "${eventName}" is tomorrow at ${departureTime} from ${departureLocation}. Arrive 15 mins early with your e-ticket. - Zunde`
}

export function generateCheckInSMS(participantName: string, eventName: string, busNumber: string): string {
  return `${participantName}, you're checked in for "${eventName}" on ${busNumber}. Have a blessed outreach experience! - Zunde`
}
