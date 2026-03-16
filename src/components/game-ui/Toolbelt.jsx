import { useSanity } from '../../context/SanityContext'
import styles from './Toolbelt.module.css'

const TOOLS = [
  {
    id: 'pen',
    name: 'PERMANENT FIX PEN',
    icon: '✒',
    desc: 'Reveals corrupted and redacted text while equipped.',
    unlocked: true,
  },
  { id: null, name: 'LOCKED', icon: '?', desc: 'Not yet discovered.', unlocked: false },
  { id: null, name: 'LOCKED', icon: '?', desc: 'Not yet discovered.', unlocked: false },
  { id: null, name: 'LOCKED', icon: '?', desc: 'Not yet discovered.', unlocked: false },
  { id: null, name: 'LOCKED', icon: '?', desc: 'Not yet discovered.', unlocked: false },
  { id: null, name: 'LOCKED', icon: '?', desc: 'Not yet discovered.', unlocked: false },
]

export default function Toolbelt() {
  const { equippedTool, setEquippedTool } = useSanity()

  const handleSelect = (tool) => {
    if (!tool.unlocked || !tool.id) return
    setEquippedTool(prev => prev === tool.id ? null : tool.id)
  }

  return (
    <div className={styles.toolbelt} role="toolbar" aria-label="Toolbelt">
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
              aria-label={tool.unlocked ? `${tool.name} — ${tool.desc}` : 'Locked tool slot'}
              aria-pressed={isActive}
              title={tool.unlocked ? tool.name : 'LOCKED'}
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
