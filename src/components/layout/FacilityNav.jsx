import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSanity } from '../../context/SanityContext'
import GlitchText from '../effects/GlitchText'
import styles from './FacilityNav.module.css'

const rooms = [
  { path: '/',            label: 'LOBBY',          code: 'SEC-00', status: 'OPEN' },
  { path: '/personnel',   label: 'PERSONNEL',      code: 'SEC-01', status: 'OPEN' },
  { path: '/experiments', label: 'EXPERIMENT LOGS',code: 'SEC-02', status: 'OPEN' },
  { path: '/systems-lab', label: 'SYSTEMS LAB',    code: 'SEC-03', status: 'OPEN' },
  { path: '/equipment',   label: 'EQUIPMENT',      code: 'SEC-04', status: 'OPEN' },
  { path: '/comms',       label: 'COMMUNICATIONS', code: 'SEC-05', status: 'DEGRADED' },
]

const mobileTabItems = [
  { path: '/',            icon: '⌂', label: 'LOBBY' },
  { path: '/personnel',   icon: '☰', label: 'PERSONNEL' },
  { path: '/experiments', icon: '⚗', label: 'EXPERIMENTS' },
  { path: '/systems-lab', icon: '⬡', label: 'SYSTEMS' },
  { path: '/equipment',   icon: '◈', label: 'EQUIPMENT' },
  { path: '/comms',       icon: '✉', label: 'COMMS' },
]

export default function FacilityNav() {
  const { sanity, devMode, setDevMode, isMobile } = useSanity()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const currentSector = rooms.find(r => r.path === location.pathname)?.code ?? 'UNK'

  return (
    <>
      <nav className={styles.nav} role="navigation" aria-label="Facility navigation">
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.facilityId}>
            <span className={styles.dot} aria-hidden="true" />
            <GlitchText text="GREENHOLLOW RESEARCH FACILITY" tag="span" className={styles.facilityName} />
            {isMobile && (
              <span className={styles.sectorCode}>{currentSector}</span>
            )}
          </div>

          {!isMobile && (
            <div className={styles.statusRow}>
              <span className={styles.statusItem}>
                SAN: <span style={{ color: sanity > 60 ? 'var(--sage)' : sanity > 30 ? 'var(--amber)' : 'var(--danger-bright)' }}>
                  {Math.round(sanity)}%
                </span>
              </span>
              <span className={styles.statusItem}>
                SECTOR: {currentSector}
              </span>
              <button
                className={styles.devBtn}
                onClick={() => setDevMode(v => !v)}
                aria-pressed={devMode}
                title="Toggle Developer Mode — reveals UX documentation"
              >
                {devMode ? '[ DEV ON ]' : '[ DEV ]'}
              </button>
            </div>
          )}
        </div>

        {/* Room links — desktop only */}
        {!isMobile && (
          <ul className={styles.roomList} role="list">
            {rooms.map(room => (
              <li key={room.path}>
                <NavLink
                  to={room.path}
                  end={room.path === '/'}
                  className={({ isActive }) =>
                    [styles.roomLink, isActive ? styles.active : ''].join(' ')
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.roomCode} aria-hidden="true">{room.code}</span>
                  <span className={styles.roomLabel}>{room.label}</span>
                  {room.status !== 'OPEN' && (
                    <span className={styles.roomStatus} aria-label={`Status: ${room.status}`}>
                      ⚠ {room.status}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Mobile bottom tab bar */}
      {isMobile && (
        <nav className={styles.bottomTabBar} role="navigation" aria-label="Mobile facility navigation">
          {mobileTabItems.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) =>
                [styles.tab, isActive ? styles.tabActive : ''].join(' ')
              }
            >
              <span className={styles.tabIcon} aria-hidden="true">{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </>
  )
}
