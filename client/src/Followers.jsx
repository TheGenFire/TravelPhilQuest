import { Link } from 'react-router-dom'
import AppShell from './components/AppShell'

export default function Followers() {

  const followers = [
    { id: 1, name: 'solrvca', avatar: '/images/sol-ruca.png' },
    { id: 2, name: 'lalalalisa_m', avatar: '/images/lisa.png' },
    { id: 3, name: 'mackenyu', avatar: '/images/mackenyu.png' },
    { id: 4, name: 'theajmendez', avatar: '/images/ajlee.png' },
    { id: 5, name: 'haechanahceah', avatar: '/images/haechan.png' },
  ]

  return (
    <AppShell>

      <div className="followers-page">

        <div className="followers-page-header">

          <Link to="/profile" className="back-btn">
            ←
          </Link>

          <h2>Followers</h2>

        </div>

        <div className="followers-page-list">

          {followers.map(follower => (
            <div key={follower.id} className="follower-page-item">

              <img
                src={follower.avatar}
                alt={follower.name}
                className="follower-page-avatar"
              />

              <div className="follower-page-info">
                <span>{follower.name}</span>
              </div>

            </div>
          ))}

        </div>

      </div>

    </AppShell>
  )
}