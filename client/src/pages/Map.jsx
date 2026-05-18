import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AppShell from '../components/AppShell'

export default function Map() {
  const { questId } = useParams()
  const [quest, setQuest] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/api/quests/api/${questId}`)
      .then(res => setQuest(res.data.quest))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [questId])

  if (loading) return <div className="loading-screen">Loading...</div>
  if (!quest) return <div className="loading-screen">Quest not found</div>

  const lat = quest.coordinates?.lat || 10.2935
  const lng = quest.coordinates?.lng || 123.9029
  const destName = quest.destination?.name || quest.location

  return (
    <AppShell navActive="map">
      <div className="map-page-title">Location Tracking</div>
      <div className="content" style={{ paddingBottom: 0 }}>
        <div className="proceed-row">
          <button type="button" className="back-btn" onClick={() => navigate('/quests')}>‹</button>
          <span className="proceed-text">Proceed to the pinned location</span>
          <Link to={`/quests/${questId}/select-media`} className="action-btn">↑</Link>
        </div>

        <div className="map-container">
          <iframe
            className="map-embed"
            title="Map"
            loading="lazy"
            src={`https://www.google.com/maps?q=${lat},${lng}&output=embed`}
          />
        </div>

        <div className="route-panel">
          <div className="route-top">
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)' }}>
                18 min <span style={{ fontWeight: 400, fontSize: 13 }}>(1.3 km)</span>
              </div>
              <div className="map-distance">via Colon St and Legaspi St</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mostly flat</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
                <div className="route-dot-start" />
                <div className="route-dot-line" />
                <div className="route-dot-end" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="route-address-box">USJ-R Quadricentennial Campus, 22 A. Bonifacio St...</div>
                <div className="route-address-box">{destName}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="caution-bar">
          <span>⚠️</span>
          <span>Use caution—walking directions may not always reflect real-world conditions.</span>
        </div>

        <div style={{ padding: '12px 20px 20px' }}>
          <Link to={`/quests/${questId}/select-media`} className="btn btn-primary btn-full">
            I'm at the location — Continue
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
