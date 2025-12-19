export default function DashboardPage() {
  return (
   
  const { data } = await supabase
  .from('google_accounts')
  .select('id')
  .eq('user_id', userId)
  .single()

  )
}
