import { useParams, Link } from 'react-router-dom'
import AppShell from '../components/AppShell'

export default function SelectMedia() {
  const { questId } = useParams()

  return (
    <AppShell navActive="games">
      <div className="top-bar centered-title">
        <Link to={`/quests/${questId}/map`} className="back-btn">‹</Link>
        <span className="page-title">Select media</span>
      </div>
      <div className="content">
        <div className="media-shell-card">
          <p className="media-select-sub">Select from</p>
          <Link to={`/quests/${questId}/upload?mode=gallery`} className="media-option">
            <span style={{ fontSize: 48 }}>🖼️</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>Gallery</span>
          </Link>
          <Link to={`/quests/${questId}/upload?mode=camera`} className="media-option">
            <span style={{ fontSize: 48 }}>📷</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>Camera</span>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
