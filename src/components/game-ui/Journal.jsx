import { useState, useEffect } from 'react'
import { useSanity } from '../../context/SanityContext'
import styles from './Journal.module.css'

const ENTRIES = [
  {
    id: 'e1',
    date: '2020-04-01',
    title: 'Arrival',
    body: 'First day on site. The facility is larger than the blueprints suggested. Staff seem... tired. The greenhouse wing is beautiful though. I can see why the research team chose this location.',
    tag: 'FIELD NOTE',
  },
  {
    id: 'e2',
    date: '2020-04-03',
    title: 'Specimen B-7',
    body: 'The root formations on Specimen B-7 have changed overnight. Dr. Marsh says this is expected. I photographed them anyway. Something about the pattern looks intentional.',
    tag: 'OBSERVATION',
  },
  {
    id: 'e3',
    date: '2020-04-07',
    title: '[ ENTRY TITLE MISSING ]',
    body: 'I am not going back into Sector C tonight. I don\'t care what the rotation says.',
    tag: 'PERSONAL',
  },
  {
    id: 'e4',
    date: '2020-04-09',
    title: 'Security Briefing',
    body: 'Management reminded us that the sounds during the night cycle are "within acceptable parameters." Nobody asked a follow-up question. I don\'t think anyone wanted to.',
    tag: 'FIELD NOTE',
  },
  {
    id: 'e5',
    date: '2020-04-11',
    title: 'I think it can read',
    body: 'The specimen in bay 4 has begun orienting itself toward written text left near its enclosure. Dr. Marsh says plants respond to heat and CO₂ from researchers. Dr. Marsh is wrong.',
    tag: 'OBSERVATION',
  },
]

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Journal({ interactive = false }) {
  const { sanity, equippedTool } = useSanity()
  const [entries, setEntries] = useState(ENTRIES)
  const [selected, setSelected] = useState(ENTRIES[0].id)
  const [lastSanity, setLastSanity] = useState(sanity)

  const penEquipped = equippedTool === 'pen'

  // Reorder entries when sanity crosses thresholds (not when pen equipped)
  useEffect(() => {
    if (penEquipped) return
    if (sanity < 40 && lastSanity >= 40) {
      setEntries(prev => shuffle(prev))
    }
    if (sanity < 20 && lastSanity >= 20) {
      setEntries(prev => shuffle(prev))
    }
    setLastSanity(sanity)
  }, [sanity, lastSanity, penEquipped])

  const corruption = penEquipped ? 0 : (sanity < 60 ? (60 - sanity) / 60 : 0)

  const corruptTitle = (title) => {
    if (corruption < 0.4) return title
    return title.split('').map(c =>
      c !== ' ' && Math.random() < corruption * 0.3 ? '█' : c
    ).join('')
  }

  const selectedEntry = entries.find(e => e.id === selected)

  return (
    <div className={styles.journal} role="region" aria-label="Field journal">
      <div className={styles.header}>
        <span className={styles.title}>FIELD JOURNAL</span>
        {sanity < 40 && !penEquipped && (
          <span className={styles.warning}>⚠ ENTRIES REORDERING — EQUIP A TOOL TO STABILIZE</span>
        )}
      </div>

      <div className={styles.layout}>
        {/* Entry list */}
        <nav className={styles.entryList} aria-label="Journal entries">
          {entries.map(entry => (
            <button
              key={entry.id}
              className={[styles.entryItem, selected === entry.id ? styles.active : ''].join(' ')}
              onClick={() => setSelected(entry.id)}
            >
              <span className={styles.entryDate}>{entry.date}</span>
              <span className={styles.entryTitle}>{corruptTitle(entry.title)}</span>
              <span className={styles.entryTag}>{entry.tag}</span>
            </button>
          ))}
        </nav>

        {/* Entry content */}
        {selectedEntry && (
          <article className={styles.entryContent} aria-live="polite">
            <div className={styles.entryHeader}>
              <span className={styles.contentDate}>{selectedEntry.date}</span>
              <span className={styles.contentTag}>{selectedEntry.tag}</span>
            </div>
            <h3 className={styles.contentTitle}>
              {corruptTitle(selectedEntry.title)}
            </h3>
            <p className={styles.contentBody}
              style={{
                filter: corruption > 0.3 ? `blur(${corruption * 0.8}px)` : 'none',
              }}
            >
              {selectedEntry.body}
            </p>
          </article>
        )}
      </div>

      {interactive && (
        <div className={styles.sanityNote}>
          Sanity: {Math.round(sanity)}% — entries reorder below 40
        </div>
      )}
    </div>
  )
}
