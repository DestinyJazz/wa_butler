import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return <p>User not logged in</p>
  }

  const { data: googleAccount, error } = await supabase
    .from('google_accounts')
    .select('id')
    .eq('user_id', Number(userId))
    .maybeSingle()

  if (error) {
    return <p>Error loading dashboard</p>
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2>Dashboard</h2>

      <p>
        Google Calendar:{' '}
        <strong>
          {googleAccount ? 'Connected ✔' : 'Not Connected ❌'}
        </strong>
      </p>

      <p>User ID: {userId}</p>
    </div>
  )
}
