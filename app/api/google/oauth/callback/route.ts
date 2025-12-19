import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabase } from '../../../../../lib/supabase'
import { cookies } from 'next/headers'

const cookieStore = cookies()
cookieStore.set('id', String(id), {
  httpOnly: true,
  path: '/',
})


export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')
    const userIdParam = req.nextUrl.searchParams.get('id')

    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 })
    }

    if (!userIdParam) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const user_id = Number(userIdParam)

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    )

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid token response from Google')
    }

    // Save tokens to Supabase
    const { error } = await supabase
      .from('google_accounts')
      .insert([
        {
          user_id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          scope: tokens.scope,
          token_type: tokens.token_type,
          expires_at: tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : null
        }
      ])

    if (error) {
      throw error
    }

    // Redirect to dashboard
    return NextResponse.redirect(
      new URL('/dashboard', req.url)
    )
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    return NextResponse.json(
      { error: err.message ?? 'OAuth failed' },
      { status: 500 }
    )
  }
  cookieStore.set('id', String(id), {
    httpOnly: true,
    path: '/',
  })

  return NextResponse.redirect(
    new URL('/dashboard', req.url)
  )

}


