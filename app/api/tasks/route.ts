// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('user_id', Number(userId))
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch tasks', details: error }, { status: 500 })
    }

    return NextResponse.json({ 
      tasks: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error: any) {
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

    console.log('Deleting task uuid:', taskId, 'for user_id:', userId)

    // Delete directly — user_id check ensures ownership
    const { error: deleteError, count } = await supabase
      .from('tasks')
      .delete({ count: 'exact' })
      .eq('uuid', taskId)
      .eq('user_id', Number(userId))

    console.log('Delete result — error:', deleteError, 'count:', count)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    if (count === 0) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
