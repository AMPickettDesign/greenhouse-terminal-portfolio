import { useState, useEffect, useRef, useCallback } from 'react'
import { useSanity } from '../../context/SanityContext'
import styles from './Dialogue.module.css'

const CONVERSATIONS = [
  {
    id: 'guard',
    speaker: 'SECURITY OFFICER DALE',
    lines: [
      {
        text: "You're not supposed to be in this section. I'm going to need to see your clearance badge.",
        choices: [
          { label: "Show badge", next: 'badge_shown' },
          { label: "I work here", next: 'claim_staff' },
          { label: "Run", next: 'flee' },
        ],
      },
    ],
    badge_shown: {
      text: "This... this doesn't look right. The photo doesn't match. Who are you really?",
      choices: [
        { label: "Stay calm", next: null },
        { label: "Look away", next: null },
      ],
    },
    claim_staff: {
      text: "You work here. Right. Then you've seen what's in Sector B. Then you already know.",
      choices: [
        { label: "What do you mean?", next: null },
        { label: "...", next: null },
      ],
    },
    flee: {
      text: null, // end
      choices: [],
    },
  },
]

// Corrupt a string — drop characters, insert noise
function corruptText(text, intensity) {
  if (intensity <= 0) return text
  const glyphs = '░▒▓█▄▀■□▪▫!?@#'
  return text.split('').map(char => {
    if (char === ' ') return char
    if (Math.random() < intensity * 0.2) return glyphs[Math.floor(Math.random() * glyphs.length)]
    if (Math.random() < intensity * 0.1) return ''
    return char
  }).join('')
}

export default function Dialogue({ interactive = false }) {
  const { sanity, equippedTool } = useSanity()
  const [conv] = useState(CONVERSATIONS[0])
  const [nodeKey, setNodeKey] = useState(null) // null = opening line
  const [displayedText, setDisplayedText] = useState('')
  const [typing, setTyping] = useState(false)
  const [done, setDone] = useState(false)
  const [dialoguePaused, setDialoguePaused] = useState(false)
  const dialoguePausedRef = useRef(false)

  const penEquipped = equippedTool === 'pen'

  const toggleDialoguePause = useCallback(() => {
    setDialoguePaused(prev => {
      dialoguePausedRef.current = !prev
      return !prev
    })
  }, [])

  const corruption = penEquipped ? 0 : (sanity < 70 ? (70 - sanity) / 70 : 0)

  const currentNode = nodeKey ? conv[nodeKey] : conv.lines[0]
  const rawText = currentNode?.text ?? ''

  // Typewriter effect with pause support
  useEffect(() => {
    if (!rawText) { setDone(true); return }
    setTyping(true)
    setDisplayedText('')
    setDone(false)
    setDialoguePaused(false)
    dialoguePausedRef.current = false
    let i = 0
    let cancelled = false
    const speed = Math.max(20, 60 - (100 - sanity) * 0.4)

    function tick() {
      if (cancelled) return
      if (dialoguePausedRef.current) { setTimeout(tick, 50); return }
      i++
      const slice = rawText.slice(0, i)
      setDisplayedText(corruptText(slice, corruption))
      if (i >= rawText.length) {
        setTyping(false)
        setDone(true)
        return
      }
      setTimeout(tick, speed)
    }
    setTimeout(tick, speed)

    return () => { cancelled = true }
  }, [rawText, sanity])

  const handleChoice = (choice) => {
    if (choice.next === null) {
      setDone(true)
      setDisplayedText('...')
      return
    }
    setNodeKey(choice.next)
  }

  const handleReset = () => {
    setNodeKey(null)
    setDone(false)
  }

  const choices = currentNode?.choices ?? []

  // At low sanity, shuffle or corrupt choice labels
  const displayChoices = choices.map(c => ({
    ...c,
    label: corruption > 0.5
      ? corruptText(c.label, corruption * 0.4)
      : c.label,
  }))

  return (
    <div
      className={styles.dialogue}
      data-corruption={corruption > 0.5 ? 'high' : 'low'}
      onClick={typing ? toggleDialoguePause : undefined}
      style={typing ? { cursor: 'pointer' } : undefined}
    >
      <div className={styles.header}>
        <span className={styles.speakerTag}>
          {corruption > 0.6
            ? corruptText(conv.speaker, 0.3)
            : conv.speaker}
        </span>
        <span className={styles.statusTag}>
          {sanity < 30 ? '⚠ UNRELIABLE' : 'LIVE'}
        </span>
      </div>

      <div className={styles.textBox} role="region" aria-live="polite" aria-label="Dialogue">
        {rawText ? (
          <>
            <p className={styles.dialogueText}>
              {displayedText}
              {typing && !dialoguePaused && <span className={styles.cursor} aria-hidden="true">▋</span>}
              {dialoguePaused && <span className={styles.cursor} aria-hidden="true" style={{ opacity: 0.5 }}>▋</span>}
            </p>
            {dialoguePaused && (
              <span style={{ fontFamily: 'var(--font-terminal)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                PAUSED — CLICK TO RESUME
              </span>
            )}
          </>
        ) : (
          <p className={styles.dialogueText} style={{ color: 'var(--ash)' }}>
            {done ? '[END OF TRANSMISSION]' : ''}
          </p>
        )}
      </div>

      {done && displayChoices.length > 0 && (
        <div className={styles.choices} role="group" aria-label="Response options">
          {displayChoices.map((choice, i) => (
            <button
              key={i}
              className={styles.choice}
              onClick={() => handleChoice(choice)}
              style={{
                transform: corruption > 0.7 ? `translateX(${(Math.random() - 0.5) * 6}px)` : 'none',
              }}
            >
              <span className={styles.choiceIndex} aria-hidden="true">{i + 1}.</span>
              {choice.label}
            </button>
          ))}
        </div>
      )}

      {interactive && (nodeKey !== null || done) && (
        <button className={`btn ${styles.resetBtn}`} onClick={handleReset}>
          ↺ RESET DIALOGUE
        </button>
      )}
    </div>
  )
}
