import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AppShell from '../components/AppShell'

const HERO_IMG = '/images/Labangon.png'
const CAPTURE_IMG = '/images/Capture_Image.jpg'
const PLAZA_IMG = '/images/Plaza_Independencia_Cebu.jpg'

function ProgressPill({ pct }) {
  return (
    <div className="progress-pill">
      <div className="progress-pill-fill" style={{ width: `${pct}%` }} />
      <span className={`progress-pill-text${pct < 50 ? ' dark' : ''}`}>{pct}/100</span>
    </div>
  )
}

function QuestCard({ quest, isCompleted, weekly, onClick }) {
  const pct = isCompleted ? 100 : 0
  const isImagePath = quest.badgeIcon && (quest.badgeIcon.startsWith('/') || quest.badgeIcon.startsWith('http'))
  
  return (
    <div className={`quest-card fade-up${isCompleted ? ' completed-stamp' : ''}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className={`quest-badge${weekly ? ' weekly' : ''}`}>
        {isImagePath ? (
          <img src={quest.badgeIcon} alt="badge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          quest.badgeIcon || '🗺️'
        )}
      </div>
      <div className="quest-info">
        <div className={`quest-title${weekly ? '' : ' sans'}`}>{quest.title}</div>
        <div className="quest-location">{quest.location}</div>
        <div className="quest-desc">{quest.description}</div>
        <div className="quest-progress">
          <ProgressPill pct={pct} />
        </div>
      </div>
    </div>
  )
}

export default function Quests({ user }) {
  const [quests, setQuests] = useState({ daily: [], weekly: [] })
  const [completedIds, setCompletedIds] = useState([])
  const [tab, setTab] = useState('quest')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/quests/api/all')
      .then(res => {
        setQuests({ daily: res.data.dailyQuests, weekly: res.data.weeklyQuests })
        setCompletedIds(res.data.completedIds || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-screen">Loading quests...</div>

  return (
    <AppShell navActive="games">
      <div className="hero-wrapper">
        <img className="discover-hero" src={HERO_IMG} alt="Discover Activities" />
        <Link to="/profile" className="back-btn white hero-back">←</Link>
      </div>

      <div className="content">
        <div className="capture-section">
          <h1 className="capture-heading">Discover Activities</h1>
          <div className="capture-label">Capture of the Week!</div>
          <div className="capture-theme">Theme: Windows Through Time</div>
          <div className="capture-card">
            <img src={CAPTURE_IMG} alt="Capture" />
            <div className="capture-user">
              <div className="capture-avatar">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  user?.displayName?.charAt(0) || 'K'
                )}
              </div>
              <span className="capture-username">{user?.displayName || 'Explorer'}</span>
            </div>
          </div>
        </div>

        <div className="tab-bar">
          {['quest', 'rewards', 'explore'].map(t => (
            <button key={t} type="button" className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'quest' && (
          <>
            <div className="section-header" style={{ paddingTop: 0 }}>
              <div className="section-title">Daily Quests</div>
            </div>
            <div style={{ padding: '0 20px' }}>
              {quests.daily.map(q => (
                <QuestCard key={q._id} quest={q} isCompleted={completedIds.includes(q._id)} onClick={() => navigate(`/quests/${q._id}/map`)} />
              ))}
            </div>

            <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800 }}>Weekly Quests</div>
              <button type="button" className="btn-see-more">See more</button>
            </div>
            <p className="section-subtitle location-caps" style={{ padding: '0 20px 12px', margin: 0 }}>Plaza Independencia</p>
            <div className="weekly-hero">
              <img src={PLAZA_IMG} alt="Plaza Independencia" />
            </div>
            <div style={{ padding: '0 20px 24px' }}>
              {quests.weekly.map(q => (
                <QuestCard key={q._id} quest={q} weekly isCompleted={completedIds.includes(q._id)} onClick={() => navigate(`/quests/${q._id}/map`)} />
              ))}
            </div>
          </>
        )}

        {tab === 'rewards' && (
          <div className="rewards-section">

  <h2 className="rewards-title">Current Level</h2>

  <div className="reward-level-card">

    <div className="reward-level-top">
      <span>LEVEL 2</span>
      <span>STREAK 🔥1</span>
    </div>

    <div className="xp-bar-wrap">
      <div className="xp-bar-fill" style={{ width: '84%' }} />
      <span className="xp-bar-label">422/500 XP</span>
    </div>

  </div>

  <div className="earned-rewards">

    <div className="reward-card">
      <img src="/images/welcome.png" alt="" className="reward-icon" />

      <div className="reward-info">
        <h3>Welcome!</h3>
        <span className="reward-xp">100 XP</span>

        <p>
          Unlock your first travel badge.
        </p>

        <button className="share-btn">
          Share
        </button>
      </div>
    </div>

    <div className="reward-card">
      <img src="/images/explorer.png" alt="" className="reward-icon" />

      <div className="reward-info">
        <h3>Explorer Badge</h3>
        <span className="reward-xp">250 XP</span>

        <p>
          Unlock 8 beginner tourist badges.
        </p>

        <button className="share-btn">
          Share
        </button>
      </div>
    </div>

  </div>

  <h3 className="upcoming-title">
    Upcoming Rewards
  </h3>

  <div className="upcoming-list">

    <div className="reward-card locked">
      <img src="/images/photoframe.png" alt="" className="reward-icon" />

      <div className="reward-info">
        <h3>Photo Frame Pack</h3>
        <span className="reward-xp">500 XP</span>

        <p>
          Receive exclusive Cebu-themed photo borders and stickers.
        </p>
      </div>
    </div>

    <div className="reward-card locked">
      <img src="/images/camera effects.png" alt="" className="reward-icon" />

      <div className="reward-info">
        <h3>Camera Effects</h3>
        <span className="reward-xp">750 XP</span>

        <p>
          Gain access to travel-themed photo filters.
        </p>
      </div>
    </div>

  </div>

</div>
        )}

        {tab === 'explore' && (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <div className="section-title">Explore Cebu</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>Discover hidden gems across Cebu City!</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
