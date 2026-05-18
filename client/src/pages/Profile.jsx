import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AppShell from '../components/AppShell'

const COVER = '/images/Cebu_City_Skyline.jpg'

export default function Profile({ user, onLogout }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '')
  const navigate = useNavigate()

  
  useEffect(() => {
    axios.get('/api/profile/api')
      .then(res => setSubmissions(res.data.submissions || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await axios.post('/api/logout')
    onLogout()
    navigate('/login')
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target?.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveAvatar = async () => {
    if (!avatarFile) return
    const formData = new FormData()
    formData.append('avatar', avatarFile)
    try {
      const res = await axios.post('/api/uploads/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
      if (res.data.success) {
        setIsEditing(false)
        setAvatarFile(null)
        window.location.reload()
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err)
    }
  }

  if (loading) return <div className="loading-screen">Loading profile...</div>

  const xpPct = Math.min(((user?.xp || 0) % 500) / 500 * 100, 100)

  return (
    <AppShell navActive="profile">
      <div className="profile-cover-wrap">
        <img src={COVER} alt="Cover" onError={(e) => { e.target.style.display = 'none' }} />
        <div className="cover-fallback" />
        <div className="profile-cover-curve" />
        <Link to="/quests" className="back-btn white" style={{ position: 'absolute', top: 48, left: 16, zIndex: 5 }}>←</Link>
      </div>

      <div className="content">
        <div className="profile-header-card">
          <div className="profile-top-row">
            <div style={{ position: 'relative' }}>
              <div className="profile-avatar" style={{ position: 'relative', cursor: isEditing ? 'pointer' : 'default' }} onClick={() => isEditing && document.getElementById('avatar-input')?.click()}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  user?.displayName?.charAt(0) || '?'
                )}
              </div>
              {isEditing && (
                <input id="avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div className="bio-bubble">so fulfilled!</div>
              <span className="name-badge">{user?.displayName}</span>
              <span className="tag-badge">he/him</span>
              <Link to="/followers" className="tag-badge">
  5 Followers
</Link>
            </div>
          </div>
          <div className="stats-row">
            <span>LEVEL {user?.level || 1}</span>
            <span>STREAK 🔥{user?.streak || 1}</span>
          </div>
          <div className="xp-bar-wrap">
            <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
            <span className="xp-bar-label">{(user?.xp || 0) % 500}/500 XP</span>
          </div>
          {!isEditing ? (
            <button type="button" className="btn btn-accent" style={{ width: '100%', marginTop: 12 }} onClick={() => setIsEditing(true)}>
              Edit Avatar
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button type="button" className="btn btn-accent" style={{ flex: 1 }} onClick={handleSaveAvatar}>
                Save
              </button>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setIsEditing(false); setAvatarFile(null); setAvatarPreview(user?.avatarUrl || ''); }}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="gallery-section-card">
          <div className="section-title" style={{ marginBottom: 12 }}>My Gallery</div>
          {submissions.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>Complete quests to add photos!</p>
          ) : (
            <div className="gallery-grid">
              {submissions.slice(0, 9).map(s => (
                <div key={s._id} className="gallery-item">
                  <img src={s.imageUrl} alt={s.title} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="gallery-section-card" style={{ marginBottom: 16 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>My Collections</div>
          <div className="gallery-grid">
            {submissions.slice(0, 5).map(s => (
              <div key={s._id} className="gallery-item">
                <img src={s.imageUrl} alt="" />
              </div>
            ))}
            <Link to="/quests" className="fab-add" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-bright)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, textDecoration: 'none', margin: 'auto' }}>+</Link>
          </div>
        </div>

        <button type="button" className="btn btn-outline btn-full" style={{ margin: '0 px 1px' }} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </AppShell>
  )
}
