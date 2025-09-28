import nodemailer from "nodemailer"

interface EmailData {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: string
    encoding: string
    cid?: string
    contentType?: string
  }>
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("[v0] Email configuration not set, simulating email send:", {
        to: emailData.to,
        subject: emailData.subject,
        hasAttachments: !!emailData.attachments?.length,
      })
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    }

    // Create transporter based on email service
    let transporter: nodemailer.Transporter

    if (process.env.EMAIL_SERVICE === "gmail") {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    } else {
      // Generic SMTP configuration
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      attachments: emailData.attachments,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("[v0] Email sent successfully:", result.messageId)
    return true
  } catch (error) {
    console.error("Email sending failed:", error)
    return false
  }
}

export function generateTicketEmailHTML(
  participantName: string,
  eventName: string,
  eventDate: string,
  departureLocation: string,
  ticketId: string,
  qrCodeDataURL: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Zunde Event Ticket</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .content { padding: 30px 20px; }
        .ticket { border: 2px dashed #e74c3c; border-radius: 8px; padding: 20px; margin: 20px 0; background: #fafafa; }
        .ticket-header { text-align: center; margin-bottom: 20px; }
        .ticket-header h2 { color: #e74c3c; margin: 0; }
        .ticket-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .detail-item { }
        .detail-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
        .detail-value { font-size: 16px; color: #333; margin-top: 2px; }
        .qr-section { text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 8px; }
        .qr-code { max-width: 150px; height: auto; }
        .instructions { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .instructions h3 { color: #2980b9; margin-top: 0; }
        .footer { background: #34495e; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .footer a { color: #3498db; text-decoration: none; }
        @media (max-width: 600px) {
          .ticket-details { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🙏 Zunde Outreach Event</h1>
          <p>Your registration is confirmed!</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${participantName}</strong>,</p>
          
          <p>Thank you for registering for our upcoming outreach event. Your e-ticket has been generated and is ready for use.</p>
          
          <div class="ticket">
            <div class="ticket-header">
              <h2>${eventName}</h2>
            </div>
            
            <div class="ticket-details">
              <div class="detail-item">
                <div class="detail-label">Participant</div>
                <div class="detail-value">${participantName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Event Date</div>
                <div class="detail-value">${eventDate}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Departure Location</div>
                <div class="detail-value">${departureLocation}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Ticket ID</div>
                <div class="detail-value" style="font-family: monospace;">${ticketId}</div>
              </div>
            </div>
            
            <div class="qr-section">
              <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code" style="display: block; margin: 0 auto;" />
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                Present this QR code at check-in
              </p>
              <p style="margin: 5px 0 0 0; font-size: 10px; color: #999;">
                If the QR code doesn't display, your ticket ID is: <strong>${ticketId}</strong>
              </p>
            </div>
          </div>
          
          <div class="instructions">
            <h3>Important Instructions:</h3>
            <ul>
              <li><strong>Arrival:</strong> Please arrive at your departure location 15 minutes before the scheduled time</li>
              <li><strong>Check-in:</strong> Present this email (digital or printed) to staff for scanning</li>
              <li><strong>Contact:</strong> Keep your phone accessible for any event updates</li>
              <li><strong>What to bring:</strong> Bible, notebook, water bottle, and comfortable walking shoes</li>
            </ul>
          </div>
          
          <p>We're excited to have you join us for this outreach event. If you have any questions or need to make changes to your registration, please contact our team.</p>
          
          <p>God bless,<br><strong>The Zunde Outreach Team</strong></p>
        </div>
        
        <div class="footer">
          <p>Zunde Registration System | <a href="mailto:support@zunde.org">support@zunde.org</a></p>
          <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateEventReminderHTML(
  participantName: string,
  eventName: string,
  eventDate: string,
  departureLocation: string,
  departureTime: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Reminder - ${eventName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; }
        .reminder-box { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .reminder-box h3 { color: #856404; margin-top: 0; }
        .event-details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: bold; color: #666; }
        .detail-value { color: #333; }
        .footer { background: #34495e; color: white; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Event Reminder</h1>
          <p>Don't forget about tomorrow's outreach!</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${participantName}</strong>,</p>
          
          <div class="reminder-box">
            <h3>🚌 Your outreach event is tomorrow!</h3>
            <p>This is a friendly reminder about your upcoming participation in our outreach event.</p>
          </div>
          
          <div class="event-details">
            <div class="detail-row">
              <span class="detail-label">Event:</span>
              <span class="detail-value">${eventName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${eventDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Departure Location:</span>
              <span class="detail-value">${departureLocation}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Departure Time:</span>
              <span class="detail-value">${departureTime}</span>
            </div>
          </div>
          
          <p><strong>Please remember to:</strong></p>
          <ul>
            <li>Arrive 15 minutes early for check-in</li>
            <li>Bring your e-ticket (digital or printed)</li>
            <li>Bring your Bible, notebook, and water bottle</li>
            <li>Wear comfortable walking shoes</li>
            <li>Keep your phone charged for updates</li>
          </ul>
          
          <p>We're looking forward to seeing you tomorrow! If you have any last-minute questions or concerns, please don't hesitate to contact us.</p>
          
          <p>Blessings,<br><strong>The Zunde Outreach Team</strong></p>
        </div>
        
        <div class="footer">
          <p>Zunde Registration System | support@zunde.org</p>
        </div>
      </div>
    </body>
    </html>
  `
}
