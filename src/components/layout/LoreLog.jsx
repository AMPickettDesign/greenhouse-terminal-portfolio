import { useState } from 'react'
import { useSanity } from '../../context/SanityContext'
import styles from './LoreLog.module.css'

/**
 * LoreLog
 * Renders a single lore log as a collapsed panel the user can expand.
 * Optional — never hides portfolio information, purely atmospheric.
 */
export default function LoreLog({ log }) {
  const [open, setOpen] = useState(false)
  const { sanity, equippedTool } = useSanity()

  const penEquipped = equippedTool === 'pen'
  const corrupted = !penEquipped && sanity < 40

  return (
    <div className={styles.logWrapper} data-tier={corrupted ? 'corrupted' : 'normal'}>
      <button
        className={styles.logToggle}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className={styles.logIcon} aria-hidden="true">{open ? '▼' : '▶'}</span>
        <span className={styles.logTitle}>
          {corrupted
            ? log.title.replace(/[AEIOU]/g, '█')
            : penEquipped && log.titleRevealed
              ? log.titleRevealed
              : log.title}
        </span>
        <span className={styles.logDate}>
          {penEquipped && log.dateRevealed ? log.dateRevealed : log.date}
        </span>
      </button>

      {open && (
        <div className={styles.logContent}>
          <div className={styles.logMeta}>
            <span>AUTHOR: {penEquipped && log.authorRevealed ? log.authorRevealed : log.author}</span>
            <span>LOG ID: {log.id.toUpperCase()}</span>
          </div>
          <p className={styles.logText}>
            {penEquipped && log.revealed ? log.revealed : log.content}
          </p>
        </div>
      )}
    </div>
  )
}
