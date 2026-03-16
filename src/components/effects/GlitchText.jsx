import { useState, useEffect, useRef } from 'react'
import { useSanity } from '../../context/SanityContext'

/**
 * GlitchText
 * Renders text that scrambles based on current sanity level.
 * 
 * Props:
 *   text       — the string to display
 *   tag        — HTML tag to use (default: 'span')
 *   alwaysGlitch — force glitch regardless of sanity (for decorative use)
 *   className  — additional class names
 */
export default function GlitchText({ text, tag: Tag = 'span', alwaysGlitch = false, className = '' }) {
  const { sanity, scramble, reducedMotion, isMobile, equippedTool } = useSanity()
  const [displayed, setDisplayed] = useState(text)
  const frameRef = useRef(null)

  const penEquipped = equippedTool === 'pen'
  const shouldGlitch = !penEquipped && !isMobile && (alwaysGlitch || sanity < 60)

  useEffect(() => {
    if (isMobile || reducedMotion || !shouldGlitch) {
      setDisplayed(text)
      if (frameRef.current) clearInterval(frameRef.current)
      return
    }

    // Scramble interval — faster at lower sanity
    const intervalMs = alwaysGlitch ? 120 : Math.max(80, sanity * 4)

    frameRef.current = setInterval(() => {
      setDisplayed(scramble(text))
    }, intervalMs)

    return () => clearInterval(frameRef.current)
  }, [sanity, text, shouldGlitch, reducedMotion, alwaysGlitch, scramble, isMobile])

  if (isMobile) {
    return <Tag className={className} aria-label={text}>{text}</Tag>
  }

  return (
    <Tag
      className={className}
      style={{
        display: 'inline-block',
        filter: shouldGlitch && !reducedMotion
          ? `blur(${(1 - sanity / 100) * 0.5}px)` 
          : 'none',
        transform: shouldGlitch && !reducedMotion && sanity < 30
          ? `translateX(${(Math.random() - 0.5) * 3}px)`
          : 'none',
      }}
      aria-label={text}
    >
      {displayed}
    </Tag>
  )
}
