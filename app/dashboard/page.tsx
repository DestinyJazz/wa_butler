import { cookies } from 'next/headers'
import { supabase } from '../../lib/supabase'

export default async function DashboardPage() {
  const userId = cookies().get('user_id')?.value

  if (!userId) {
    return (
      <div style={{ maxWidth: 640, margin: '40px auto' }}>
        <h2>Dashboard</h2>
        <p style={{ color: 'red' }}>❌ User not logged in</p>
        <p>Please go back to <a href="/signup">signup</a></p>
      </div>
    )
  }

  // Check if user exists in users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', Number(userId))
    .maybeSingle()

  // Check google_accounts
  const { data: googleData, error: googleError } = await supabase
    .from('google_accounts')
    .select('*')
    .eq('user_id', Number(userId))
    .maybeSingle()

  if (userError || !userData) {
    return (
      <div style={{ maxWidth: 640, margin: '40px auto' }}>
        <h2>Dashboard</h2>
        <p style={{ color: 'red' }}>Error loading user data</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto' }}>
      <h2>Dashboard</h2>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16 }}>User Info</h3>
        <p style={{ margin: '8px 0' }}>
          <strong>Name:</strong> {userData.Name || 'N/A'}
        </p>
        <p style={{ margin: '8px 0' }}>
          <strong>Phone Number:</strong> {userData.Phone_number || 'N/A'}
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Google Calendar Connection</h3>
        <p style={{ margin: '8px 0' }}>
          <strong>Status:</strong>{' '}
          <span style={{ color: googleData ? '#16a34a' : '#dc2626' }}>
            {googleData ? '✅ Connected' : '❌ Not Connected'}
          </span>
        </p>
        {googleData && googleData.email && (
          <p style={{ margin: '8px 0' }}>
            <strong>Email:</strong> {googleData.email}
          </p>
        )}
        {googleError && (
          <p style={{ color: 'red', margin: '8px 0' }}>
            Error: {googleError.message}
          </p>
        )}
      </div>

      {!googleData && !googleError && (
        <div>
          <p style={{ marginBottom: 16 }}>
            Connect your Google Calendar to start receiving reminders
          </p>
          <a href="/api/google/oauth">
            <button
              style={{
                padding: '12px 20px',
                fontSize: 16,
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Connect Google Calendar
            </button>
          </a>
        </div>
      )}
    </div>
  )
}
