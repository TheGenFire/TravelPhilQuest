import { Link } from 'react-router-dom'

const Icon = ({ children }) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" strokeWidth="1.75">
    {children}
  </svg>
)

export default function BottomNav({ active }) {
  return (
    <nav className="bottom-nav">
      <Link to="/quests" className={`nav-item ${active === 'home' || active === 'quests' ? 'active' : ''}`} aria-label="Home">
        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></Icon>
      </Link>
      <Link to="/quests" className="nav-item" aria-label="Search">
        <Icon><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></Icon>
      </Link>
      <Link to="/quests" className={`nav-item ${active === 'games' ? 'active' : ''}`} aria-label="Games">
        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h4m-2-2v4m7-1h.01M18 11h.01M15 16h.01M12 16h.01M9 11h.01M6 11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
      </Link>
      <Link to="/quests" className="nav-item" aria-label="Shop">
        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></Icon>
      </Link>
      <Link to="/quests" className={`nav-item ${active === 'map' ? 'active' : ''}`} aria-label="Map">
        <Icon>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </Icon>
      </Link>
      <Link to="/profile" className={`nav-item ${active === 'profile' ? 'active' : ''}`} aria-label="Profile">
        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></Icon>
      </Link>
    </nav>
  )
}
