import { useState, useEffect, useCallback } from 'react'
import { useSanity } from '../../context/SanityContext'
import styles from './RedactedText.module.css'

/**
 * RedactedText
 *
 * Accepts either:
 *   segments — array of strings and { blocked, revealed } objects (per-block reveal)
 *   redacted + revealed — plain strings (fallback: full-text swap)
 *
 * Interaction (only when eraser is equipped):
 *   Hover a block  → temporary reveal (0.7 opacity)
 *   Click a block  → permanent reveal (full opacity, persists)
 *   Eraser equipped → hover + click both work
 *   Eraser not equipped → redactions are completely static
 *   Mobile: tap 1  → temp reveal, tap 2 → permanent
 */
export default function RedactedText({
  segments,
  redacted,
  revealed,
  tag: Tag = 'span',
  className = '',
}) {
  const { equippedTool } = useSanity()
  const eraserEquipped = equippedTool === 'eraser'

  // Count how many blocks exist in segments
  const blockCount = segments
    ? segments.filter(s => typeof s === 'object').length
    : 0

  const [revealedSet, setRevealedSet] = useState(() => new Set())
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [tappedIndex, setTappedIndex] = useState(null)

  // Clear hover/tap state when eraser is unequipped
  useEffect(() => {
    if (!eraserEquipped) {
      setHoveredIndex(null)
      setTappedIndex(null)
    }
  }, [eraserEquipped])

  const handleClick = useCallback((blockIdx) => {
    if (!eraserEquipped) return
    setRevealedSet(prev => {
      const next = new Set(prev)
      next.add(blockIdx)
      return next
    })
    setTappedIndex(null)
  }, [eraserEquipped])

  const handleHoverEnter = useCallback((blockIdx) => {
    if (!eraserEquipped) return
    setHoveredIndex(blockIdx)
  }, [eraserEquipped])

  const handleHoverLeave = useCallback(() => {
    setHoveredIndex(null)
    setTappedIndex(null)
  }, [])

  const handleTouchEnd = useCallback((blockIdx, e) => {
    if (!eraserEquipped) return
    e.preventDefault()
    if (tappedIndex === blockIdx) {
      handleClick(blockIdx)
    } else {
      setTappedIndex(blockIdx)
      setHoveredIndex(blockIdx)
    }
  }, [tappedIndex, handleClick, eraserEquipped])

  // ── Segments mode (per-block reveal) ──────────────────────────
  if (segments) {
    let blockIdx = -1

    return (
      <Tag className={className}>
        {segments.map((seg, i) => {
          if (typeof seg === 'string') {
            return <span key={i}>{seg}</span>
          }

          blockIdx++
          const idx = blockIdx
          const isPermanent = revealedSet.has(idx)
          const isHovered = hoveredIndex === idx && !isPermanent

          if (isPermanent) {
            return (
              <span key={i} className={styles.revealedText}>
                {seg.revealed}
              </span>
            )
          }

          // Eraser not equipped — static block, no interaction
          if (!eraserEquipped) {
            return (
              <span key={i} className={styles.blockedText} aria-hidden="true">
                {seg.blocked}
              </span>
            )
          }

          if (isHovered) {
            return (
              <span
                key={i}
                className={styles.revealedTextTemp}
                onMouseEnter={() => handleHoverEnter(idx)}
                onMouseLeave={handleHoverLeave}
                onClick={() => handleClick(idx)}
                onTouchEnd={(e) => handleTouchEnd(idx, e)}
              >
                {seg.revealed}
              </span>
            )
          }

          // Eraser equipped — interactive block
          return (
            <span
              key={i}
              className={styles.blockedText}
              onMouseEnter={() => handleHoverEnter(idx)}
              onMouseLeave={handleHoverLeave}
              onClick={() => handleClick(idx)}
              onTouchEnd={(e) => handleTouchEnd(idx, e)}
              role="button"
              tabIndex={0}
              aria-label="Redacted text — equip eraser and click to reveal"
              onKeyDown={(e) => e.key === 'Enter' && handleClick(idx)}
            >
              {seg.blocked}
            </span>
          )
        })}
      </Tag>
    )
  }

  // ── Fallback: plain string mode (full-text swap) ──────────────
  const hasRedactions = redacted && redacted.includes('█')

  if (!hasRedactions) {
    return <Tag className={className}>{redacted}</Tag>
  }

  // Render with styled blocks (no interaction in fallback mode)
  const parts = redacted.match(/█+|[^█]+/g) || [redacted]
  return (
    <Tag className={className}>
      {parts.map((part, i) =>
        /^█+$/.test(part)
          ? <span key={i} className={styles.blockedText} aria-hidden="true">{part}</span>
          : <span key={i}>{part}</span>
      )}
    </Tag>
  )
}
