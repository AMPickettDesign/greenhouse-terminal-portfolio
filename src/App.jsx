import { Routes, Route } from 'react-router-dom'
import { useSanity } from './context/SanityContext'
import FacilityNav from './components/layout/FacilityNav'
import SanityOverlay from './components/effects/SanityOverlay'
import Lobby from './pages/Lobby'
import Personnel from './pages/Personnel'
import ExperimentLogs from './pages/ExperimentLogs'
import SystemsLab from './pages/SystemsLab'
import Equipment from './pages/Equipment'
import Communications from './pages/Communications'

export default function App() {
  const { sanity } = useSanity()

  return (
    <>
      <SanityOverlay />
      <FacilityNav />
      <div className="has-bottom-nav">
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
