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

    // Check if this is a reconnection
    const cookieStore = await cookies()
    const isReconnecting = cookieStore.get('reconnecting')?.value === 'true'
    console.log('Is reconnecting:', isReconnecting)

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
    }
    
    const userIdNumber = Number(userId)
    console.log('Converted userId to number:', userIdNumber)
    
    if (isNaN(userIdNumber)) {
      throw new Error(`Invalid user_id: ${userId} cannot be converted to number`)
    }

    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope || '',
      token_type: tokens.token_type || 'Bearer',
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      timezone: timezone,
      email: googleEmail,
    }

    // Check if user already has a google account (reconnection scenario)
    const { data: existingAccount } = await supabase
      .from('google_accounts')
      .select('user_id')
      .eq('user_id', userIdNumber)
      .maybeSingle()

    if (existingAccount || isReconnecting) {
      // UPDATE existing google_accounts record
      console.log('🔄 Reconnecting - updating existing record')
      
      const { data, error } = await supabase
        .from('google_accounts')
        .update(tokenData)
        .eq('user_id', userIdNumber)
        .select()

      if (error) {
        console.error('❌ Supabase update error:', JSON.stringify(error, null, 2))
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('✅ Successfully updated google account tokens')
      
    } else {
      // INSERT new record (first time signup)
      console.log('➕ First time signup - inserting new record')
      
      const insertData = {
        user_id: userIdNumber,
        ...tokenData,
      }
      
      const { data, error } = await supabase
        .from('google_accounts')
        .insert([insertData])
        .select()

      if (error) {
        console.error('❌ Supabase insert error:', JSON.stringify(error, null, 2))
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('✅ Successfully inserted google account')
    }

    // Update user's timezone and email in users table
    console.log('🔄 Updating users table with timezone and email')
    
    const { data: updateData, error: userUpdateError } = await supabase
      .from('users')
      .update({ 
        timezone: timezone,
        email: googleEmail 
      })
      .eq('user_id', userIdNumber)
      .select()

    if (userUpdateError) {
      console.error('❌ ERROR: Could not update user data:', userUpdateError)
    } else if (!updateData || updateData.length === 0) {
      console.error('⚠️ WARNING: Update returned no rows - user_id might not exist:', userIdNumber)
    } else {
      console.log('✅ Successfully updated user timezone and email')
    }

    // Prepare response with success message
    const redirectUrl = isReconnecting 
      ? '/dashboard?reconnected=true' 
      : '/dashboard'
    
    const response = NextResponse.redirect(new URL(redirectUrl, req.url))
    
    // Set cookies
    response.cookies.set('user_id', userId, { 
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    // Clear reconnecting flag
    response.cookies.set('reconnecting', '', { 
      path: '/',
      maxAge: 0 // Delete cookie
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
      // After getting tokens
oauth2Client.setCredentials(tokens)
const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
const { data: userInfo } = await oauth2.userinfo.get()
const googleEmail = userInfo.email

console.log('✅ Token belongs to:', googleEmail)

// Store in database
await supabase
  .from('google_accounts')
  .update({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    email: googleEmail, // This must match the actual token owner
    expires_at: new Date(tokens.expiry_date).toISOString()
  })
  .eq('user_id', userId)
    )
  }
}
