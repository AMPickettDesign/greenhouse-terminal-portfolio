import { useSanity } from '../../context/SanityContext'
import styles from './AccessibilityPanel.module.css'

export default function AccessibilityPanel() {
  const {
    sanity, setSanity,
    highContrast, setHighContrast,
    reducedMotion, setReducedMotion,
  } = useSanity()

  return (
    <div className={styles.panel} role="region" aria-label="Accessibility settings">
      <div className={styles.header}>
        <span className={styles.title}>INTERFACE CALIBRATION</span>
        <span className={styles.sub}>FACILITY ACCESS — OPTIONAL SETTINGS</span>
      </div>

      <div className={styles.body}>
        {/* Sanity slider */}
        <div className={styles.setting}>
          <div className={styles.settingHeader}>
            <label htmlFor="sanity-slider" className={styles.settingLabel}>
              COGNITIVE DISTORTION LEVEL
            </label>
            <span
              className={styles.settingValue}
              style={{
                color: sanity > 60 ? 'var(--sage)'
                     : sanity > 30 ? 'var(--amber)'
                     : 'var(--danger-bright)',
              }}
            >
              {Math.round(sanity)}%
            </span>
          </div>
          <input
            id="sanity-slider"
            type="range"
            min={0}
            max={100}
            value={sanity}
            onChange={e => setSanity(Number(e.target.value))}
            className={styles.slider}
            aria-label="Sanity level — controls UI distortion intensity"
          />
          <p className={styles.settingDesc}>
            Controls how much the interface deteriorates. At 0%, all UI systems
            are compromised. This affects every screen in the facility.
          </p>
        </div>

        {/* High contrast */}
        <div className={styles.setting}>
          <div className={styles.settingHeader}>
            <label htmlFor="high-contrast" className={styles.settingLabel}>
              HIGH CONTRAST MODE
            </label>
            <button
              id="high-contrast"
              role="switch"
              aria-checked={highContrast}
              className={[styles.toggle, highContrast ? styles.toggleOn : ''].join(' ')}
              onClick={() => setHighContrast(v => !v)}
            >
              <span className={styles.toggleThumb} aria-hidden="true" />
              <span className="sr-only">{highContrast ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>
          <p className={styles.settingDesc}>
            Increases foreground/background contrast ratios to WCAG AA standards.
            The atmosphere is maintained — the readability is improved.
          </p>
        </div>

        {/* Reduced motion */}
        <div className={styles.setting}>
          <div className={styles.settingHeader}>
            <label htmlFor="reduced-motion" className={styles.settingLabel}>
              REDUCE MOTION
            </label>
            <button
              id="reduced-motion"
              role="switch"
              aria-checked={reducedMotion}
              className={[styles.toggle, reducedMotion ? styles.toggleOn : ''].join(' ')}
              onClick={() => setReducedMotion(v => !v)}
            >
              <span className={styles.toggleThumb} aria-hidden="true" />
              <span className="sr-only">{reducedMotion ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>
          <p className={styles.settingDesc}>
            Disables flicker, glitch animations, and sanity-based visual effects.
            Text corruption and distortion are suspended. Content remains fully accessible.
          </p>
        </div>

        <div className={styles.note}>
          <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
          Settings are preserved in this session. The facility respects your requirements.
        </div>
      </div>
    </div>
  )
}
