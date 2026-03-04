// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const cookieUserId = cookieStore.get('user_id')?.value
    const queryUserId = req.nextUrl.searchParams.get('id')

    const userId = cookieUserId || queryUserId

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id, Name, Phone_number, email, timezone')
      .eq('user_id', Number(userId))
      .maybeSingle()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: google } = await supabase
      .from('google_accounts')
      .select('email, expires_at, timezone')
      .eq('user_id', Number(userId))
      .maybeSingle()

    return NextResponse.json({ user, google: google || null })
  } catch (error: any) {
    console.error('GET /api/user error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
