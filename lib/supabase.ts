import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: 'app' // set your custom schema here
    }
  }
  
  await supabase.from('google_accounts').insert([{
  user_id,
  access_token: tokenResponse.access_token,
  refresh_token: tokenResponse.refresh_token,
  scope: tokenResponse.scope,
  token_type: tokenResponse.token_type,
  expires_at: new Date(Date.now() + tokenResponse.expires_in * 1000)
}])


)
