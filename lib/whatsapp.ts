interface WhatsAppData {
  to: string
  message: string
  mediaUrl?: string
}

export async function sendWhatsApp(whatsappData: WhatsAppData): Promise<boolean> {
  try {
    // In production, integrate with WhatsApp Business API or Twilio WhatsApp
    // For demo purposes, we'll simulate WhatsApp sending
    console.log("[v0] Simulating WhatsApp send:", {
      to: whatsappData.to,
      message: whatsappData.message.substring(0, 50) + "...",
      hasMedia: !!whatsappData.mediaUrl,
    })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return true
  } catch (error) {
    console.error("WhatsApp sending failed:", error)
    return false
  }
}

export function generateTicketWhatsAppMessage(
  participantName: string,
  eventName: string,
  eventDate: string,
  ticketId: string,
  departureLocation: string,
): string {
  return `🙏 *Zunde Outreach Registration Confirmed*

Hello ${participantName}!

Your registration for *${eventName}* has been confirmed.

📅 *Event Details:*
• Date: ${eventDate}
• Departure: ${departureLocation}
• Ticket ID: \`${ticketId}\`

✅ *Next Steps:*
• Check your email for the full e-ticket with QR code
• Arrive 15 minutes early for check-in
• Bring your Bible, notebook, and water bottle

We're excited to have you join us for this outreach event!

God bless,
*The Zunde Outreach Team*`
}

export function generateReminderWhatsAppMessage(
  participantName: string,
  eventName: string,
  eventDate: string,
  departureTime: string,
  departureLocation: string,
): string {
  return `⏰ *Event Reminder - Tomorrow!*

Hi ${participantName},

Don't forget about your outreach event tomorrow:

🚌 *${eventName}*
📅 Date: ${eventDate}
🕐 Departure: ${departureTime}
📍 Location: ${departureLocation}

⚠️ *Important Reminders:*
• Arrive 15 minutes early
• Bring your e-ticket (digital or printed)
• Bring Bible, notebook, water bottle
• Wear comfortable walking shoes

See you tomorrow!

*Zunde Outreach Team*`
}
