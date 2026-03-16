import { useSanity } from '../../context/SanityContext'

/**
 * SanityOverlay
 * A fixed fullscreen layer that applies visual distortion effects
 * as sanity decreases. Renders above all content, pointer-events: none.
 */
export default function SanityOverlay() {
  const { sanity, reducedMotion, isMobile } = useSanity()

  if (isMobile || reducedMotion || sanity >= 90) return null

  const intensity = (100 - sanity) / 100  // 0 = sane, 1 = critical

  return (
    <>
      {/* Vignette — darkens edges */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity * 0.7}) 100%)`,
          pointerEvents: 'none',
          zIndex: 9990,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Color bleed — red channel shift at low sanity */}
      {sanity < 50 && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: `rgba(139, 26, 26, ${intensity * 0.08})`,
            pointerEvents: 'none',
            zIndex: 9991,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Horizontal tear lines at very low sanity */}
      {sanity < 30 && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent ${20 + sanity}px,
              rgba(168, 213, 181, 0.03) ${20 + sanity}px,
              rgba(168, 213, 181, 0.03) ${21 + sanity}px
            )`,
            animation: 'tear-scroll 0.8s linear infinite',
            pointerEvents: 'none',
            zIndex: 9992,
          }}
        />
      )}

      <style>{`
        @keyframes tear-scroll {
          0%   { background-position-y: 0px; }
          100% { background-position-y: ${20 + sanity}px; }
        }
      `}</style>
    </>
  )
}
