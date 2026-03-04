// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json()

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 })
    }

    console.log('=== Verify OTP Request ===')
    console.log('Phone:', phone)

    // Look up OTP record
    const { data: otpRecord, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', phone)
      .eq('code', code)
      .maybeSingle()

    if (otpError) {
      console.error('Database error:', otpError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 })
    }

    // Check expiry
    const now = new Date()
    const expiresAt = new Date(otpRecord.expires_at)
    if (now > expiresAt) {
      // Clean up expired OTP
      await supabase.from('otp_codes').delete().eq('phone_number', phone)
      return NextResponse.json({ error: 'Code has expired. Please request a new one.' }, { status: 401 })
    }

    // OTP is valid — fetch user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id, Name, Phone_number')
      .eq('Phone_number', phone)
      .maybeSingle()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete used OTP
    await supabase.from('otp_codes').delete().eq('phone_number', phone)

    console.log('✅ OTP verified for user:', user.Name)

    // Set session cookie and return success
    const response = NextResponse.json({
      success: true,
      user: {
        user_id: user.user_id,
        name: user.Name,
        phone: user.Phone_number,
      },
    })

    response.cookies.set('user_id', String(user.user_id), {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: error.message || 'Unexpected error' }, { status: 500 })
  }
}
