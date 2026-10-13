import { useEffect, useState } from 'react'
import './App.css'

// Connect directly to the deployed Spring Boot backend
const API_URL = 'https://smart-highway-smart-highway.onrender.com/api'

const facilities = [
  {
    icon: '⛽',
    name: 'Fuel Stations',
    description: 'Find fuel stops along your journey',
    type: 'Fuel',
  },
  {
    icon: '⚡',
    name: 'EV Charging',
    description: 'Locate electric vehicle charging points',
    type: 'EV',
  },
  {
    icon: '🏥',
    name: 'Hospitals',
    description: 'Find medical help during your trip',
    type: 'Emergency',
  },
  {
    icon: '🔧',
    name: 'Vehicle Repair',
    description: 'Get help with vehicle breakdowns',
    type: 'Service',
  },
  {
    icon: '🍽️',
    name: 'Restaurants',
    description: 'Discover places to eat on the way',
    type: 'Restaurant',
  },
  {
    icon: '🅿️',
    name: 'Parking',
    description: 'Find convenient parking locations',
    type: 'Parking',
  },
]

function App() {
  const [start, setStart] = useState('')
  const [destination, setDestination] = useState('')
  const [locationMessage, setLocationMessage] = useState('')
  const [coordinates, setCoordinates] = useState(null)
  const [searched, setSearched] = useState(false)
  const [apiFacilities, setApiFacilities] = useState([])
  const [apiStatus, setApiStatus] = useState('connecting')

  useEffect(() => {
    let cancelled = false

    async function loadFacilities() {
      try {
        const response = await fetch(`${API_URL}/facilities`)

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()

        if (!cancelled) {
          setApiFacilities(data)
          setApiStatus('connected')
        }
      } catch (error) {
        if (!cancelled) {
          setApiStatus('error')
        }

        console.error('Backend connection failed:', error)
      }
    }

    loadFacilities()

    return () => {
      cancelled = true
    }
  }, [])

  function getCurrentLocation() {
    setLocationMessage('Requesting your location...')

    if (!navigator.geolocation) {
      setLocationMessage(
        'Your browser does not support location access.'
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setCoordinates({ lat, lng })
        setStart(`${lat}, ${lng}`)
        setLocationMessage(
          'Current location detected successfully!'
        )
        setSearched(false)
      },
      (error) => {
        if (error.code === 1) {
          setLocationMessage(
            'Location permission denied. Allow location access in your browser.'
          )
        } else if (error.code === 2) {
          setLocationMessage(
            'Location unavailable. Check your device location settings.'
          )
        } else {
          setLocationMessage(
            'Location request timed out. Please try again.'
          )
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    )
  }

  function planJourney(event) {
    event.preventDefault()

    if (!start.trim() || !destination.trim()) {
      setLocationMessage(
        'Please enter your starting location and destination.'
      )
      return
    }

    setSearched(true)
    setLocationMessage('')

    document
      .getElementById('maps')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const origin = start.trim()
  const target = destination.trim()

  const routeUrl = searched
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(
        origin
      )}&daddr=${encodeURIComponent(target)}&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(
        'Highways in India'
      )}&output=embed`

  const facilitiesQuery =
    'fuel stations restaurants vehicle repair near ' +
    (target || 'highways in India')

  const facilitiesUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    facilitiesQuery
  )}&output=embed`

  const destinationUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    target || 'Highways in India'
  )}&output=embed`

  const stops = [
    {
      icon: '⛽',
      title: 'Fuel stops',
      description:
        'Find petrol pumps and fuel stations for your journey.',
      query: 'petrol pumps and fuel stations',
    },
    {
      icon: '🍽️',
      title: 'Food and restaurants',
      description:
        'Discover restaurants and places to take a food break.',
      query: 'restaurants and food stops',
    },
    {
      icon: '🔧',
      title: 'Vehicle repair shops',
      description:
        'Find nearby mechanics and repair workshops if needed.',
      query: 'vehicle repair shops and mechanics',
    },
    {
      icon: '🏥',
      title: 'Hospitals',
      description:
        'Find medical assistance along your trip.',
      query: 'hospitals and emergency medical services',
    },
  ]

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">🛣️</span>
          Smart<span>Highway</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#facilities">Facilities</a>
          <a href="#maps">Maps</a>
          <a href="#stops">Travel stops</a>
          <a href="#emergency">Emergency</a>
        </nav>

        <span className="status">
          <i />
          {apiStatus === 'connected'
            ? 'Backend connected'
            : apiStatus === 'error'
              ? 'Backend offline'
              : 'Connecting...'}
        </span>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              YOUR JOURNEY, MADE SMARTER
            </span>

            <h1>
              Every mile.
              <br />A <span>better journey.</span>
            </h1>

            <p>
              Plan your highway trip, discover useful stops
              and travel with greater confidence.
            </p>

            <form
              className="journey-form"
              onSubmit={planJourney}
            >
              <label>
                FROM
                <input
                  value={start}
                  onChange={(event) => {
                    setStart(event.target.value)
                    setCoordinates(null)
                  }}
                  placeholder="Enter starting location"
                  required
                />
              </label>

              <button
                type="button"
                onClick={getCurrentLocation}
              >
                📍 Use my location
              </button>

              <label>
                TO
                <input
                  value={destination}
                  onChange={(event) =>
                    setDestination(event.target.value)
                  }
                  placeholder="Enter destination city or address"
                  required
                />
              </label>

              <button type="submit">
                Plan my journey →
              </button>
            </form>

            {locationMessage && (
              <p role="status" aria-live="polite">
                {locationMessage}
              </p>
            )}

            {coordinates && (
              <small>
                GPS: {coordinates.lat.toFixed(5)},{' '}
                {coordinates.lng.toFixed(5)}
              </small>
            )}

            {searched && (
              <div className="journey-result">
                <strong>Your journey is ready to explore!</strong>
                <p>
                  {start} → {destination}
                </p>
                <a
                  href={`https://www.google.com/maps/dir/${encodeURIComponent(
                    start
                  )}/${encodeURIComponent(destination)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open driving directions in Google Maps ↗
                </a>
              </div>
            )}
          </div>

          <div className="road-art" aria-hidden="true">
            <div className="sun" />
            <div className="mountain mountain-one" />
            <div className="mountain mountain-two" />
            <div className="road">
              <div className="road-line" />
            </div>
            <div className="road-label">
              YOUR NEXT ADVENTURE
            </div>
          </div>
        </section>

        <section className="stats">
          <div>
            <strong>01</strong>
            <span>Plan your route</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Explore facilities</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Travel prepared</span>
          </div>
        </section>

        <section className="maps-section" id="maps">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                SMART NAVIGATION
              </span>
              <h2>
                Explore your <span>journey.</span>
              </h2>
            </div>
            <p>View your route, services and destination.</p>
          </div>

          <div className="maps-grid">
            <article className="map-card">
              <div className="map-card-heading">
                <span className="map-number">01</span>
                <div>
                  <h3>Journey Route</h3>
                  <p>
                    {searched
                      ? `${start} → ${destination}`
                      : 'Plan a journey to see directions'}
                  </p>
                </div>
              </div>

              <iframe
                key={routeUrl}
                title="Google Maps journey route"
                src={routeUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              <a
                className="map-link"
                href={
                  searched
                    ? `https://www.google.com/maps/dir/${encodeURIComponent(
                        start
                      )}/${encodeURIComponent(destination)}`
                    : 'https://maps.google.com'
                }
                target="_blank"
                rel="noreferrer"
              >
                Open route in Google Maps ↗
              </a>
            </article>

            <article className="map-card">
              <div className="map-card-heading">
                <span className="map-number">02</span>
                <div>
                  <h3>Highway Services</h3>
                  <p>Fuel, food and vehicle repair</p>
                </div>
              </div>

              <iframe
                key={facilitiesUrl}
                title="Google Maps highway services"
                src={facilitiesUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              <a
                className="map-link"
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  facilitiesQuery
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Search highway services ↗
              </a>
            </article>

            <article className="map-card">
              <div className="map-card-heading">
                <span className="map-number">03</span>
                <div>
                  <h3>Destination Explorer</h3>
                  <p>{target || 'Explore a destination'}</p>
                </div>
              </div>

              <iframe
                key={destinationUrl}
                title="Google Maps destination"
                src={destinationUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              <a
                className="map-link"
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  target || 'highways in India'
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Explore destination ↗
              </a>
            </article>
          </div>
        </section>

        <section className="stops-section" id="stops">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PLAN AHEAD</span>
              <h2>
                Suggested travel <span>stops.</span>
              </h2>
            </div>
            <p>
              Find useful services before and during your trip.
            </p>
          </div>

          <div className="stops-grid">
            {stops.map((stop) => (
              <article className="stop-card" key={stop.title}>
                <div className="facility-icon">{stop.icon}</div>
                <h3>{stop.title}</h3>
                <p>{stop.description}</p>

                <a
                  className="map-link"
                  href={`https://www.google.com/maps/search/${encodeURIComponent(
                    stop.query +
                      ' near ' +
                      (target || 'my destination')
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Find on Google Maps ↗
                </a>
              </article>
            ))}
          </div>

          <p className="stops-note">
            These links search Google Maps for relevant
            services. They do not automatically select stops
            in driving order or calculate detours.
          </p>
        </section>

        <section className="facilities" id="facilities">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                TRAVEL ESSENTIALS
              </span>
              <h2>
                Everything you need,{' '}
                <span>along the way.</span>
              </h2>
            </div>
            <p>
              Explore useful highway services for a smoother
              journey.
            </p>
          </div>

          {apiStatus === 'error' && (
            <p role="status">
              Backend unavailable. Check your internet
              connection and the deployed API.
            </p>
          )}

          <div className="facility-grid">
            {facilities.map((facility) => {
              const matches = apiFacilities.filter(
                (item) => item.type === facility.type
              )

              return (
                <article
                  className="facility-card"
                  key={facility.type}
                >
                  <div className="facility-icon">
                    {facility.icon}
                  </div>
                  <h3>{facility.name}</h3>
                  <p>{facility.description}</p>

                  {apiStatus === 'connected' && (
                    <small>
                      {matches.length > 0
                        ? `${matches.length} matching service type(s)`
                        : 'No matching service data yet'}
                    </small>
                  )}

                  <a
                    className="explore-button"
                    href={`https://www.google.com/maps/search/${encodeURIComponent(
                      facility.name +
                        ' near ' +
                        (target || 'my destination')
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore service ↗
                  </a>
                </article>
              )
            })}
          </div>
        </section>

        <section className="emergency" id="emergency">
          <div>
            <span className="eyebrow">
              BE READY ON THE ROAD
            </span>
            <h2>Need help during your journey?</h2>
            <p>
              Keep emergency contacts handy and stop somewhere
              safe if your vehicle breaks down.
            </p>
          </div>

          <a href="tel:112">Emergency number: 112 ↗</a>
        </section>
      </main>

      <footer>
        <a className="brand" href="#home">
          🛣️ Smart<span>Highway</span>
        </a>
        <p>Smarter planning. Safer journeys.</p>
        <small>
          Student project · Smart Highway Travel Assistant
        </small>
      </footer>
    </div>
  )
}

export default App