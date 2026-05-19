import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import AppShell from '../components/AppShell'

// Custom icons for markers
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const questIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function Map() {
  const { questId } = useParams()
  const [quest, setQuest] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState(null)
  const [distance, setDistance] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch quest data
    axios.get(`/api/quests/api/${questId}`)
      .then(res => setQuest(res.data.quest))
      .catch(console.error)
  }, [questId])

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationError('Unable to get your location. Using default location.')
          // Fallback to a default location in Cebu
          setUserLocation({ lat: 10.2935, lng: 123.9029 })
        }
      )
    } else {
      setLocationError('Geolocation is not supported by your browser.')
      setUserLocation({ lat: 10.2935, lng: 123.9029 })
    }
  }, [])

  useEffect(() => {
    // Calculate distance when both locations are available
    if (userLocation && quest) {
      const questLat = quest.coordinates?.lat || 10.2935
      const questLng = quest.coordinates?.lng || 123.9029
      const dist = calculateDistance(userLocation.lat, userLocation.lng, questLat, questLng)
      setDistance(dist)
    }
    setLoading(false)
  }, [userLocation, quest])

  // Haversine formula to calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(1)
  }

  if (loading) return <div className="loading-screen">Loading map...</div>
  if (!quest || !userLocation) return <div className="loading-screen">Loading map data...</div>

  const questLat = quest.coordinates?.lat || 10.2935
  const questLng = quest.coordinates?.lng || 123.9029
  const destName = quest.destination?.name || quest.location
  
  // Calculate center point between user and quest
  const centerLat = (userLocation.lat + questLat) / 2
  const centerLng = (userLocation.lng + questLng) / 2

  return (
    <AppShell navActive="map">
      <div className="map-page-title">Location Tracking</div>
      <div className="content" style={{ paddingBottom: 0 }}>
        <div className="proceed-row">
          <button type="button" className="back-btn" onClick={() => navigate('/quests')}>‹</button>
          <span className="proceed-text">Proceed to the pinned location</span>
        </div>

        <div className="map-container">
          <MapContainer center={[centerLat, centerLng]} zoom={15} style={{ width: '100%', height: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div style={{ fontWeight: 600 }}>Your Location</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </div>
              </Popup>
            </Marker>
            <Marker position={[questLat, questLng]} icon={questIcon}>
              <Popup>
                <div style={{ fontWeight: 600 }}>{destName}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Quest Location</div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="route-panel">
          <div className="route-top">
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)' }}>
                {distance} km away
              </div>
              <div className="map-distance">Distance to quest location</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Navigate to complete the quest</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
                <div className="route-dot-start" style={{ backgroundColor: 'var(--accent)' }} />
                <div className="route-dot-line" />
                <div className="route-dot-end" style={{ backgroundColor: 'var(--danger)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="route-address-box">Your current location</div>
                <div className="route-address-box">{destName}</div>
              </div>
            </div>
          </div>
        </div>

        {locationError && (
          <div className="caution-bar">
            <span>ℹ️</span>
            <span>{locationError}</span>
          </div>
        )}

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
