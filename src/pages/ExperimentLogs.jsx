import { useState } from 'react'
import { useSanity } from '../context/SanityContext'
import LoreLog from '../components/layout/LoreLog'
import { getLogsForLocation } from '../data/loreLogs'
import pageStyles from './PageShared.module.css'
import styles from './ExperimentLogs.module.css'

const PROJECTS = [
  {
    id: 'exp-001',
    title: 'MY SHIELD',
    subtitle: 'Personal safety app for solo workers and independent contractors',
    desc: 'A personal safety app for solo workers and independent contractors. Tracks location, enables discreet imaging, and offers fake call features to deter threats — putting safety tools in your pocket without drawing attention.',
    tags: ['UI/UX', 'Mobile', 'Safety', 'Figma', 'Prototype'],
    status: 'COMPLETE',
    link: 'https://www.figma.com/proto/mwfGDZL55y3GngCZeRzDQ4/MyShield-App?node-id=5-6&p=f&t=jZIVU9mrx1YcW8Wi-0&scaling=scale-down&content-scaling=fixed&starting-point-node-id=3227%3A85',
  },
  {
    id: 'exp-002',
    title: 'THE SWEET SPOT',
    subtitle: 'A vibrant, sensory-driven app UI concept',
    desc: 'A vibrant, sensory-driven app UI concept built around nostalgia and appetite. Designed to make you feel and almost taste what you\'re browsing — flavour, texture, and craving baked into every scroll.',
    tags: ['UI/UX', 'Mobile', 'Visual Design', 'Figma', 'Concept'],
    status: 'CONCEPT',
    link: 'https://www.figma.com/proto/DQAChtQtBrxtBR1rOBj6sc/Hub-App?node-id=2369-143&t=kFqReQgq3V4ztieq-1',
  },
  {
    id: 'exp-003',
    title: 'VIRTUAL WATCH PET',
    subtitle: 'Apple Watch virtual pet app',
    desc: 'An Apple Watch virtual pet app built around Stardew Valley-inspired animals and pets, with the ginger cat as the main focus. Clean, simple interactions designed for tight hardware constraints — assets sourced legitimately and edited in Procreate.',
    tags: ['UI/UX', 'Apple Watch', 'iOS', 'Figma', 'Procreate'],
    status: 'COMPLETE',
    link: 'https://www.figma.com/proto/bx1YZPb3kyceNtElDFm8xp/Virtual-Pet?node-id=6-49&p=f&t=Cnz7dgYYnq9rinNm-0&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1282%3A830',
  },
  {
    id: 'exp-004',
    title: 'KHP — KLEAN HOUSE PROJECT',
    subtitle: 'A digital companion for sustainable living',
    desc: 'A group project built around a UN sustainability goal. A digital companion app connecting users to publications, events, and statistics — designed to make sustainable living actionable and accessible.',
    tags: ['UI/UX', 'Mobile', 'Sustainability', 'UN Goals', 'Group Project', 'Figma'],
    status: 'COMPLETE',
    link: 'https://www.figma.com/proto/Jz1oa7iLdRhhEipTB4rofy/Klean-House-Project---UN-Sustainability-App--Copy-?node-id=241-2&t=cqwQyo78LZWPYaqA-1',
  },
  {
    id: 'exp-005',
    title: 'DESIGN LIBRARY',
    subtitle: 'A gamified app for learning design fundamentals',
    desc: 'A group project. A compact, approachable app for learning design fundamentals — covering key disciplines through games, multiple choice questions, and an achievement system with badges and awards to keep you coming back.',
    tags: ['UI/UX', 'Mobile', 'Education', 'Gamification', 'Group Project', 'Figma'],
    status: 'COMPLETE',
    link: 'https://www.figma.com/proto/9MStmNu5rqG7VZ5d6E051s/DesignLibraryApp?node-id=1-21&t=vVvQX3H6goHxqSGp-1',
  },
  {
    id: 'exp-006',
    title: 'TRIUR.AI',
    subtitle: 'Three AI siblings who live on your desktop',
    desc: 'Three AI siblings who live on your desktop. Abi, David, and Quinn aren\'t assistants — they\'re fully realised digital people with distinct personalities, moods, and relationships with each other. They remember you. They grow with you. They notice when you\'re gone. Built with Tauri and Python.',
    tags: ['AI', 'Desktop App', 'Tauri', 'Python', 'Creative Development'],
    status: 'UNCONTAINED',
    link: 'https://github.com/AMPickettDesign/Triur.ai',
  },
];

const STATUS_COLORS = {
  COMPLETE:    'var(--sage)',
  ONGOING:     'var(--amber)',
  UNCONTAINED: 'var(--danger-bright)',
  CONCEPT:     'var(--text-dim)',
  REDACTED:    'var(--danger-bright)',
}

export default function ExperimentLogs() {
  const { devMode } = useSanity()
  const [openBox, setOpenBox] = useState(null)
  const logs = getLogsForLocation('experiment-logs')

  const toggleBox = (id) => {
    setOpenBox(prev => prev === id ? null : id)
  }

  return (
    <main className={pageStyles.page}>
      <div className={pageStyles.container}>

        <header className={pageStyles.pageHeader}>
          <div className={pageStyles.pageCode}>SEC-02 / EXPERIMENT LOGS</div>
          <h1 className={pageStyles.pageTitle}>Case Studies</h1>
        </header>

        {/* Archive storage */}
        <div className={styles.shelfUnit}>
          <div className={styles.shelfLabel}>
            <span>ARCHIVE STORAGE — EXPERIMENT RECORDS</span>
            <span>{PROJECTS.length} FILES</span>
          </div>

          <div className={styles.boxGrid}>
            {PROJECTS.map(project => (
              <div key={project.id} className={styles.archiveBox}>
                {/* The box */}
                <div
                  className={[
                    styles.boxBody,
                    openBox === project.id ? styles.boxOpen : '',
                  ].join(' ')}
                  onClick={() => openBox !== project.id && toggleBox(project.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openBox === project.id}
                  aria-controls={`box-${project.id}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleBox(project.id)
                    }
                  }}
                >
                  {/* Front label */}
                  <div className={styles.boxLabel}>
                    <div className={styles.boxCode}>
                      <span>{project.id.toUpperCase()}</span>
                      <span style={{ color: STATUS_COLORS[project.status] || 'var(--ash)' }}>
                        {project.status}
                      </span>
                    </div>
                    <div className={styles.boxTitle}>{project.title}</div>
                    <div className={styles.boxSubtitle}>{project.subtitle}</div>
                  </div>
                  {/* 3D bottom shadow */}
                  <div className={styles.boxBottom} aria-hidden="true" />
                </div>

                {/* Lid animation + open contents */}
                {openBox === project.id && (
                  <>
                    <div className={styles.lidWrapper} aria-hidden="true">
                      <div className={styles.lid} />
                    </div>
                    <div
                      className={styles.boxContents}
                      id={`box-${project.id}`}
                      role="region"
                      aria-label={`${project.title} project details`}
                    >
                      <button
                        className={styles.closeBtn}
                        onClick={(e) => { e.stopPropagation(); setOpenBox(null) }}
                        aria-label="Close file"
                      >
                        CLOSE
                      </button>
                      <div className={styles.fileSubtitle}>{project.subtitle}</div>
                      <p className={styles.fileDesc}>{project.desc}</p>
                      <div className={styles.fileTags}>
                        {project.tags.map(t => (
                          <span key={t} className={styles.fileTag}>{t}</span>
                        ))}
                      </div>
                      {project.link && project.link !== '#' && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          VIEW PROJECT <span className={styles.fileLinkArrow} aria-hidden="true">→</span>
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {logs.length > 0 && (
          <section className={pageStyles.logsSection}>
            <div className={pageStyles.sectionHeader}>RECOVERED LOGS</div>
            {logs.map(log => <LoreLog key={log.id} log={log} />)}
          </section>
        )}

        {devMode && (
          <section className={pageStyles.devPanel}>
            <div className={pageStyles.panelHeader}>[ DEVELOPER MODE ]</div>
            <p className={pageStyles.bodyText}>
              <strong>Design decision:</strong> Projects are presented as archive storage boxes
              on shelves — each box has a label on the front with the project code, title, and
              status. Clicking a box opens the lid (animated) and reveals the project details
              inside. Only one box is open at a time. The interaction mirrors the facility's
              physical document archive aesthetic.
            </p>
          </section>
        )}

      </div>
    </main>
  )
}
