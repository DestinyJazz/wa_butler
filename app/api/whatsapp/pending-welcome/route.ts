// app/api/whatsapp/pending-welcome/route.ts
// This stores users who need welcome messages
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// GET - Fetch users who need welcome messages (your internal system calls this)
export async function GET(req: NextRequest) {
  try {
    // Optional: Add a secret key for security
    const authHeader = req.headers.get('authorization')
    const expectedSecret = process.env.INTERNAL_API_SECRET
    
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get users who registered in the last 10 minutes and haven't been welcomed
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    
    const { data, error } = await supabase
      .from('users')
      .select('user_id, Name, Phone_number, created_at, welcome_sent')
      .gte('created_at', tenMinutesAgo)
      .is('welcome_sent', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ 
      users: data || [],
      count: data?.length || 0
    })

  } catch (error: any) {
    console.error('Error fetching pending welcomes:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Mark user as welcomed (your internal system calls this after sending)
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const expectedSecret = process.env.INTERNAL_API_SECRET
    
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('users')
      .update({ welcome_sent: new Date().toISOString() })
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error marking welcome sent:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
