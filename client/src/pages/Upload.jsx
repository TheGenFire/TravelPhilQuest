import { useState, useRef } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell'

export default function Upload() {
  const { questId } = useParams()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'gallery'
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      sessionStorage.setItem(`questPhoto_${questId}`, reader.result)
      sessionStorage.setItem(`questPhotoName_${questId}`, file.name)
    }
    reader.readAsDataURL(file)
  }

  const continueToUpload = () => {
    if (!sessionStorage.getItem(`questPhoto_${questId}`)) {
      alert('Please select a photo first')
      return
    }
    navigate(`/quests/${questId}/new-upload`)
  }

  return (
    <AppShell navActive="games">
      <div className="camera-page-title">
        {mode === 'camera' ? 'Take a Photo' : 'Choose from Gallery'}
      </div>

      <div className="content">
        {mode === 'camera' ? (
          <div style={{ padding: '16px 20px' }}>
            <div
              className="drop-zone"
              onClick={() => cameraInputRef.current?.click()}
              style={{ height: 280 }}
            >
              <span style={{ fontSize: 48 }}>📷</span>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Tap to open camera</span>
            </div>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden-input"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div
            className="drop-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            <span style={{ fontSize: 48 }}>🖼️</span>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Tap to select from gallery</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>JPG, PNG · Max 10MB</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden-input"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {preview && (
          <div style={{ padding: '0 20px 16px' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: 20, maxHeight: 280, objectFit: 'cover' }} />
            <button type="button" className="btn btn-primary btn-full" style={{ marginTop: 12 }} onClick={continueToUpload}>
              Continue →
            </button>
          </div>
        )}

        <div style={{ padding: '0 20px 20px' }}>
          <Link to={`/quests/${questId}/select-media`} className="btn btn-outline btn-full">Back</Link>
        </div>
      </div>
    </AppShell>
  )
}
