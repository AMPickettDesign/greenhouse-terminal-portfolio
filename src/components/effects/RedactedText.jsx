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
 * Interaction:
 *   Hover a block  → temporary reveal (0.7 opacity)
 *   Click a block  → permanent reveal (full opacity, persists)
 *   Eraser tool    → all blocks permanently revealed at once
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

  // Eraser: permanently reveal all blocks
  useEffect(() => {
    if (eraserEquipped && blockCount > 0) {
      setRevealedSet(prev => {
        const next = new Set(prev)
        for (let i = 0; i < blockCount; i++) next.add(i)
        return next
      })
    }
  }, [eraserEquipped, blockCount])

  const handleClick = useCallback((blockIdx) => {
    setRevealedSet(prev => {
      const next = new Set(prev)
      next.add(blockIdx)
      return next
    })
    setTappedIndex(null)
  }, [])

  const handleTouchEnd = useCallback((blockIdx, e) => {
    e.preventDefault()
    if (tappedIndex === blockIdx) {
      // Second tap — permanent reveal
      handleClick(blockIdx)
    } else {
      // First tap — temporary reveal
      setTappedIndex(blockIdx)
      setHoveredIndex(blockIdx)
    }
  }, [tappedIndex, handleClick])

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

          if (isHovered) {
            return (
              <span
                key={i}
                className={styles.revealedTextTemp}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => { setHoveredIndex(null); setTappedIndex(null) }}
                onClick={() => handleClick(idx)}
                onTouchEnd={(e) => handleTouchEnd(idx, e)}
              >
                {seg.revealed}
              </span>
            )
          }

          return (
            <span
              key={i}
              className={styles.blockedText}
              aria-hidden="true"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => { setHoveredIndex(null); setTappedIndex(null) }}
              onClick={() => handleClick(idx)}
              onTouchEnd={(e) => handleTouchEnd(idx, e)}
              role="button"
              tabIndex={0}
              aria-label="Redacted text — click to reveal"
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

  // If eraser equipped or all blocks revealed, show full revealed text
  if (eraserEquipped && revealed) {
    return (
      <Tag className={className}>
        <span className={styles.revealedText}>{revealed}</span>
      </Tag>
    )
  }

  // Render with styled blocks (no per-block reveal in fallback mode)
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
