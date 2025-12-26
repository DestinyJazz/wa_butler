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
      return NextResponse.json(
        { error: 'Missing code or state' },
        { status: 400 }
      )
    }

    // Decode the state parameter to get userId and timezone
    let userId: string
    let timezone: string
    
    try {
      const stateData = JSON.parse(Buffer.from(stateString, 'base64').toString())
      userId = stateData.userId
      timezone = stateData.timezone || 'UTC'
      console.log('Decoded state - userId:', userId, 'timezone:', timezone)
    } catch (err) {
      // Fallback: try cookies if state parsing fails
      const cookieStore = await cookies()
      userId = cookieStore.get('user_id')?.value || ''
      timezone = cookieStore.get('user_timezone')?.value || 'UTC'
      console.log('Using fallback from cookies - userId:', userId, 'timezone:', timezone)
    }

    if (!userId) {
      throw new Error('Could not retrieve user_id from state or cookies')
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    )

    console.log('Getting tokens from Google...')
    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid Google token response - missing tokens')
    }

    console.log('✅ Got tokens from Google successfully')
    
    // Fetch user's Google email using the access token
    let googleEmail = null
    try {
      oauth2Client.setCredentials(tokens)
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
      const { data: userInfo } = await oauth2.userinfo.get()
      googleEmail = userInfo.email || null
      console.log('Google email:', googleEmail)
    } catch (emailError: any) {
      console.error('⚠️ Warning: Could not fetch user email:', emailError.message)
      // Continue without email - not critical
    }
    
    const userIdNumber = Number(userId)
    console.log('Converted userId to number:', userIdNumber)
    
    if (isNaN(userIdNumber)) {
      throw new Error(`Invalid user_id: ${userId} cannot be converted to number`)
    }

    const insertData = {
      user_id: userIdNumber,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope || '',
      token_type: tokens.token_type || 'Bearer',
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      timezone: timezone,
      email: googleEmail, // Store the Google email
    }
    
    console.log('Attempting to insert into google_accounts with timezone:', timezone)
    
    const { data, error } = await supabase
      .from('google_accounts')
      .insert([insertData])
      .select()

    if (error) {
      console.error('❌ Supabase insert error:', JSON.stringify(error, null, 2))
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Successfully inserted google account with timezone and email')

    // Also update the user's timezone and email in the users table
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ 
        timezone: timezone,
        email: googleEmail 
      })
      .eq('user_id', userIdNumber)

    if (userUpdateError) {
      console.error('⚠️ Warning: Could not update user data:', userUpdateError)
      // Don't throw - this is not critical
    } else {
      console.log('✅ Updated user timezone and email in users table')
    }

    // Make sure cookie is set before redirect
    const response = NextResponse.redirect(new URL('/dashboard', req.url))
    response.cookies.set('user_id', userId, { 
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    console.log('=== OAuth Callback Success ===')
    return response
    
  } catch (err: any) {
    console.error('❌ OAuth callback error:', err)
    console.error('Error stack:', err.stack)
    return NextResponse.json(
      { 
        error: err.message,
        type: err.constructor.name,
        stack: err.stack
      },
      { status: 500 }
    )
  }
}
