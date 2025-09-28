import QRCode from "qrcode"

export async function generateQRCode(ticketId: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(ticketId, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
    return qrCodeDataURL
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw new Error("Failed to generate QR code")
  }
}

export function generateTicketId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `ZUN-${timestamp}-${randomStr}`.toUpperCase()
}
