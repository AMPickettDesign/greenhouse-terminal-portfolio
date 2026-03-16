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
          {corrupted ? log.title.replace(/[AEIOU]/g, '█') : log.title}
        </span>
        <span className={styles.logDate}>{log.date}</span>
      </button>

      {open && (
        <div className={styles.logContent}>
          <div className={styles.logMeta}>
            <span>AUTHOR: {log.author}</span>
            <span>LOG ID: {log.id.toUpperCase()}</span>
          </div>
          <p className={styles.logText}>{log.content}</p>
        </div>
      )}
    </div>
  )
}
