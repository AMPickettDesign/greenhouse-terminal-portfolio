import { useState } from 'react'
import { useSanity } from '../../context/SanityContext'
import RedactedText from '../effects/RedactedText'
import styles from './LoreLog.module.css'

/**
 * LoreLog
 * Renders a single lore log as a collapsed panel the user can expand.
 * Optional — never hides portfolio information, purely atmospheric.
 * Supports per-block reveal via segments arrays in lore data.
 */
export default function LoreLog({ log }) {
  const [open, setOpen] = useState(false)
  const { sanity, equippedTool } = useSanity()

  const eraserEquipped = equippedTool === 'eraser'
  const corrupted = !eraserEquipped && sanity < 40

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
            segments={log.titleSegments}
            redacted={titleText}
            revealed={log.titleRevealed || titleText}
          />
        </span>
        <span className={styles.logDate}>
          <RedactedText
            segments={log.dateSegments}
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
                segments={log.authorSegments}
                redacted={log.author}
                revealed={log.authorRevealed || log.author}
              />
            </span>
            <span>LOG ID: {log.id.toUpperCase()}</span>
          </div>
          <RedactedText
            segments={log.contentSegments}
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
