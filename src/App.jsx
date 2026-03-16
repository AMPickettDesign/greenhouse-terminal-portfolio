import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useSanity } from './context/SanityContext'
import FacilityNav from './components/layout/FacilityNav'
import SanityOverlay from './components/effects/SanityOverlay'
import Lobby from './pages/Lobby'
import Personnel from './pages/Personnel'
import ExperimentLogs from './pages/ExperimentLogs'
import SystemsLab from './pages/SystemsLab'
import Equipment from './pages/Equipment'
import Communications from './pages/Communications'
import Toolbelt from './components/game-ui/Toolbelt'

const ROUTE_TITLES = {
  '/':            'Lobby — Greenhollow Research Facility',
  '/personnel':   'Personnel Records — Greenhollow Research Facility',
  '/experiments': 'Experiment Logs — Greenhollow Research Facility',
  '/systems-lab': 'Systems Lab — Greenhollow Research Facility',
  '/equipment':   'Equipment Storage — Greenhollow Research Facility',
  '/comms':       'Communications — Greenhollow Research Facility',
}

export default function App() {
  const { sanity } = useSanity()
  const location = useLocation()

  useEffect(() => {
    document.title = ROUTE_TITLES[location.pathname] || 'Greenhollow Research Facility'
  }, [location.pathname])

  return (
    <>
      <a href="#main-content" className="sr-only" style={{ position: 'absolute', top: '-40px', left: 0, background: 'var(--bg)', color: 'var(--terminal)', padding: '8px 16px', zIndex: 10000, fontSize: '0.8rem', fontFamily: 'var(--font-terminal)' }} onFocus={e => { e.target.style.top = '0' }} onBlur={e => { e.target.style.top = '-40px' }}>
        Skip to main content
      </a>
      <SanityOverlay />
      <FacilityNav />
      <Toolbelt />
      <div className="has-bottom-nav" id="main-content">
        <Routes>
          <Route path="/"            element={<Lobby />} />
          <Route path="/personnel"   element={<Personnel />} />
          <Route path="/experiments" element={<ExperimentLogs />} />
          <Route path="/systems-lab" element={<SystemsLab />} />
          <Route path="/equipment"   element={<Equipment />} />
          <Route path="/comms"       element={<Communications />} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

function NotFound() {
  return (
    <main style={{ padding: '80px 40px', textAlign: 'center', fontFamily: 'var(--font-terminal)' }}>
      <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--ash)', marginBottom: '16px' }}>
        ERROR 404
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', color: 'var(--terminal)', lineHeight: 1 }}>
        SECTOR NOT FOUND
      </h1>
      <p style={{ color: 'var(--text-dim)', marginTop: '24px', fontFamily: 'var(--font-lore)', fontStyle: 'italic' }}>
        This area of the facility has been decommissioned, or perhaps it never existed.
      </p>
      <a href="/" style={{ display: 'inline-block', marginTop: '32px', color: 'var(--sage)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
        ← RETURN TO LOBBY
      </a>
    </main>
  )
}
