import { useState } from 'react'
import { useSanity } from '../../context/SanityContext'
import styles from './HUD.module.css'

/**
 * HUD
 * Main heads-up display showing health, stamina, and sanity bars.
 * Bars become unreliable and distorted as sanity drops.
 * 
 * Props:
 *   interactive — if true, shows controls to manipulate values (demo mode)
 */
export default function HUD({ interactive = false }) {
  const { sanity, setSanity, tier } = useSanity()
  const [health, setHealth] = useState(75)
  const [stamina, setStamina] = useState(60)

  // At low sanity, displayed health value becomes unreliable
  const displayedHealth = sanity < 40
    ? Math.min(100, Math.max(0, health + Math.round((Math.random() - 0.5) * 30)))
    : health

  const displayedStamina = sanity < 30
    ? Math.min(100, Math.max(0, stamina + Math.round((Math.random() - 0.5) * 20)))
    : stamina

  const healthColor = health > 50 ? 'var(--sage)'
                    : health > 25 ? 'var(--amber)'
                    : 'var(--danger-bright)'

  const staminaColor = stamina > 40 ? 'var(--sage)' : 'var(--amber)'

  const sanityColor = sanity > 60 ? 'var(--terminal)'
                    : sanity > 30 ? 'var(--amber)'
                    : 'var(--danger-bright)'

  return (
    <div className={styles.hud} data-tier={tier} role="region" aria-label="Status display">
      <div className={styles.hudHeader}>
        <span className={styles.label}>SUBJECT STATUS</span>
        <span className={styles.tier} style={{ color: sanityColor }}>
          {tier.toUpperCase()}
        </span>
      </div>

      {/* Health */}
      <div className={styles.stat}>
        <div className={styles.statLabel}>
          <span>INTEGRITY</span>
          <span style={{ color: healthColor }}>{displayedHealth}%</span>
        </div>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${displayedHealth}%`, background: healthColor }}
            role="progressbar"
            aria-valuenow={health}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Health"
          />
        </div>
        {sanity < 40 && (
          <span className={styles.unreliable}>⚠ READING UNSTABLE</span>
        )}
      </div>

      {/* Stamina */}
      <div className={styles.stat}>
        <div className={styles.statLabel}>
          <span>STAMINA</span>
          <span style={{ color: staminaColor }}>{displayedStamina}%</span>
        </div>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${displayedStamina}%`, background: staminaColor }}
            role="progressbar"
            aria-valuenow={stamina}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Stamina"
          />
        </div>
      </div>

      {/* Sanity */}
      <div className={styles.stat}>
        <div className={styles.statLabel}>
          <span>COGNITION</span>
          <span style={{ color: sanityColor }}>{Math.round(sanity)}%</span>
        </div>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${sanity}%`, background: sanityColor }}
            role="progressbar"
            aria-valuenow={sanity}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Sanity"
          />
        </div>
      </div>

      {/* Interactive demo controls */}
      {interactive && (
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              Integrity: {health}%
              <input type="range" min={0} max={100} value={health}
                onChange={e => setHealth(Number(e.target.value))} />
            </label>
            <label className={styles.controlLabel}>
              Stamina: {stamina}%
              <input type="range" min={0} max={100} value={stamina}
                onChange={e => setStamina(Number(e.target.value))} />
            </label>
            <label className={styles.controlLabel}>
              Sanity (global): {Math.round(sanity)}%
              <input type="range" min={0} max={100} value={sanity}
                onChange={e => setSanity(Number(e.target.value))} />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
