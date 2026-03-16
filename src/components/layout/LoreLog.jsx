import { useState } from 'react'
import { useSanity } from '../../context/SanityContext'
import RedactedText from '../effects/RedactedText'
import styles from './LoreLog.module.css'

/**
 * LoreLog
 * Renders a single lore log as a collapsed panel the user can expand.
 * Optional — never hides portfolio information, purely atmospheric.
 * When the pen is equipped, hovering over blacked-out text reveals it.
 */
export default function LoreLog({ log }) {
  const [open, setOpen] = useState(false)
  const { sanity, equippedTool } = useSanity()

  const penEquipped = equippedTool === 'pen'
  const corrupted = !penEquipped && sanity < 40

  const titleText = corrupted
    ? log.title.replace(/[AEIOU]/g, '█')
    : log.title

  return (
    <div className={styles.logWrapper} data-tier={corrupted ? 'corrupted' : 'normal'}>
      <button
        className={styles.logToggle}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className={styles.logIcon} aria-hidden="true">{open ? '▼' : '▶'}</span>
        <span className={styles.logTitle}>
          <RedactedText
            redacted={titleText}
            revealed={log.titleRevealed || titleText}
          />
        </span>
        <span className={styles.logDate}>
          <RedactedText
            redacted={log.date}
            revealed={log.dateRevealed || log.date}
          />
        </span>
      </button>

      {open && (
        <div className={styles.logContent}>
          <div className={styles.logMeta}>
            <span>
              AUTHOR:{' '}
              <RedactedText
                redacted={log.author}
                revealed={log.authorRevealed || log.author}
              />
            </span>
            <span>LOG ID: {log.id.toUpperCase()}</span>
          </div>
          <RedactedText
            redacted={log.content}
            revealed={log.revealed || log.content}
            tag="p"
            className={styles.logText}
          />
        </div>
      )}
    </div>
  )
}
