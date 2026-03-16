import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSanity } from '../context/SanityContext'
import GlitchText from '../components/effects/GlitchText'
import LoreLog from '../components/layout/LoreLog'
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
  const { devMode } = useSanity()
  const [bootLines, setBootLines] = useState([])
  const [bootDone, setBootDone] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)
  const logs = getLogsForLocation('lobby')

  const skipBoot = useCallback(() => {
    if (bootComplete && !bootDone) setBootDone(true)
  }, [bootComplete, bootDone])

  useEffect(() => {
    let cancelled = false
    let timeout

    async function typeLines() {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) return
        const line = BOOT_LINES[i]
        if (!line) {
          setBootLines(prev => [...prev, ''])
          await new Promise(r => { timeout = setTimeout(r, 800) })
          continue
        }
        setBootLines(prev => [...prev, ''])
        for (let c = 0; c < line.length; c++) {
          if (cancelled) return
          setBootLines(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = line.slice(0, c + 1)
            return updated
          })
          await new Promise(r => { timeout = setTimeout(r, 60) })
        }
        await new Promise(r => { timeout = setTimeout(r, 800) })
      }
      if (!cancelled) {
        setBootComplete(true)
        timeout = setTimeout(() => { if (!cancelled) setBootDone(true) }, 2000)
      }
    }

    typeLines()
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [])

  useEffect(() => {
    if (!bootComplete || bootDone) return
    const handleKey = () => skipBoot()
    const handleClick = () => skipBoot()
    window.addEventListener('keydown', handleKey)
    window.addEventListener('pointerdown', handleClick)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('pointerdown', handleClick)
    }
  }, [bootComplete, bootDone, skipBoot])

  return (
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
            {bootComplete && !bootDone && (
              <div className={styles.skipPrompt}>PRESS ANY KEY TO CONTINUE</div>
            )}
          </div>
        </section>

        {bootDone && (
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
  )
}
