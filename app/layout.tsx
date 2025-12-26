export default function HomePage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1>Reminders from WhatsApp → Google Calendar</h1>
      <p>
        Just send a message. We remember, schedule, and remind you automatically.
      </p>
      <ul>
        <li>✅ WhatsApp reminders/tasks</li>
        <li>✅ Recurring tasks (Mon / Wed / Fri)</li>
        <li>✅ Syncs to your Google Calendar</li>
        <li>✅ No app to install</li>
      </ul>
      
      <div style={{ display: 'flex', gap: '12px', marginTop: 24 }}>
        <a href="/signup" style={{ flex: 1 }}>
          <button style={{ 
            width: '100%',
            padding: '12px 20px', 
            fontSize: 16,
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            Get Started – Free
          </button>
        </a>
        
        <a href="/login" style={{ flex: 1 }}>
          <button style={{ 
            width: '100%',
            padding: '12px 20px', 
            fontSize: 16,
            background: '#fff',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            Login
          </button>
        </a>
      </div>
    </div>
  )
}
