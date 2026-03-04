// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    console.log('=== Tasks API ===')
    console.log('user_id from cookie:', userId)

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // First, fetch a sample row to see what user_id looks like in the table
    const { data: sample, error: sampleError } = await supabase
      .from('tasks')
      .select('uuid, user_id, title')
      .limit(3)

    console.log('Sample tasks (first 3 rows):', JSON.stringify(sample))
    console.log('Sample error:', sampleError)

    // Try fetching with number
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', Number(userId))
      .order('created_at', { ascending: false })

    console.log('Tasks found for user_id', Number(userId), ':', data?.length)
    console.log('Query error:', error)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch tasks', details: error }, { status: 500 })
    }

    return NextResponse.json({ tasks: data || [], debug: { userId, sample } })
  } catch (error: any) {
    console.error('GET /api/tasks error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const taskId = req.nextUrl.searchParams.get('id')
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 })
    }

    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('uuid, user_id')
      .eq('uuid', taskId)
      .eq('user_id', Number(userId))
      .maybeSingle()

    if (fetchError || !task) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('uuid', taskId)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
