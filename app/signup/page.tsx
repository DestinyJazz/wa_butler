'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleContinue = async () => {
    if (!name || !phone) return alert('Missing fields')

    const { data, error } = await supabase
      .from('users')
      .insert([{ Name: name, Phone_number: phone }])
      .select()
      .single()

    if (error) return alert(error.message)

    // Redirect to SERVER OAuth endpoint
    window.location.href = `/api/google/oauth?user_id=${data.id}`
  }

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={phone} onChange={e => setPhone(e.target.value)} />
      <button onClick={handleContinue}>Continue</button>
    </div>
  )
}
