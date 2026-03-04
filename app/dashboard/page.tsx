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

function TaskCard({
  task,
  selected,
  onSelect,
  onMarkDone,
}: {
  task: Task
  selected: boolean
  onSelect: (id: string) => void
  onMarkDone: (id: string) => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleMarkDone = async () => {
    setLoading(true)
    try { await onMarkDone(task.id) }
    finally { setLoading(false); setConfirming(false) }
  }

  return (
    <div style={{
      padding: '20px 24px',
      background: selected
        ? 'rgba(102, 126, 234, 0.1)'
        : task.is_active ? 'rgba(102, 126, 234, 0.03)' : 'rgba(255,255,255,0.02)',
      border: selected
        ? '1px solid rgba(102, 126, 234, 0.6)'
        : task.is_active ? '1px solid rgba(102, 126, 234, 0.2)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      position: 'relative',
      transition: 'all 0.15s ease',
      cursor: 'pointer',
    }}
    onClick={() => onSelect(task.id)}
    onMouseOver={(e) => { if (!selected) e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Left accent */}
      <div style={{
        position: 'absolute', left: 0, top: '16px', bottom: '16px', width: '3px', borderRadius: '3px',
        background: selected
          ? '#667eea'
          : task.is_active ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
      }} />

      {/* Checkbox */}
      <div
        onClick={(e) => { e.stopPropagation(); onSelect(task.id) }}
        style={{
          width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
          border: selected ? '2px solid #667eea' : '2px solid rgba(255,255,255,0.2)',
          background: selected ? '#667eea' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s', cursor: 'pointer', marginTop: '2px',
        }}
      >
        {selected && <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>✓</span>}
      </div>

      <div style={{ flex: 1, paddingLeft: '4px' }}>
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
              📅 {new Date(task.created_at).toLocaleString('en-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {task.location && <span style={{ fontSize: '13px', color: '#666' }}>📍 {task.location}</span>}
          {task.recurrence_rule && <span style={{ fontSize: '13px', color: '#666' }}>🔁 {task.recurrence_rule}</span>}
          {task.URL && (
            <a href={task.URL} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '13px', color: '#8B92F6', textDecoration: 'none' }}>
              🔗 {task.URL_category || 'Link'}
            </a>
          )}
        </div>
      </div>

      {/* Mark done button — only show when not in bulk select */}
      {!selected && (
        <div style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          {!confirming ? (
            <button onClick={() => setConfirming(true)} style={{
              padding: '8px 14px', background: 'transparent', color: '#666',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#10b981'
              e.currentTarget.style.color = '#10b981'
              e.currentTarget.style.background = 'rgba(16,185,129,0.08)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = '#666'
              e.currentTarget.style.background = 'transparent'
            }}>
              ✓ Mark Done
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleMarkDone} disabled={loading} style={{
                padding: '8px 14px', background: '#10b981', color: '#fff',
                border: 'none', borderRadius: '8px', fontSize: '13px',
                fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              }}>
                {loading ? '...' : 'Confirm'}
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
      )}
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
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [reconnected, setReconnected] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('reconnected') === 'true') setReconnected(true)
    const userId = getCookie('user_id')
    if (!userId) { setError('not_logged_in'); setLoading(false); return }
    fetchUserData(userId)
  }, [])

  useEffect(() => {
    const userId = getCookie('user_id')
    if (userId) { setSelected(new Set()); fetchTasks(page) }
  }, [page])

  function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }

  async function fetchUserData(userId: string) {
    try {
      const res = await fetch(`/api/user?id=${userId}`)
      if (res.ok) { const d = await res.json(); setUserData(d.user); setGoogleData(d.google) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function fetchTasks(p = 1) {
    setTasksLoading(true)
    try {
      const res = await fetch(`/api/tasks?page=${p}`)
      if (res.ok) {
        const d = await res.json()
        setTasks(d.tasks || [])
        setTotalPages(d.totalPages || 1)
        setTotal(d.total || 0)
      }
    } catch (e) { console.error(e) }
    finally { setTasksLoading(false) }
  }

  async function handleMarkDone(id: string): Promise<void> {
    const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (res.ok) {
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, is_active: false } : t))
      showToast('Task marked as done')
    } else {
      const d = await res.json()
      alert('Failed: ' + (d.error || 'Unknown error'))
    }
  }

  async function handleBulkMarkDone() {
    if (selected.size === 0) return
    setBulkLoading(true)
    try {
      const res = await fetch('/api/tasks/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      })
      if (res.ok) {
        const count = selected.size
        setTasks((prev) => prev.map((t) => selected.has(t.id) ? { ...t, is_active: false } : t))
        setSelected(new Set())
        setShowBulkConfirm(false)
        showToast(`${count} task${count !== 1 ? 's' : ''} marked as done`)
      } else {
        const d = await res.json()
        alert('Failed: ' + (d.error || 'Unknown error'))
      }
    } finally {
      setBulkLoading(false)
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selected.size === filteredTasks.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredTasks.map((t) => t.id)))
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return t.is_active
    if (filter === 'inactive') return !t.is_active
    return true
  })

  const activeCount = tasks.filter((t) => t.is_active).length
  const allSelected = filteredTasks.length > 0 && selected.size === filteredTasks.length

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading…</div>
  )

  if (error === 'not_logged_in') return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', padding: '48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', maxWidth: '380px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#fff', marginBottom: '12px' }}>Not logged in</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Please log in to view your dashboard</p>
        <a href="/login"><button style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Log In</button></a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 24px' }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', padding: '14px 20px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', color: '#10b981', fontWeight: '600', fontSize: '14px', zIndex: 9999 }}>
          ✓ {toast}
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
          <p style={{ color: '#666', fontSize: '15px' }}>{userData?.Phone_number} · {total} task{total !== 1 ? 's' : ''} total</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Total Tasks', value: total, icon: '📋' },
            { label: 'Active Tasks', value: activeCount, icon: '✅' },
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
            <a href="/api/google/oauth"><button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Connect Now</button></a>
          </div>
        )}

        {/* Tasks header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', margin: 0 }}>Your Tasks</h2>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px' }}>
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button key={f} onClick={() => { setFilter(f); setSelected(new Set()) }} style={{
                padding: '6px 16px',
                background: filter === f ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: filter === f ? '#fff' : '#666',
                border: 'none', borderRadius: '7px', fontSize: '13px',
                fontWeight: filter === f ? '600' : '400', cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {f === 'inactive' ? 'Done' : f === 'active' ? 'Active' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk action bar */}
        {filteredTasks.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', marginBottom: '12px',
            background: selected.size > 0 ? 'rgba(102, 126, 234, 0.08)' : 'rgba(255,255,255,0.02)',
            border: selected.size > 0 ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', transition: 'all 0.2s',
          }}>
            {/* Select all checkbox */}
            <div onClick={toggleSelectAll} style={{
              width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
              border: allSelected ? '2px solid #667eea' : '2px solid rgba(255,255,255,0.2)',
              background: allSelected ? '#667eea' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {allSelected && <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>✓</span>}
              {selected.size > 0 && !allSelected && <span style={{ color: '#667eea', fontSize: '14px', fontWeight: '700', lineHeight: 1 }}>−</span>}
            </div>

            <span style={{ fontSize: '13px', color: selected.size > 0 ? '#aaa' : '#555', flex: 1 }}>
              {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
            </span>

            {selected.size > 0 && !showBulkConfirm && (
              <button onClick={() => setShowBulkConfirm(true)} style={{
                padding: '7px 16px', background: 'rgba(16,185,129,0.15)',
                color: '#10b981', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}>
                ✓ Mark {selected.size} Done
              </button>
            )}

            {showBulkConfirm && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#aaa' }}>Mark {selected.size} as done?</span>
                <button onClick={handleBulkMarkDone} disabled={bulkLoading} style={{
                  padding: '7px 16px', background: '#10b981', color: '#fff',
                  border: 'none', borderRadius: '8px', fontSize: '13px',
                  fontWeight: '600', cursor: bulkLoading ? 'not-allowed' : 'pointer',
                }}>
                  {bulkLoading ? '...' : 'Confirm'}
                </button>
                <button onClick={() => setShowBulkConfirm(false)} style={{
                  padding: '7px 12px', background: 'transparent', color: '#666',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                  fontSize: '13px', cursor: 'pointer',
                }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Task list */}
        {tasksLoading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#555' }}>Loading tasks…</div>
        ) : filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>No tasks found</p>
            <p style={{ color: '#444', fontSize: '14px' }}>Send a message on WhatsApp to create your first task!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                selected={selected.has(task.id)}
                onSelect={toggleSelect}
                onMarkDone={handleMarkDone}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{
              padding: '8px 18px', background: page === 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
              color: page === 1 ? '#444' : '#fff', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', fontSize: '14px', cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}>← Prev</button>
            <span style={{ color: '#666', fontSize: '14px' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
              padding: '8px 18px', background: page === totalPages ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
              color: page === totalPages ? '#444' : '#fff', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', fontSize: '14px', cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}>Next →</button>
          </div>
        )}

        <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px' }}>
          <a href="/reconnect"><button style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>🔄 Reconnect Google Calendar</button></a>
        </div>
      </div>
    </div>
  )
}
