import { Link } from 'react-router-dom'

export default function BottomNav({ active }) {
  return (
    <nav className="bottom-nav">
      <Link to="/quests" className={`nav-item ${active === 'home' || active === 'quests' ? 'active' : ''}`} aria-label="Home">
        <img src="/images/Nav_Icons/Home.svg" alt="Home" />
      </Link>
      <Link to="/quests" className="nav-item" aria-label="Search">
        <img src="/images/Nav_Icons/Search.svg" alt="Search" />
      </Link>
      <Link to="/quests" className={`nav-item ${active === 'games' ? 'active' : ''}`} aria-label="Games">
        <img src="/images/Nav_Icons/Gamification.svg" alt="Gamification_Tab" />
      </Link> 
      <Link to="/quests" className="nav-item" aria-label="Shop">
        <img src="/images/Nav_Icons/Shop.svg" alt="Shop" />
      </Link>
      <Link to="/quests" className={`nav-item ${active === 'map' ? 'active' : ''}`} aria-label="Map">
        <img src="/images/Nav_Icons/Map.svg" alt="Map" />
      </Link>
      <Link to="/profile" className={`nav-item ${active === 'profile' ? 'active' : ''}`} aria-label="Profile">
        <img src="/images/Nav_Icons/Profile.svg" alt="Profile" />
      </Link>
    </nav>
  )
}
