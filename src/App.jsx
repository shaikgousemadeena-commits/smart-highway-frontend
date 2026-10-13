
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [start, setStart] = useState('')
  const [destination, setDestination] = useState('')
  const [searched, setSearched] = useState(false) 

  const facilities = [
    { icon: '⛽', name: 'Fuel Stations', description: 'Find fuel stops along your journey', type: 'Fuel' },
    { icon: '⚡', name: 'EV Charging', description: 'Locate electric vehicle charging points', type: 'EV Charging' },
    { icon: '🏥', name: 'Hospitals', description: 'Find medical help during your trip', type: 'Hospital' },
    { icon: '🔧', name: 'Vehicle Repair', description: 'Get help with vehicle breakdowns', type: 'Repair' },
    { icon: '🍽️', name: 'Restaurants', description: 'Discover places to eat on the way', type: 'Restaurant' },
    { icon: '🅿️', name: 'Parking', description: 'Find convenient parking locations', type: 'Parking' },
  ]

  function planJourney(event) {
    event.preventDefault()
    if (start.trim() && destination.trim()) {
      setSearched(true)
    }
  }

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
          <a href="#emergency">Emergency</a>
        </nav>
        <span className="status"><i /> Travel assistant</span>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR JOURNEY, MADE SMARTER</span>
            <h1>Every mile.<br />A <span>better journey.</span></h1>
            <p>Plan your highway trip, discover essential facilities
              and travel with greater confidence.</p>

            <form className="journey-form" onSubmit={planJourney}>
              <label>
                FROM
                <input
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  placeholder="Starting location"
                  required
                />
              </label>
              <label>
                TO
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Your destination"
                  required
                />
              </label>
              <button type="submit">Plan journey →</button>
            </form>

            {searched && (
              <div className="journey-result">
                <strong>Journey created!</strong>
                <p>{start} → {destination}</p>
                <small>Route guidance can be connected in the next step.</small>
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
            <div className="road-label">YOUR NEXT ADVENTURE</div>
          </div>
        </section>

        <section className="stats">
          <div><strong>01</strong><span>Plan your route</span></div>
          <div><strong>02</strong><span>Explore facilities</span></div>
          <div><strong>03</strong><span>Travel prepared</span></div>
        </section>

        <section className="facilities" id="facilities">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TRAVEL ESSENTIALS</span>
              <h2>Everything you need, <span>along the way.</span></h2>
            </div>
            <p>Explore useful highway services for a smoother journey.</p>
          </div>

          <div className="facility-grid">
            {facilities.map((facility) => (
              <article className="facility-card" key={facility.type}>
                <div className="facility-icon">{facility.icon}</div>
                <h3>{facility.name}</h3>
                <p>{facility.description}</p>
                <button
                  className="explore-button"
                  onClick={() => {
                    setStart(start || 'Current location')
                    setDestination(destination || 'Highway destination')
                    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Explore service ↗
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="emergency" id="emergency">
          <div>
            <span className="eyebrow">BE READY ON THE ROAD</span>
            <h2>Need help during your journey?</h2>
            <p>Keep emergency contacts handy and stop somewhere safe
              if your vehicle breaks down.</p>
          </div>
          <a href="tel:112">Emergency number: 112 ↗</a>
        </section>
      </main>

      <footer>
        <a className="brand" href="#home">🛣️ Smart<span>Highway</span></a>
        <p>Smarter planning. Safer journeys.</p>
        <small>Student project · Smart Highway Travel Assistant</small>
      </footer>
    </div>
  )
}

export default App
