import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AppShell from '../components/AppShell'

export default function NewUpload() {
  const { questId } = useParams()
  const [quest, setQuest] = useState(null)
  const [description, setDescription] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const photo = sessionStorage.getItem(`questPhoto_${questId}`)
    if (!photo) {
      navigate(`/quests/${questId}/select-media`)
      return
    }
    setPreview(photo)
    axios.get(`/api/quests/api/${questId}`).then(res => setQuest(res.data.quest)).catch(console.error)
  }, [questId, navigate])

  const handleSubmit = async () => {
    const photoData = sessionStorage.getItem(`questPhoto_${questId}`)
    if (!photoData) return

    setLoading(true)
    try {
      const res = await fetch(photoData)
      const blob = await res.blob()
      const file = new File([blob], sessionStorage.getItem(`questPhotoName_${questId}`) || 'photo.jpg', { type: blob.type })
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('description', description)
      formData.append('title', quest ? `${quest.title} #CebuCity` : 'Quest Photo')

      const uploadRes = await axios.post(`/api/uploads/${questId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      sessionStorage.removeItem(`questPhoto_${questId}`)
      sessionStorage.removeItem(`questPhotoName_${questId}`)
      navigate(`/quests/${questId}/complete`, { state: uploadRes.data })
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell navActive="games">
      <div className="page-header-title">New Upload</div>
      <div className="content">
        <div className="upload-panel">
          <div className="upload-inner-header">
            <Link to={`/quests/${questId}/select-media`} className="back-btn" style={{ background: '#fff' }}>‹</Link>
            <span className="upload-inner-title">Add to Collection</span>
            <button type="button" className="action-btn" onClick={handleSubmit} disabled={loading}>↑</button>
          </div>
          <div className="upload-row">
            <img src={preview} alt="" className="upload-thumb" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="upload-meta-title">Title</div>
              <div className="upload-meta-value">
                {quest ? `${quest.title} #${quest.location?.replace(/\s/g, '')} #CebuCity` : 'Quest photo'}
              </div>
              <div className="upload-meta-title">Pin Location</div>
              <div className="map-mini" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📍</div>
            </div>
          </div>
        </div>
        <div className="desc-wrap">
          <div className="upload-meta-title" style={{ marginBottom: 8 }}>Description</div>
          <textarea className="form-textarea" placeholder="Enter text..." rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {loading && <p style={{ textAlign: 'center', padding: 12, color: 'var(--primary)' }}>Uploading...</p>}
      </div>
    </AppShell>
  )
}
