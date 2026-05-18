import { useLocation, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'

export default function Complete() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state || {}
  const xpEarned = data.xpEarned || 20
  const level = data.level || 2
  const newXp = data.newXp ?? 422
  const xpInLevel = newXp % 500
  const pct = Math.min((xpInLevel / 500) * 100, 100)

  return (
    <AppShell navActive="games">
      <div className="complete-page">
        <div className="complete-logo" style={{ marginBottom: 12 }}>
          <div className="love-gradient">LOVE</div>
          <div className="ph-sub">THE PHILIPPINES</div>
        </div>

        <div className="complete-inner">
          <div className="confetti-wrap">🎉</div>
          <div className="complete-title">Upload Complete!</div>

          <div className="xp-row-top">
            <span style={{ fontSize: 14, fontWeight: 800 }}>LEVEL {level}</span>
            <span className="xp-gain">Quest Completed! +{xpEarned}XP</span>
          </div>
          <div className="xp-bar-wrap" style={{ marginBottom: 4, width: '100%' }}>
            <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
            <span className="xp-bar-label">{xpInLevel}/500 XP</span>
          </div>

          <div className="reward-heading">Upcoming reward</div>
          <div className="reward-card-inline">
            <span style={{ fontSize: 40 }}>📷</span>
            <div>
              <div className="reward-title">Photo Frame Pack</div>
              <div className="reward-xp">500 XP</div>
              <div className="reward-desc">Receive exclusive Cebu-themed photo borders and stickers.</div>
            </div>
          </div>

          <button type="button" className="btn btn-success btn-full" style={{ fontSize: 16, padding: 16 }} onClick={() => navigate('/profile')}>
            Okay
          </button>
        </div>
      </div>
    </AppShell>
  )
}
