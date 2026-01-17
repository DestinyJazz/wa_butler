// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { sendWhatsAppOTP } from '../../../../lib/waha'

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    console.log('=== Send OTP Request ===')
    console.log('Phone:', phone)

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id, Name, Phone_number')
      .eq('Phone_number', phone)
      .maybeSingle()

    if (userError) {
      console.error('Database error:', userError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ 
        error: 'Phone number not registered. Please sign up first.' 
      }, { status: 404 })
    }

    console.log('User found:', user.Name)

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('Generated OTP:', otp)

    // Store OTP with 5-minute expiry
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // Delete any existing OTPs for this phone
    await supabase
      .from('otp_codes')
      .delete()
      .eq('phone_number', phone)

    // Insert new OTP
    const { error: otpError } = await supabase
      .from('otp_codes')
      .insert({
        phone_number: phone,
        code: otp,
        expires_at: expiresAt.toISOString()
      })

    if (otpError) {
      console.error('Failed to store OTP:', otpError)
      return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 })
    }

    console.log('OTP stored in database')

    // Send OTP via WhatsApp using WAHA
    try {
      await sendWhatsAppOTP(phone, otp)
      console.log('✅ OTP sent via WhatsApp')
    } catch (wahaError: any) {
      console.error('WAHA error:', wahaError)
      // Delete the OTP since we couldn't send it
      await supabase
        .from('otp_codes')
        .delete()
        .eq('phone_number', phone)
      
      return NextResponse.json({ 
        error: 'Failed to send verification code. Please try again.' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Verification code sent to WhatsApp'
    })

  } catch (error: any) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ 
      error: error.message || 'Unexpected error' 
    }, { status: 500 })
  }
}
