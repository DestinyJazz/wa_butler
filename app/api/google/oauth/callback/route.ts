import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
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

  return NextResponse.redirect('/dashboard')
}
