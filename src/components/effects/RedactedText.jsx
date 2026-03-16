import { useSanity } from '../../context/SanityContext'
import styles from './RedactedText.module.css'

/**
 * RedactedText
 * Takes a redacted string (containing █ blocks) and a revealed string.
 * When the eraser is equipped, redacted blocks are automatically replaced
 * with the clean revealed text.
 *
 * Props:
 *   redacted  — the text with █ characters
 *   revealed  — the clean text (same length flow, different content where █ was)
 *   tag       — wrapper element (default: 'span')
 *   className — passed through to wrapper
 */
export default function RedactedText({ redacted, revealed, tag: Tag = 'span', className = '' }) {
  const { equippedTool } = useSanity()
  const eraserEquipped = equippedTool === 'eraser'

  // If no redacted blocks exist, render as-is
  if (!redacted.includes('█')) {
    return <Tag className={className}>{redacted}</Tag>
  }

  // Eraser equipped — show the clean revealed text
  if (eraserEquipped && revealed) {
    return (
      <Tag className={className}>
        {renderWithHighlights(redacted, revealed)}
      </Tag>
    )
  }

  // Eraser not equipped — render redacted text with styled blocks
  return (
    <Tag className={className}>
      {renderRedacted(redacted)}
    </Tag>
  )
}

/**
 * Render redacted text with █ blocks styled as solid bars
 */
function renderRedacted(text) {
  const segments = text.match(/█+|[^█]+/g) || [text]
  return segments.map((segment, i) => {
    if (/^█+$/.test(segment)) {
      return (
        <span key={i} className={styles.blockedText} aria-hidden="true">{segment}</span>
      )
    }
    return <span key={i}>{segment}</span>
  })
}

/**
 * When eraser is equipped, show revealed text with the previously-redacted
 * parts highlighted so the user can see what was uncovered.
 */
function renderWithHighlights(redacted, revealed) {
  const segments = redacted.match(/█+|[^█]+/g) || [redacted]
  let pos = 0

  return segments.map((segment, i) => {
    const start = pos
    pos += segment.length
    const end = pos

    if (/^█+$/.test(segment)) {
      const cleanText = revealed.slice(start, end) || segment
      return (
        <span key={i} className={styles.revealedText} aria-label={cleanText}>
          {cleanText}
        </span>
      )
    }

    return <span key={i}>{revealed.slice(start, end) || segment}</span>
  })
}
