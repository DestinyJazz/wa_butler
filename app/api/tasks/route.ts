// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { cookies } from 'next/headers'

// GET /api/tasks — fetch all tasks for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', Number(userId))
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Tasks fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }

    return NextResponse.json({ tasks: data || [] })
  } catch (error: any) {
    console.error('GET /api/tasks error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/tasks?id=<task_id> — delete a task
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

    // Ensure user owns this task before deleting
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('task_id, user_id')
      .eq('task_id', taskId)
      .eq('user_id', Number(userId))
      .maybeSingle()

    if (fetchError || !task) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('task_id', taskId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/tasks error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
