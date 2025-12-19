import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'
import { google } from 'googleapis'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  )

  const { tokens } = await oauth2Client.getToken(code)

  // Store for demo; replace with real user_id from localStorage/session
  const demoUserId = '<demo-user-id>'
  await supabase.from('users').update({ google_token: JSON.stringify(tokens) }).eq('id', demoUserId)

  return NextResponse.redirect(
  'https://wa-butler.vercel.app/dashboard'
)
  
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    grant_type: 'authorization_code'
  })
})

const tokenResponse = await tokenRes.json()
  if (!tokenResponse.access_token) {
    throw new Error('Failed to retrieve access token')
  }

const user_id = Number(searchParams.get('user_id')) // or however you pass it

await supabase.from('google_accounts').insert([{
  user_id,
  access_token: tokenResponse.access_token,
  refresh_token: tokenResponse.refresh_token,
  scope: tokenResponse.scope,
  token_type: tokenResponse.token_type,
  expires_at: new Date(Date.now() + tokenResponse.expires_in * 1000)
}])

return NextResponse.redirect(
  new URL('/dashboard', req.url)
)
}

