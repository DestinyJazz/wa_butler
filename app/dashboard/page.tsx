'use client'

import { useEffect, useState } from 'react'

interface Task {
  id: string
  title: string
  description?: string
  location?: string
  is_active?: boolean
  created_at?: string
  recurrence_rule?: string
  URL?: string
  URL_category?: string
}

interface UserData {
  user_id: number
  Name: string
  Phone_number: string
}

interface GoogleData {
  email?: string
  expires_at?: string
}

function TaskCard({ task, onDelete }: { task: Task; onDelete: (id: string) => Promise<void> }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(task.id)
    } finally {
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <div style={{
      padding: '20px 24px',
      background: task.is_active ? 'rgba(102, 126, 234, 0.04)' : 'rgba(255,255,255,0.02)',
      border: task.is_active ? '1px solid rgba(102, 126, 234, 0.25)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      position: 'relative',
      transition: 'transform 0.15s ease',
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
    onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div style={{
        position: 'absolute', left: 0, top: '16px', bottom: '16px', width: '3px', borderRadius: '3px',
        background: task.is_active
          ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
          : 'rgba(255,255,255,0.1)',
      }} />

      <div style={{ flex: 1, paddingLeft: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: 0 }}>
            {task.title || 'Untitled Task'}
          </h3>
          {task.is_active && (
            <span style={{ padding: '2px 10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '100px', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
              Active
            </span>
          )}
          {task.recurrence_rule && (
            <span style={{ padding: '2px 10px', background: 'rgba(102, 126, 234, 0.15)', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '100px', fontSize: '11px', color: '#8B92F6', fontWeight: '600' }}>
              🔄 Recurring
            </span>
          )}
        </div>

        {task.description && (
          <p style={{ fontSize: '14px', color: '#888', margin: '0 0 10px 0', lineHeight: '1.5' }}>
            {task.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {task.created_at && (
            <span style={{ fontSize: '13px', color: '#666' }}>
              📅 {new Date(task.created_at).toLocaleString('en-MY', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
          )}
          {task.location && (
            <span style={{ fontSize: '13px', color: '#666' }}>📍 {task.location}</span>
          )}
          {task.recurrence_rule && (
            <span style={{ fontSize: '13px', color: '#666' }}>🔁 {task.recurrence_rule}</span>
          )}
          {task.URL && (
            <a href={task.URL} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '13px', color: '#8B92F6', textDecoration: 'none' }}>
              🔗 {task.URL_category || 'Link'}
            </a>
          )}
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        {!confirming ? (
          <button onClick={() => setConfirming(true)} style={{
            padding: '8px 14px', background: 'transparent', color: '#666',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
            fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
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
          }}>
            🗑 Delete
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleDelete} disabled={deleting} style={{
              padding: '8px 14px', background: '#ef4444', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '13px',
              fontWeight: '600', cursor: deleting ? 'not-allowed' : 'pointer',
            }}>
              {deleting ? '...' : 'Confirm'}
            </button>
            <button onClick={() => setConfirming(false)} style={{
              padding: '8px 12px', background: 'transparent', color: '#888',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              fontSize: '13px', cursor: 'pointer',
            }}>
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
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [deleteToast, setDeleteToast] = useState('')
  const [error, setError] = useState('')
  const [reconnected, setReconnected] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('reconnected') === 'true') setReconnected(true)
    const userId = getCookie('user_id')
    if (!userId) { setError('not_logged_in'); setLoading(false); return }
    fetchUserData(userId)
  }, [])

  useEffect(() => {
    const userId = getCookie('user_id')
    if (userId) fetchTasks(page)
  }, [page])

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
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function fetchTasks(p = 1) {
    setTasksLoading(true)
    try {
      const res = await fetch(`/api/tasks?page=${p}`)
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
        setTotalPages(data.totalPages || 1)
        setTotal(data.total || 0)
      }
    } catch (e) { console.error(e) }
    finally { setTasksLoading(false) }
  }

  async function handleDeleteTask(id: string): Promise<void> {
    const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id))
      setTotal((prev) => prev - 1)
      setDeleteToast('Task deleted')
      setTimeout(() => setDeleteToast(''), 3000)
    } else {
      const data = await res.json()
      alert('Failed to delete: ' + (data.error || 'Unknown error'))
    }
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return t.is_active
    if (filter === 'inactive') return !t.is_active
    return true
  })

  const activeCount = tasks.filter((t) => t.is_active).length

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
      Loading…
    </div>
  )

  if (error === 'not_logged_in') return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', padding: '48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', maxWidth: '380px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#fff', marginBottom: '12px' }}>Not logged in</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Please log in to view your dashboard</p>
        <a href="/login">
          <button style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Log In
          </button>
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 24px' }}>
      {deleteToast && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', padding: '14px 20px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', color: '#10b981', fontWeight: '600', fontSize: '14px', zIndex: 9999 }}>
          ✓ {deleteToast}
        </div>
      )}

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {reconnected && (
          <div style={{ padding: '14px 20px', marginBottom: '28px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', color: '#10b981' }}>
            ✅ Successfully reconnected your Google Calendar!
          </div>
        )}

        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '6px', background: 'linear-gradient(135deg, #fff 0%, #8B92F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {userData ? `Hey, ${userData.Name.split(' ')[0]} 👋` : 'Dashboard'}
          </h1>
          <p style={{ color: '#666', fontSize: '15px' }}>
            {userData?.Phone_number} · {total} task{total !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Total Tasks', value: total, icon: '📋' },
            { label: 'Active (this page)', value: activeCount, icon: '✅' },
            { label: 'Google Calendar', value: googleData ? 'Connected' : 'Not connected', icon: googleData ? '🗓️' : '❌' },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {!googleData && (
          <div style={{ padding: '20px 24px', marginBottom: '28px', background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>Google Calendar not connected</p>
              <p style={{ color: '#888', fontSize: '14px' }}>Connect to sync your tasks</p>
            </div>
            <a href="/api/google/oauth">
              <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Connect Now
              </button>
            </a>
          </div>
        )}

        {/* Tasks */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', margin: 0 }}>
              Your Tasks
            </h2>
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px' }}>
              {(['all', 'active', 'inactive'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '6px 16px',
                  background: filter === f ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: filter === f ? '#fff' : '#666',
                  border: 'none', borderRadius: '7px', fontSize: '13px',
                  fontWeight: filter === f ? '600' : '400', cursor: 'pointer',
                  textTransform: 'capitalize', transition: 'all 0.2s',
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {tasksLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#555' }}>Loading tasks…</div>
          ) : filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>No tasks found</p>
              <p style={{ color: '#444', fontSize: '14px' }}>Send a message on WhatsApp to create your first task!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onDelete={handleDeleteTask} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '8px 18px', background: page === 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                  color: page === 1 ? '#444' : '#fff', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', fontSize: '14px', cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Prev
              </button>
              <span style={{ color: '#666', fontSize: '14px' }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: '8px 18px', background: page === totalPages ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                  color: page === totalPages ? '#444' : '#fff', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', fontSize: '14px', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px' }}>
          <a href="/reconnect">
            <button style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
              🔄 Reconnect Google Calendar
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
