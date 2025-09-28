import { sendEmail, generateTicketEmailHTML, generateEventReminderHTML } from "./email"
import { sendSMS, generateTicketSMS, generateReminderSMS, generateCheckInSMS } from "./sms"
import { sendWhatsApp, generateTicketWhatsAppMessage, generateReminderWhatsAppMessage } from "./whatsapp"
import type { Participant, Event } from "./types"

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  whatsapp: boolean
}

export async function sendRegistrationConfirmation(
  participant: Participant,
  event: Event,
  qrCodeDataURL: string,
  preferences: NotificationPreferences = { email: true, sms: true, whatsapp: false },
): Promise<{ success: boolean; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {}

  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  try {
    // Send email confirmation with e-ticket
    if (preferences.email) {
      console.log("[v0] QR Code Data URL length:", qrCodeDataURL.length)
      console.log("[v0] QR Code Data URL preview:", qrCodeDataURL.substring(0, 50) + "...")

      // Prepare inline QR image as CID attachment for better email client support
      // qrCodeDataURL format: data:image/png;base64,AAAA...
      const match = qrCodeDataURL.match(/^data:(.*?);base64,(.*)$/)
      const mimeType = match?.[1] || "image/png"
      const base64Data = match?.[2] || ""

      // Replace the data URL in HTML with CID reference
      const cid = "ticket-qr"

      const emailHTML = generateTicketEmailHTML(
        participant.fullName,
        event.name,
        eventDate,
        participant.preferredDepartureLocation,
        participant.ticketId,
        qrCodeDataURL,
      )
      const emailHTMLWithCid = emailHTML.replace(qrCodeDataURL, `cid:${cid}`)

      results.email = await sendEmail({
        to: participant.email,
        subject: `Your Zunde Event Ticket - ${event.name}`,
        html: emailHTMLWithCid,
        attachments: base64Data
          ? [
              {
                filename: "ticket-qr.png",
                content: base64Data,
                encoding: "base64",
                cid,
                contentType: mimeType,
              },
            ]
          : undefined,
      })
    }

    // Send SMS confirmation
    if (preferences.sms) {
      const smsMessage = generateTicketSMS(
        participant.fullName,
        event.name,
        participant.ticketId,
        participant.preferredDepartureLocation,
      )

      results.sms = await sendSMS({
        to: participant.contactNumber,
        message: smsMessage,
      })
    }

    // Send WhatsApp confirmation
    if (preferences.whatsapp) {
      const whatsappMessage = generateTicketWhatsAppMessage(
        participant.fullName,
        event.name,
        eventDate,
        participant.ticketId,
        participant.preferredDepartureLocation,
      )

      results.whatsapp = await sendWhatsApp({
        to: participant.contactNumber,
        message: whatsappMessage,
      })
    }

    const success = Object.values(results).some((result) => result === true)
    return { success, results }
  } catch (error) {
    console.error("Error sending registration confirmation:", error)
    return { success: false, results }
  }
}

export async function sendEventReminder(
  participant: Participant,
  event: Event,
  preferences: NotificationPreferences = { email: true, sms: true, whatsapp: false },
): Promise<{ success: boolean; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {}

  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const departureTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  try {
    // Send email reminder
    if (preferences.email) {
      const emailHTML = generateEventReminderHTML(
        participant.fullName,
        event.name,
        eventDate,
        participant.preferredDepartureLocation,
        departureTime,
      )

      results.email = await sendEmail({
        to: participant.email,
        subject: `Reminder: ${event.name} is Tomorrow!`,
        html: emailHTML,
      })
    }

    // Send SMS reminder
    if (preferences.sms) {
      const smsMessage = generateReminderSMS(
        participant.fullName,
        event.name,
        departureTime,
        participant.preferredDepartureLocation,
      )

      results.sms = await sendSMS({
        to: participant.contactNumber,
        message: smsMessage,
      })
    }

    // Send WhatsApp reminder
    if (preferences.whatsapp) {
      const whatsappMessage = generateReminderWhatsAppMessage(
        participant.fullName,
        event.name,
        eventDate,
        departureTime,
        participant.preferredDepartureLocation,
      )

      results.whatsapp = await sendWhatsApp({
        to: participant.contactNumber,
        message: whatsappMessage,
      })
    }

    const success = Object.values(results).some((result) => result === true)
    return { success, results }
  } catch (error) {
    console.error("Error sending event reminder:", error)
    return { success: false, results }
  }
}

export async function sendCheckInConfirmation(
  participant: Participant,
  event: Event,
  busNumber: string,
  preferences: NotificationPreferences = { email: false, sms: true, whatsapp: false },
): Promise<{ success: boolean; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {}

  try {
    // Send SMS check-in confirmation
    if (preferences.sms) {
      const smsMessage = generateCheckInSMS(participant.fullName, event.name, busNumber)

      results.sms = await sendSMS({
        to: participant.contactNumber,
        message: smsMessage,
      })
    }

    const success = Object.values(results).some((result) => result === true)
    return { success, results }
  } catch (error) {
    console.error("Error sending check-in confirmation:", error)
    return { success: false, results }
  }
}
