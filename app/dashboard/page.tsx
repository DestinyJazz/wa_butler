export default function DashboardPage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2>Dashboard</h2>

      <p>
        Google Calendar: <strong>Connected ✔</strong>
      </p>
      <p>WhatsApp Number: 60xxxxxxxx</p>

      <h3>Your recent reminders</h3>
      <ul>
        <li>🧼 Wash hair – Mon, Wed, Fri – 9:00 AM</li>
        <li>🍻 Drink Beer – Fri & Sun – 8:00 PM</li>
      </ul>

      <button style={{ marginRight: 12 }}>Reconnect Google</button>
      <button style={{ background: 'red', color: 'white' }}>
        Delete account
      </button>
    </div>
  )
}
