import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value
  const timezone = cookieStore.get('user_timezone')?.value

  console.log('=== OAuth Initiation Debug ===')
  console.log('User ID from cookie:', userId)
  console.log('Timezone from cookie:', timezone)

  if (!userId) {
    console.error('No user_id found in cookie')
    return NextResponse.json(
      { error: 'Missing user_id - please sign up first' }, 
      { status: 400 }
    )
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  )

  // Encode both userId and timezone in the state parameter
  const stateData = {
    userId,
    timezone: timezone || 'UTC'
  }
  const stateString = Buffer.from(JSON.stringify(stateData)).toString('base64')

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent',
    state: stateString, // Pass encoded data as state
  })

  console.log('Generated auth URL with state containing userId and timezone')
  console.log('Redirecting to Google OAuth...')

  return NextResponse.redirect(authUrl)
}
