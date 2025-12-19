import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabase } from '../../../../../lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')
    const userId = req.nextUrl.searchParams.get('state') // GET USER ID from state parameter

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'Missing code or user_id' },
        { status: 400 }
      )
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    )

    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid Google token response')
    }
    
    // Insert the Google account data with the userId from the state parameter
    const { error } = await supabase
      .from('google_accounts')
      .insert([
        {
          user_id: Number(userId),
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          scope: tokens.scope,
          token_type: tokens.token_type,
          expires_at: tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : null,
        },
      ])

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }

    return NextResponse.redirect(
      new URL('/dashboard', req.url)
    )
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
