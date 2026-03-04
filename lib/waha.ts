// lib/waha.ts
export async function sendWhatsAppOTP(phone: string, otp: string): Promise<void> {
  const wahaUrl = process.env.WAHA_URL
  const wahaSession = process.env.WAHA_SESSION || 'default'
  const wahaApiKey = process.env.WAHA_API_KEY

  if (!wahaUrl) {
    throw new Error('WAHA_URL environment variable is not set')
  }

  // Format phone number as WhatsApp chat ID (e.g. 60123456789@c.us)
  const chatId = phone.includes('@') ? phone : `${phone}@c.us`

  const message = `Your WhatsApp Butler verification code is: *${otp}*\n\nThis code expires in 5 minutes. Do not share it with anyone.`

  const response = await fetch(`${wahaUrl}/api/sendText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(wahaApiKey ? { 'X-Api-Key': wahaApiKey } : {}),
    },
    body: JSON.stringify({
      session: wahaSession,
      chatId,
      text: message,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`WAHA API error ${response.status}: ${body}`)
  }
}
