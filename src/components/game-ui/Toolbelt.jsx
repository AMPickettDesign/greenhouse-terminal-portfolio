import { useState, useEffect, useCallback } from 'react'
import { useSanity } from '../../context/SanityContext'
import styles from './Toolbelt.module.css'

const TOOLS = [
  {
    id: 'pen',
    name: 'PERMANENT FIX PEN',
    icon: '✒',
    shortDesc: 'Reveals hidden and corrupted text.',
    fullDesc: 'Permanent Fix for Permanent Problems. Equip this pen to uncover all blacked-out, redacted, and corrupted information across the facility. Hold over corrupted text to reveal what was hidden.',
    unlocked: true,
  },
  { id: null, name: 'LOCKED', icon: '?', shortDesc: 'Not yet discovered.', fullDesc: 'This tool has not been recovered from the facility.', unlocked: false },
  { id: null, name: 'LOCKED', icon: '?', shortDesc: 'Not yet discovered.', fullDesc: 'This tool has not been recovered from the facility.', unlocked: false },
  { id: null, name: 'LOCKED', icon: '?', shortDesc: 'Not yet discovered.', fullDesc: 'This tool has not been recovered from the facility.', unlocked: false },
  { id: null, name: 'LOCKED', icon: '?', shortDesc: 'Not yet discovered.', fullDesc: 'This tool has not been recovered from the facility.', unlocked: false },
  { id: null, name: 'LOCKED', icon: '?', shortDesc: 'Not yet discovered.', fullDesc: 'This tool has not been recovered from the facility.', unlocked: false },
]

export default function Toolbelt() {
  const { equippedTool, setEquippedTool } = useSanity()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [shiftHeld, setShiftHeld] = useState(false)

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Shift') setShiftHeld(true)
  }, [])
  const onKeyUp = useCallback((e) => {
    if (e.key === 'Shift') setShiftHeld(false)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  const handleSelect = (tool) => {
    if (!tool.unlocked || !tool.id) return
    setEquippedTool(prev => prev === tool.id ? null : tool.id)
  }

  const hoveredTool = hoveredIndex !== null ? TOOLS[hoveredIndex] : null

  return (
    <div className={styles.toolbelt} role="toolbar" aria-label="Toolbelt">
      {/* Tooltip */}
      {hoveredTool && (
        <div className={[styles.tooltip, shiftHeld ? styles.tooltipExpanded : ''].join(' ')} aria-live="polite">
          <div className={styles.tooltipName}>{hoveredTool.name}</div>
          {shiftHeld ? (
            <div className={styles.tooltipFull}>{hoveredTool.fullDesc}</div>
          ) : (
            <>
              <div className={styles.tooltipShort}>{hoveredTool.shortDesc}</div>
              <div className={styles.tooltipHint}>HOLD SHIFT FOR INFO</div>
            </>
          )}
        </div>
      )}

      <div className={styles.slots}>
        {TOOLS.map((tool, i) => {
          const isActive = equippedTool === tool.id && tool.id !== null
          return (
            <button
              key={i}
              className={[
                styles.slot,
                tool.unlocked ? styles.unlocked : styles.locked,
                isActive ? styles.active : '',
              ].join(' ')}
              onClick={() => handleSelect(tool)}
              disabled={!tool.unlocked || !tool.id}
              aria-label={tool.unlocked ? `${tool.name} — ${tool.shortDesc}` : 'Locked tool slot'}
              aria-pressed={isActive}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
            >
              <span className={styles.slotIcon} aria-hidden="true">{tool.icon}</span>
              <span className={styles.slotKey} aria-hidden="true">{i + 1}</span>
            </button>
          )
        })}
      </div>
      {equippedTool && (
        <div className={styles.equipped} aria-live="polite">
          EQUIPPED: {TOOLS.find(t => t.id === equippedTool)?.name}
        </div>
      )}
    </div>
  )
}
