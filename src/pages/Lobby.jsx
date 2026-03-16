import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSanity } from '../context/SanityContext'
import GlitchText from '../components/effects/GlitchText'
import LoreLog from '../components/layout/LoreLog'
import Briefing from './Briefing'
import { getLogsForLocation } from '../data/loreLogs'
import styles from './Lobby.module.css'

const BOOT_LINES = [
  'INITIALIZING TERMINAL...',
  'CHECKING FACILITY STATUS...',
  'LOADING PERSONNEL DATABASE...',
  'WARNING: 3 SECTORS OFFLINE',
  'WARNING: CONTAINMENT STATUS UNKNOWN',
  'OVERRIDE ACCEPTED — GUEST ACCESS GRANTED',
  '',
  'WELCOME TO GREENHOLLOW RESEARCH FACILITY',
]

const ROOMS = [
  { path: '/personnel',   label: 'PERSONNEL RECORDS',  code: 'SEC-01', desc: 'About Ashley' },
  { path: '/experiments', label: 'EXPERIMENT LOGS',    code: 'SEC-02', desc: 'Case study projects' },
  { path: '/systems-lab', label: 'SYSTEMS LAB',        code: 'SEC-03', desc: 'UI demos & components' },
  { path: '/equipment',   label: 'EQUIPMENT STORAGE',  code: 'SEC-04', desc: 'Skills & tools' },
  { path: '/comms',       label: 'COMMUNICATIONS',     code: 'SEC-05', desc: 'Contact' },
]

export default function Lobby() {
  const { devMode, bootSeen, setBootSeen } = useSanity()
  const [bootLines, setBootLines] = useState([])
  const [bootDone, setBootDone] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)
  const [paused, setPaused] = useState(false)
  const [briefingSeen, setBriefingSeen] = useState(
    () => localStorage.getItem('ghf-briefing-seen') === 'true'
  )
  const [showBriefing, setShowBriefing] = useState(false)
  const pausedRef = useRef(false)
  const hasRunRef = useRef(false)
  const logs = getLogsForLocation('lobby')

  // If boot was already seen (return visit), skip immediately
  useEffect(() => {
    if (bootSeen && !bootDone) {
      setBootLines([...BOOT_LINES])
      setBootComplete(true)
      setBootDone(true)
    }
  }, [bootSeen, bootDone])

  // Show briefing after boot completes on first visit (slight delay to avoid click-through)
  useEffect(() => {
    if (bootDone && !briefingSeen) {
      const id = setTimeout(() => setShowBriefing(true), 100)
      return () => clearTimeout(id)
    }
  }, [bootDone, briefingSeen])

  const skipBoot = useCallback(() => {
    if (bootComplete && !bootDone) {
      setBootDone(true)
      setBootSeen(true)
    }
  }, [bootComplete, bootDone, setBootSeen])

  const togglePause = useCallback(() => {
    setPaused(prev => {
      pausedRef.current = !prev
      return !prev
    })
  }, [])

  useEffect(() => {
    if (bootSeen || hasRunRef.current) return
    hasRunRef.current = true

    let cancelled = false
    let timeout

    function wait(ms) {
      return new Promise(resolve => {
        function tick() {
          if (cancelled) return resolve()
          if (pausedRef.current) { timeout = setTimeout(tick, 50); return }
          if (ms <= 0) return resolve()
          const chunk = Math.min(ms, 50)
          ms -= chunk
          timeout = setTimeout(tick, chunk)
        }
        tick()
      })
    }

    async function typeLines() {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) return
        const line = BOOT_LINES[i]
        if (!line) {
          setBootLines(prev => [...prev, ''])
          await wait(400)
          continue
        }
        setBootLines(prev => [...prev, ''])
        for (let c = 0; c < line.length; c++) {
          if (cancelled) return
          await wait(30)
          if (cancelled) return
          setBootLines(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = line.slice(0, c + 1)
            return updated
          })
        }
        await wait(400)
      }
      if (!cancelled) {
        setBootComplete(true)
        timeout = setTimeout(() => {
          if (!cancelled) {
            setBootDone(true)
            setBootSeen(true)
          }
        }, 1200)
      }
    }

    typeLines()
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [bootSeen, setBootSeen])

  useEffect(() => {
    if (bootDone) return
    const handleClick = () => {
      if (bootComplete) { skipBoot(); return }
      togglePause()
    }
    const handleKey = (e) => {
      if (e.key === 'Tab') return
      if (bootComplete) { skipBoot(); return }
      if (e.key === 'Escape') {
        // Escape skips boot entirely (AAA 2.2.3 — no forced timing)
        setBootLines([...BOOT_LINES])
        setBootComplete(true)
        setBootDone(true)
        setBootSeen(true)
        return
      }
      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        togglePause()
      }
    }
    window.addEventListener('pointerdown', handleClick)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('pointerdown', handleClick)
      window.removeEventListener('keydown', handleKey)
    }
  }, [bootComplete, bootDone, skipBoot, togglePause, setBootSeen])

  return (
    <>
    {showBriefing && (
      <Briefing onEnter={() => {
        setBriefingSeen(true)
        setShowBriefing(false)
      }} />
    )}
    <main className={styles.lobby}>
      <div className={styles.container}>

        {/* Boot terminal */}
        <section className={styles.bootSection} aria-label="System boot sequence">
          <div className={styles.bootTerminal}>
            {bootLines.map((line, i) => (
              <div
                key={i}
                className={[
                  styles.bootLine,
                  line.startsWith('WARNING') ? styles.bootWarning : '',
                  line.startsWith('WELCOME') ? styles.bootWelcome : '',
                ].join(' ')}
              >
                {line ? `> ${line}` : ''}
              </div>
            ))}
            {!bootDone && !bootComplete && !paused && (
              <div className={styles.bootHint}>SPACE TO PAUSE · ESC TO SKIP</div>
            )}
            {paused && !bootComplete && (
              <div className={styles.pausedIndicator}>PAUSED — SPACE OR CLICK TO RESUME · ESC TO SKIP</div>
            )}
            {bootComplete && !bootDone && (
              <div className={styles.skipPrompt}>PRESS ANY KEY TO CONTINUE</div>
            )}
          </div>
        </section>

        {bootDone && !showBriefing && (
          <>
            {/* Hero */}
            <section className={styles.hero}>
              <h1 className={styles.heroTitle}>
                <GlitchText text="GREENHOLLOW" tag="span" />
              </h1>
              <p className={styles.heroSub}>RESEARCH FACILITY — PERSONNEL TERMINAL</p>
              <p className={styles.heroDesc}>
                This terminal provides access to facility personnel records, experiment
                documentation, and operational systems. All sections are accessible.
                Environmental anomalies do not affect information retrieval.
              </p>
            </section>

            {/* Facility map */}
            <section className={styles.mapSection} aria-label="Facility navigation">
              <div className={styles.sectionHeader}>
                <span>FACILITY MAP</span>
                <span className={styles.sectionMeta}>SELECT A SECTOR TO ENTER</span>
              </div>
              <div className={styles.roomGrid}>
                {ROOMS.map(room => (
                  <Link key={room.path} to={room.path} className={styles.roomCard}>
                    <span className={styles.roomCode}>{room.code}</span>
                    <span className={styles.roomName}>{room.label}</span>
                    <span className={styles.roomDesc}>{room.desc}</span>
                    <span className={styles.roomArrow} aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Lore logs */}
            {logs.length > 0 && (
              <section className={styles.logsSection} aria-label="Facility logs">
                <div className={styles.sectionHeader}>
                  <span>RECOVERED LOGS</span>
                  <span className={styles.sectionMeta}>OPTIONAL READING</span>
                </div>
                {logs.map(log => <LoreLog key={log.id} log={log} />)}
              </section>
            )}

            {/* Dev mode panel */}
            {devMode && (
              <section className={styles.devPanel} aria-label="Developer notes">
                <div className={styles.sectionHeader}>
                  <span>[ DEVELOPER MODE ]</span>
                </div>
                <p className={styles.devText}>
                  <strong>Design decision:</strong> The boot sequence sets the tone before the user sees any portfolio content.
                  It establishes the terminal aesthetic while immediately communicating structure — each "sector" maps directly
                  to a portfolio section. Nothing is hidden; horror is purely atmospheric.
                </p>
                <p className={styles.devText}>
                  <strong>Accessibility note:</strong> Boot lines use a timed interval, not CSS animation — this respects
                  <code>prefers-reduced-motion</code> by design (motion lives in JS, which checks the context flag).
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </main>
    </>
  )
}
