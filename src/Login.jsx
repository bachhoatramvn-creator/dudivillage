import { useState } from 'react'
import { supabase } from './lib/supabase'

function Login() {
  const [email, setEmail] = useState('')

  const login = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:5173'
      }
    })

    if (error) {
      alert('Lỗi login')
    } else {
      alert('Check email để đăng nhập ✉️')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Đăng nhập</h2>

      <input
        placeholder="Nhập email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={login}>Đăng nhập</button>
    </div>
  )
}

export default Login