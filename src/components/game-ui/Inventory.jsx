import { useState } from 'react'
import { useSanity } from '../../context/SanityContext'
import styles from './Inventory.module.css'

const INITIAL_ITEMS = [
  { id: 1, name: 'Research Badge',    description: 'Level 3 clearance. Or is it Level 2?',          icon: '🪪', slot: 0,  corrupted: false },
  { id: 2, name: 'Flashlight',        description: 'Battery at 40%. Bulb flickers intermittently.',  icon: '🔦', slot: 1,  corrupted: false },
  { id: 3, name: 'Specimen Jar',      description: 'Contains something. Something that moves.',       icon: '🫙', slot: 3,  corrupted: false },
  { id: 4, name: 'Field Notes',       description: 'Your own handwriting. You don\'t remember writing this.', icon: '📓', slot: 5, corrupted: false },
  { id: 5, name: 'Key — Sector C',    description: 'You found this in your pocket. You don\'t know how.',    icon: '🗝️', slot: 8, corrupted: false },
]

const TOTAL_SLOTS = 16

const CORRUPT_NAMES = ['███████', 'REDACTED', 'IT', 'DO NOT OPEN', '████', 'VOID']
const CORRUPT_DESCS = [
  'You cannot read this right now.',
  'The text keeps moving.',
  '█████████████████████',
  'It knows you\'re looking at it.',
]

export default function Inventory({ interactive = false }) {
  const { sanity, equippedTool } = useSanity()
  const [items] = useState(INITIAL_ITEMS)
  const [selected, setSelected] = useState(null)

  const penEquipped = equippedTool === 'pen'
  const corruptionLevel = penEquipped ? 0 : (sanity < 60 ? (60 - sanity) / 60 : 0)

  const displayName = (item) => {
    if (corruptionLevel > 0.5 && item.corrupted) return CORRUPT_NAMES[item.id % CORRUPT_NAMES.length]
    if (corruptionLevel > 0.7 && Math.random() < 0.3) return CORRUPT_NAMES[item.id % CORRUPT_NAMES.length]
    return item.name
  }

  const displayDesc = (item) => {
    if (corruptionLevel > 0.6) return CORRUPT_DESCS[item.id % CORRUPT_DESCS.length]
    return item.description
  }

  const selectedItem = items.find(i => i.id === selected)

  return (
    <div className={styles.inventory} role="region" aria-label="Inventory">
      <div className={styles.header}>
        <span className={styles.title}>INVENTORY</span>
        <span className={styles.count}>{items.length}/{TOTAL_SLOTS}</span>
      </div>

      <div className={styles.layout}>
        {/* Grid */}
        <div className={styles.grid} role="list" aria-label="Item grid">
          {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
            const item = items.find(it => it.slot === i)
            return (
              <div
                key={i}
                className={[
                  styles.slot,
                  item ? styles.filled : '',
                  selected === item?.id ? styles.selectedSlot : '',
                ].join(' ')}
                role="listitem"
                onClick={() => item && setSelected(selected === item.id ? null : item.id)}
                aria-label={item ? `${item.name}, press to inspect` : 'Empty slot'}
                tabIndex={item ? 0 : -1}
                onKeyDown={e => e.key === 'Enter' && item && setSelected(selected === item.id ? null : item.id)}
              >
                {item && (
                  <span className={styles.itemIcon} aria-hidden="true">
                    {corruptionLevel > 0.8 ? '?' : item.icon}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className={styles.detail}>
          {selectedItem ? (
            <>
              <div className={styles.detailIcon} aria-hidden="true">
                {corruptionLevel > 0.8 ? '?' : selectedItem.icon}
              </div>
              <div className={styles.detailName}>
                {displayName(selectedItem)}
              </div>
              <p className={styles.detailDesc}>
                {displayDesc(selectedItem)}
              </p>
              {interactive && (
                <button className="btn" onClick={() => setSelected(null)}>
                  CLOSE
                </button>
              )}
            </>
          ) : (
            <p className={styles.detailEmpty}>
              {sanity < 30
                ? 'DO NOT SELECT ANYTHING'
                : 'Select an item to inspect.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
