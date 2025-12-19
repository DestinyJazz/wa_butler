import { cookies } from 'next/headers'
import { supabase } from '../../lib/supabase'

export default async function DashboardPage() {
  const userId = cookies().get('user_id')?.value

  console.log('🔍 Dashboard Debug:')
  console.log('User ID from cookie:', userId)

  if (!userId) {
    return (
      <div style={{ maxWidth: 640, margin: '40px auto' }}>
        <h2>Dashboard</h2>
        <p style={{ color: 'red' }}>❌ User not logged in (no cookie found)</p>
        <p>Please go back to <a href="/signup">signup</a></p>
      </div>
    )
  }

  // Check if user exists in users table (using user_id column)
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', Number(userId))
    .maybeSingle()

  console.log('User data:', userData)
  console.log('User error:', userError)

  // Check google_accounts
  const { data: googleData, error: googleError } = await supabase
    .from('google_accounts')
    .select('*')
    .eq('user_id', Number(userId))
    .maybeSingle()

  console.log('Google account data:', googleData)
  console.log('Google account error:', googleError)

  return (
    <div style={{ maxWidth: 640, margin: '40px auto' }}>
      <h2>Dashboard</h2>

      <div style={{ marginBottom: 24 }}>
        <h3>User Info</h3>
        <p>User ID from cookie: <strong>{userId}</strong></p>
        {userData ? (
          <p>✅ User found: {userData.Name} ({userData.Phone_number})</p>
        ) : (
          <p>❌ User not found in database</p>
        )}
        {userError && <p style={{ color: 'red' }}>Error: {userError.message}</p>}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3>Google Calendar Connection</h3>
        <p>
          Status:{' '}
          <strong>
            {googleData ? '✅ Connected' : '❌ Not Connected'}
          </strong>
        </p>
        {googleError && (
          <p style={{ color: 'red' }}>Error: {googleError.message}</p>
        )}
        {googleData && (
          <div style={{ fontSize: 14, color: '#666' }}>
            <p>Scope: {googleData.scope}</p>
            <p>Created: {new Date(googleData.created_at).toLocaleString()}</p>
          </div>
        )}
      </div>

      {!googleData && !googleError && (
        <div>
          <p>Need to connect Google Calendar?</p>
          <a href="/api/google/oauth">
            <button style={{ padding: '12px 20px', fontSize: 16 }}>
              Connect Google Calendar
            </button>
          </a>
        </div>
      )}
    </div>
  )
}
