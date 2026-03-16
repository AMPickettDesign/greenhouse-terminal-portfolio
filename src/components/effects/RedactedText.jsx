import { useState, useEffect, useCallback } from 'react'
import { useSanity } from '../../context/SanityContext'
import styles from './RedactedText.module.css'

/**
 * RedactedText
 *
 * Accepts either:
 *   segments — array of strings and { blocked, revealed } objects (per-block reveal)
 *   redacted + revealed — plain strings (fallback: static bars only)
 *
 * Interaction (only when eraser is equipped):
 *   Hover ANY block → all blocks in this instance temporarily reveal (0.7 opacity)
 *   Click ANY block → all blocks in this instance permanently reveal
 *   Eraser not equipped → redactions are completely static
 *   Mobile: tap 1 → temp reveal all, tap 2 → permanent reveal all
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

  const [isPermanent, setIsPermanent] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [tapped, setTapped] = useState(false)

  // Clear hover/tap state when eraser is unequipped
  useEffect(() => {
    if (!eraserEquipped) {
      setIsHovered(false)
      setTapped(false)
    }
  }, [eraserEquipped])

  const handleBlockEnter = useCallback(() => {
    if (!eraserEquipped || isPermanent) return
    setIsHovered(true)
  }, [eraserEquipped, isPermanent])

  const handleWrapperLeave = useCallback(() => {
    setIsHovered(false)
    setTapped(false)
  }, [])

  const handleBlockClick = useCallback(() => {
    if (!eraserEquipped) return
    setIsPermanent(true)
    setIsHovered(false)
    setTapped(false)
  }, [eraserEquipped])

  const handleTouchEnd = useCallback((e) => {
    if (!eraserEquipped) return
    e.preventDefault()
    if (tapped) {
      handleBlockClick()
    } else {
      setTapped(true)
      setIsHovered(true)
    }
  }, [tapped, handleBlockClick, eraserEquipped])

  // ── Segments mode (whole-phrase reveal) ────────────────────────
  if (segments) {
    return (
      <Tag
        className={className}
        onMouseLeave={eraserEquipped && !isPermanent ? handleWrapperLeave : undefined}
      >
        {segments.map((seg, i) => {
          if (typeof seg === 'string') {
            return <span key={i}>{seg}</span>
          }

          // Permanently revealed
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

          // Hovered (temp reveal for whole phrase)
          if (isHovered) {
            return (
              <span
                key={i}
                className={styles.revealedTextTemp}
                onMouseEnter={handleBlockEnter}
                onClick={handleBlockClick}
                onTouchEnd={handleTouchEnd}
              >
                {seg.revealed}
              </span>
            )
          }

          // Eraser equipped, not hovered — interactive blocked span
          return (
            <span
              key={i}
              className={styles.blockedText}
              onMouseEnter={handleBlockEnter}
              onClick={handleBlockClick}
              onTouchEnd={handleTouchEnd}
              role="button"
              tabIndex={0}
              aria-label="Redacted text — equip eraser and hover or click to reveal"
              onKeyDown={(e) => e.key === 'Enter' && handleBlockClick()}
            >
              {seg.blocked}
            </span>
          )
        })}
      </Tag>
    )
  }

  // ── Fallback: plain string mode (static bars only) ────────────
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
