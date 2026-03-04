'use client'

import { useEffect, useState } from 'react'

interface Task {
  task_id: number | string
  title: string
  description?: string
  start_time?: string
  end_time?: string
  created_at?: string
  is_recurring?: boolean
  recurrence_rule?: string
  google_event_id?: string
}

interface UserData {
  user_id: number
  Name: string
  Phone_number: string
  email?: string
}

interface GoogleData {
  email?: string
  expires_at?: string
}

function formatDateTime(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-MY', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isUpcoming(iso?: string) {
  if (!iso) return false
  return new Date(iso) > new Date()
}

function TaskCard({
  task,
  onDelete,
}: {
  task: Task
  onDelete: (id: number | string) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const upcoming = isUpcoming(task.start_time)

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(task.task_id)
    setDeleting(false)
    setConfirming(false)
  }

  return (
    <div
      style={{
        padding: '20px 24px',
        background: upcoming
          ? 'rgba(102, 126, 234, 0.04)'
          : 'rgba(255,255,255,0.02)',
        border: upcoming
          ? '1px solid rgba(102, 126, 234, 0.25)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
        position: 'relative',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = upcoming
          ? 'rgba(102, 126, 234, 0.5)'
          : 'rgba(255,255,255,0.15)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = upcoming
          ? 'rgba(102, 126, 234, 0.25)'
          : 'rgba(255,255,255,0.08)'
      }}
    >
      {/* Left accent */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '16px',
          bottom: '16px',
          width: '3px',
          borderRadius: '3px',
          background: upcoming
            ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
            : 'rgba(255,255,255,0.1)',
        }}
      />

      <div style={{ flex: 1, paddingLeft: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
              margin: 0,
            }}
          >
            {task.title || 'Untitled Task'}
          </h3>
          {upcoming && (
            <span
              style={{
                padding: '2px 10px',
                background: 'rgba(102, 126, 234, 0.2)',
                border: '1px solid rgba(102, 126, 234, 0.4)',
                borderRadius: '100px',
                fontSize: '11px',
                color: '#8B92F6',
                fontWeight: '600',
              }}
            >
              Upcoming
            </span>
          )}
          {task.is_recurring && (
            <span
              style={{
                padding: '2px 10px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '100px',
                fontSize: '11px',
                color: '#10b981',
                fontWeight: '600',
              }}
            >
              🔄 Recurring
            </span>
          )}
        </div>

        {task.description && (
          <p style={{ fontSize: '14px', color: '#888', margin: '0 0 10px 0', lineHeight: '1.5' }}>
            {task.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {task.start_time && (
            <div style={{ fontSize: '13px', color: '#666' }}>
              <span style={{ color: '#555' }}>📅 </span>
              {formatDateTime(task.start_time)}
              {task.end_time && ` → ${formatDateTime(task.end_time)}`}
            </div>
          )}
          {task.recurrence_rule && (
            <div style={{ fontSize: '13px', color: '#666' }}>
              <span style={{ color: '#555' }}>🔁 </span>
              {task.recurrence_rule}
            </div>
          )}
        </div>
      </div>

      {/* Delete button */}
      <div style={{ flexShrink: 0 }}>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            style={{
              padding: '8px 14px',
              background: 'transparent',
              color: '#666',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#ef4444'
              e.currentTarget.style.color = '#ef4444'
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = '#666'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            🗑 Delete
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                padding: '8px 14px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: deleting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {deleting ? '...' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              style={{
                padding: '8px 12px',
                background: 'transparent',
                color: '#888',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [googleData, setGoogleData] = useState<GoogleData | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [tasksLoading, setTasksLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')
  const [deleteToast, setDeleteToast] = useState('')
  const [reconnected, setReconnected] = useState(false)

  useEffect(() => {
    // Check for ?reconnected=true
    const params = new URLSearchParams(window.location.search)
    if (params.get('reconnected') === 'true') {
      setReconnected(true)
    }

    const userId = getCookie('user_id')
    if (!userId) {
      setError('not_logged_in')
      setLoading(false)
      return
    }

    fetchUserData(userId)
    fetchTasks()
  }, [])

  function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }

  async function fetchUserData(userId: string) {
    try {
      const res = await fetch(`/api/user?id=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setUserData(data.user)
        setGoogleData(data.google)
      }
    } catch (e) {
      console.error('Failed to fetch user', e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch (e) {
      console.error('Failed to fetch tasks', e)
    } finally {
      setTasksLoading(false)
    }
  }

  async function handleDeleteTask(taskId: number | string) {
    const res = await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' })
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.task_id !== taskId))
      setDeleteToast('Task deleted')
      setTimeout(() => setDeleteToast(''), 3000)
    }
  }

  const now = new Date()
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'upcoming') return !t.start_time || new Date(t.start_time) >= now
    if (filter === 'past') return t.start_time && new Date(t.start_time) < now
    return true
  })

  const upcomingCount = tasks.filter((t) => !t.start_time || new Date(t.start_time) >= now).length

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
      }}>
        Loading…
      </div>
    )
  }

  if (error === 'not_logged_in') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          maxWidth: '380px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#fff', marginBottom: '12px' }}>Not logged in</h2>
          <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
            Please log in to view your dashboard
          </p>
          <a href="/login">
            <button style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '100px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              Log In
            </button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 24px' }}>
      {/* Toast */}
      {deleteToast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          padding: '14px 20px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          color: '#10b981',
          fontWeight: '600',
          fontSize: '14px',
          zIndex: 9999,
          backdropFilter: 'blur(10px)',
        }}>
          ✓ {deleteToast}
        </div>
      )}

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Reconnected banner */}
        {reconnected && (
          <div style={{
            padding: '14px 20px',
            marginBottom: '28px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            color: '#10b981',
            fontWeight: '500',
          }}>
            ✅ Successfully reconnected your Google Calendar!
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '6px',
            background: 'linear-gradient(135deg, #fff 0%, #8B92F6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {userData ? `Hey, ${userData.Name.split(' ')[0]} 👋` : 'Dashboard'}
          </h1>
          <p style={{ color: '#666', fontSize: '15px' }}>
            {userData?.Phone_number} · {upcomingCount} upcoming task{upcomingCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}>
          {[
            { label: 'Total Tasks', value: tasks.length, icon: '📋' },
            { label: 'Upcoming', value: upcomingCount, icon: '⏰' },
            {
              label: 'Google Calendar',
              value: googleData ? 'Connected' : 'Not connected',
              icon: googleData ? '✅' : '❌',
            },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '20px 24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Google reconnect nudge */}
        {!googleData && (
          <div style={{
            padding: '20px 24px',
            marginBottom: '28px',
            background: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>Google Calendar not connected</p>
              <p style={{ color: '#888', fontSize: '14px' }}>Connect to sync your tasks to Google Calendar</p>
            </div>
            <a href="/api/google/oauth" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
                Connect Now
              </button>
            </a>
          </div>
        )}

        {/* Tasks section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', margin: 0 }}>
              Your Tasks
            </h2>

            {/* Filter tabs */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: 'rgba(255,255,255,0.05)',
              padding: '4px',
              borderRadius: '10px',
            }}>
              {(['upcoming', 'all', 'past'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 16px',
                    background: filter === f
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: filter === f ? '#fff' : '#666',
                    border: 'none',
                    borderRadius: '7px',
                    fontSize: '13px',
                    fontWeight: filter === f ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {tasksLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#555' }}>
              Loading tasks…
            </div>
          ) : filteredTasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {filter === 'past' ? '📭' : '✨'}
              </div>
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>
                {filter === 'past'
                  ? 'No past tasks'
                  : filter === 'upcoming'
                  ? 'No upcoming tasks yet'
                  : 'No tasks yet'}
              </p>
              <p style={{ color: '#444', fontSize: '14px' }}>
                Send a message on WhatsApp to create your first task!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTasks.map((task) => (
                <TaskCard key={task.task_id} task={task} onDelete={handleDeleteTask} />
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          marginTop: '40px',
          padding: '24px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <a href="/reconnect" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.06)',
              color: '#aaa',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}>
              🔄 Reconnect Google Calendar
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
