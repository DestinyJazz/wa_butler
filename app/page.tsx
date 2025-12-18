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
      <a href="/signup">
        <button style={{ padding: '12px 20px', fontSize: 16 }}>
          Get Started – Free
        </button>
      </a>
    </div>
  )
}
