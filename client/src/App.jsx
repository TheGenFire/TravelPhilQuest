import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/Login'
import Register from './pages/Register'
import Quests from './pages/Quests'
import Profile from './pages/Profile'
import Map from './pages/Map'
import SelectMedia from './pages/SelectMedia'
import Upload from './pages/Upload'
import NewUpload from './pages/NewUpload'
import Complete from './pages/Complete'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    axios.get('/api/check-auth')
      .then(async (res) => {
        if (res.data.authenticated) {
          setAuthenticated(true)
          const userRes = await axios.get('/api/profile/api')
          setUser(userRes.data.user)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setAuthenticated(false)
  }

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        {!authenticated ? (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/quests" element={<Quests user={user} />} />
            <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
            <Route path="/quests/:questId/map" element={<Map />} />
            <Route path="/quests/:questId/select-media" element={<SelectMedia />} />
            <Route path="/quests/:questId/upload" element={<Upload />} />
            <Route path="/quests/:questId/new-upload" element={<NewUpload />} />
            <Route path="/quests/:questId/complete" element={<Complete />} />
            <Route path="*" element={<Navigate to="/quests" />} />
          </>
        )}
      </Routes>
    </Router>
  )
}

export default App
