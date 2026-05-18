import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ username: '', displayName: '', email: '', password: '', pronouns: 'he/him' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('/api/register', form)
      onRegister(res.data.user)
      navigate('/quests')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <div className="auth-page">
      <div className="auth-top">
        <div className="auth-brand">
          <div className="love-gradient">LOVE</div>
          <div className="ph-line">THE PHILIPPINES</div>
        </div>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <p className="auth-sub">Join the quest across Cebu</p>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="form-input" value={form.username} onChange={set('username')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input className="form-input" value={form.displayName} onChange={set('displayName')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={set('email')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={form.password} onChange={set('password')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Pronouns</label>
          <select className="form-input" value={form.pronouns} onChange={set('pronouns')}>
            <option>he/him</option>
            <option>she/her</option>
            <option>they/them</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>
        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  )
}
