// app/dashboard/page.tsx
import { cookies } from 'next/headers'
import { supabase } from '../../lib/supabase'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { reconnected?: string }
}) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return (
      <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 24px' }}>
        <h2>Dashboard</h2>
        <p style={{ color: 'red' }}>❌ User not logged in</p>
        <p>Please go back to <a href="/signup">signup</a></p>
      </div>
    )
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', Number(userId))
    .maybeSingle()

  const { data: googleData, error: googleError } = await supabase
    .from('google_accounts')
    .select('*')
    .eq('user_id', Number(userId))
    .maybeSingle()

  if (userError || !userData) {
    return (
      <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 24px' }}>
        <h2>Dashboard</h2>
        <p style={{ color: 'red' }}>Error loading user data</p>
      </div>
    )
  }

  const showReconnectedMessage = searchParams.reconnected === 'true'

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 24px' }}>
      <h2 style={{ marginBottom: '24px' }}>Dashboard</h2>

      {showReconnectedMessage && (
        <div style={{
          padding: '16px',
          marginBottom: '24px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          color: '#10b981',
        }}>
          ✅ Successfully reconnected your Google Calendar!
        </div>
      )}

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
        {googleData && googleData.expires_at && (
          <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
            <strong>Token expires:</strong> {new Date(googleData.expires_at).toLocaleString()}
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

      <div style={{
        marginTop: '32px',
        padding: '20px',
        background: 'rgba(102, 126, 234, 0.05)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        borderRadius: '8px',
      }}>
        <h4 style={{ marginBottom: '12px', color: '#333' }}>Connection Settings</h4>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
          {googleData 
            ? "If you're experiencing connection issues, changed your Google password, or see errors, you can refresh your connection here."
            : "Having trouble connecting? Or need to reconnect after an issue?"}
        </p>
        <a href="/reconnect" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '12px 20px',
              fontSize: 14,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            🔄 Reconnect Google Calendar
          </button>
        </a>
      </div>
    </div>
  )
}
    </div>
  )
}
