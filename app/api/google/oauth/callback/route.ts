// app/api/google/oauth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabase } from '../../../../../lib/supabase'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')
    const stateString = req.nextUrl.searchParams.get('state')

    console.log('=== OAuth Callback Debug ===')
    console.log('Code present:', !!code)
    console.log('State string:', stateString)

    if (!code || !stateString) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
    }

    // Decode state (fallback to cookies if needed)
    let userId = ''
    let timezone = 'UTC'
    try {
      const stateData = JSON.parse(Buffer.from(stateString, 'base64').toString())
      userId = stateData.userId
      timezone = stateData.timezone || 'UTC'
      console.log('Decoded state → userId:', userId, '| timezone:', timezone)
    } catch {
      const cookieStore = await cookies()
      userId = cookieStore.get('user_id')?.value || ''
      timezone = cookieStore.get('user_timezone')?.value || 'UTC'
      console.log('Fallback from cookies → userId:', userId, '| timezone:', timezone)
    }

    if (!userId) throw new Error('Could not retrieve user_id from state or cookies')

    // Check if reconnecting
    const cookieStore = await cookies()
    const isReconnecting = cookieStore.get('reconnecting')?.value === 'true'
    console.log('Is reconnecting:', isReconnecting)

    // Exchange authorization code for tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    )

    console.log('Getting tokens from Google...')
    const { tokens } = await oauth2Client.getToken(code)
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid Google token response (missing access or refresh token)')
    }

    console.log('✅ Successfully retrieved tokens')

    // Fetch user’s Google account email
    let googleEmail: string | null = null
    try {
      oauth2Client.setCredentials(tokens)
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
      const { data: userInfo } = await oauth2.userinfo.get()
      googleEmail = userInfo.email || null
      console.log('Google email:', googleEmail)
    } catch (emailErr: any) {
      console.error('⚠️ Could not fetch user email:', emailErr.message)
    }

    const userIdNumber = Number(userId)
    if (isNaN(userIdNumber)) {
      throw new Error(`Invalid user_id (${userId}) — cannot convert to number`)
    }

    // Prepare data for Supabase
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope || '',
      token_type: tokens.token_type || 'Bearer',
      expires_at: tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null,
      timezone,
      email: googleEmail,
    }

    // Upsert (insert or update) record in google_accounts
    const { data: existing } = await supabase
      .from('google_accounts')
      .select('user_id')
      .eq('user_id', userIdNumber)
      .maybeSingle()

    if (existing || isReconnecting) {
      console.log('🔄 Updating existing google_accounts record')
      const { error } = await supabase
        .from('google_accounts')
        .update(tokenData)
        .eq('user_id', userIdNumber)
      if (error) throw new Error(`Supabase update error: ${error.message}`)
      console.log('✅ Updated Google account successfully')
    } else {
      console.log('➕ Inserting new google_accounts record')
      const { error } = await supabase
        .from('google_accounts')
        .insert([{ user_id: userIdNumber, ...tokenData }])
      if (error) throw new Error(`Supabase insert error: ${error.message}`)
      console.log('✅ Inserted new Google account successfully')
    }

    // Update timezone + email in users table
    console.log('🔄 Updating users table...')
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ timezone, email: googleEmail })
      .eq('user_id', userIdNumber)

    if (userUpdateError) {
      console.error('⚠️ Could not update user record:', userUpdateError.message)
    } else {
      console.log('✅ Updated user timezone and email')
    }

    // Redirect back to dashboard
    const redirectUrl = isReconnecting
      ? '/dashboard?reconnected=true'
      : '/dashboard'
    const response = NextResponse.redirect(new URL(redirectUrl, req.url))

    // Set cookies
    response.cookies.set('user_id', userId, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    response.cookies.set('reconnecting', '', {
      path: '/',
      maxAge: 0, // delete flag
    })

    console.log('=== ✅ OAuth Callback Completed Successfully ===')
    return response
  } catch (err: any) {
    console.error('❌ OAuth callback error:', err)
    return NextResponse.json(
      {
        error: err.message || 'Unexpected error during OAuth callback',
        stack: err.stack,
        type: err.constructor?.name || 'Error',
      },
      { status: 500 }
    )
  }
}
