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
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
  scope: tokens.scope,
  token_type: tokens.token_type,
  expires_at: new Date(Date.now() + tokens.expires_in * 1000)
}])

)
