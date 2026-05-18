import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('/api/login', { email, password })
      onLogin(res.data.user)
      navigate('/quests')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-top">
        <div className="auth-brand">
          <div className="love-gradient">LOVE</div>
          <div className="ph-line">THE PHILIPPINES</div>
        </div>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome back!</h2>
        <p className="auth-sub">Sign in to continue your adventure</p>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="auth-link">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </div>
      </form>
    </div>
  )
}
