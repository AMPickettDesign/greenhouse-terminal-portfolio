import { useSanity } from '../../context/SanityContext'
import styles from './RedactedText.module.css'

/**
 * RedactedText
 * Takes a redacted string (containing █ blocks) and a revealed string.
 * When the pen is equipped, hovering over a redacted segment reveals the
 * corresponding clean text from the revealed version.
 *
 * Props:
 *   redacted  — the text with █ characters
 *   revealed  — the clean text (same length flow, different content where █ was)
 *   tag       — wrapper element (default: 'span')
 *   className — passed through to wrapper
 */
export default function RedactedText({ redacted, revealed, tag: Tag = 'span', className = '' }) {
  const { equippedTool } = useSanity()
  const penEquipped = equippedTool === 'pen'

  // If no revealed version or no redacted blocks, just render as-is
  if (!revealed || !redacted.includes('█')) {
    return <Tag className={className}>{redacted}</Tag>
  }

  // If pen is not equipped, render the redacted text flat
  if (!penEquipped) {
    return <Tag className={className}>{redacted}</Tag>
  }

  // Split redacted text into segments: normal text vs █ blocks
  // Match runs of █ or runs of non-█
  const segments = redacted.match(/█+|[^█]+/g) || [redacted]

  // Walk through the redacted string to find what each █ block maps to
  // in the revealed string by character position
  let pos = 0
  const parts = segments.map((segment, i) => {
    const start = pos
    pos += segment.length
    const end = pos

    if (/^█+$/.test(segment)) {
      // This is a redacted block — pull the revealed text from the same position
      const revealedSlice = revealed.slice(start, end)
      // The revealed slice might be longer/shorter if the texts don't align perfectly
      // Use the revealed slice if available, otherwise just show the block
      const cleanText = revealedSlice || segment

      return (
        <span key={i} className={styles.redactedBlock} aria-label={cleanText}>
          <span className={styles.blockedText} aria-hidden="true">{segment}</span>
          <span className={styles.revealedText}>{cleanText}</span>
        </span>
      )
    }

    return <span key={i}>{segment}</span>
  })

  return <Tag className={className}>{parts}</Tag>
}
