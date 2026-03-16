import { useSanity } from '../../context/SanityContext'
import styles from './RedactedText.module.css'

/**
 * RedactedText
 * Takes a redacted string (containing █ blocks) and a clean revealed string.
 * When the eraser is equipped, swaps the entire text to the revealed version.
 *
 * Props:
 *   redacted  — the text with █ characters
 *   revealed  — the full clean text (replaces redacted entirely when eraser is on)
 *   tag       — wrapper element (default: 'span')
 *   className — passed through to wrapper
 */
export default function RedactedText({ redacted, revealed, tag: Tag = 'span', className = '' }) {
  const { equippedTool } = useSanity()
  const eraserEquipped = equippedTool === 'eraser'
  const hasRedactions = redacted.includes('█')

  // No redacted blocks — render as-is
  if (!hasRedactions) {
    return <Tag className={className}>{redacted}</Tag>
  }

  // Eraser equipped and we have a revealed version — show the clean text
  if (eraserEquipped && revealed) {
    return (
      <Tag className={className}>
        <span className={styles.revealedText}>{revealed}</span>
      </Tag>
    )
  }

  // Eraser not equipped — render with styled █ blocks
  const segments = redacted.match(/█+|[^█]+/g) || [redacted]
  return (
    <Tag className={className}>
      {segments.map((segment, i) =>
        /^█+$/.test(segment)
          ? <span key={i} className={styles.blockedText} aria-hidden="true">{segment}</span>
          : <span key={i}>{segment}</span>
      )}
    </Tag>
  )
}
