import { useSanity } from '../context/SanityContext'
import LoreLog from '../components/layout/LoreLog'
import { getLogsForLocation } from '../data/loreLogs'
import styles from './PageShared.module.css'

const PERSONNEL = {
  name: 'Ashley M. Pickett',
  designation: 'GRAPHIC / UI/UX DESIGNER & CREATIVE TECHNOLOGIST',
  id: 'PER-0042',
  role: 'Graphic Designer, UI/UX Designer',
  status: 'ACTIVE',
  summary: 'Graphic Designer and UI/UX Designer with a BA in Graphic Design and a UI/UX Certificate from Eastern Washington University. Specialises in visual communication, brand identity, and user experience — from concept through to final output. Experienced across print, digital, and product design. Comfortable taking a project from wireframe to working prototype, and from mood board to production-ready asset. Uses AI as a creative tool — integrated into the process to design, build, and produce work that wouldn\'t be possible otherwise.',
  disciplines: [
    'UI/UX Design',
    'Graphic Design',
    'Visual Communication',
    'Branding & Identity Design',
    'Visual Storytelling',
    'Style Guide & System Design',
    'AI/Emergent Design Concepts',
  ],
  tools: [
    'Figma',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe InDesign',
    'HTML / CSS',
    'React',
    'Tauri',
    'Python',
    'AI Tools (Claude, etc.)',
  ],
  note: 'You don\'t need a perfect path. Just a direction — and something worth building. Good design disappears. Bad design makes itself known. If the lights go out, learn to see in the dark.',
};

export default function Personnel() {
  const { devMode } = useSanity()
  const logs = getLogsForLocation('personnel')

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        <header className={styles.pageHeader}>
          <div className={styles.pageCode}>SEC-01 / PERSONNEL RECORDS</div>
          <h1 className={styles.pageTitle}>Personnel File</h1>
        </header>

        <div className={styles.twoCol}>
          {/* Main */}
          <section>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>SUBJECT PROFILE</div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>DESIGNATION</span>
                <span className={styles.fieldVal}>{PERSONNEL.designation}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>PERSONNEL ID</span>
                <span className={styles.fieldVal}>{PERSONNEL.id}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>ROLE</span>
                <span className={styles.fieldVal}>{PERSONNEL.role}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>STATUS</span>
                <span className={styles.fieldVal} style={{ color: 'var(--sage)' }}>
                  ● {PERSONNEL.status}
                </span>
              </div>
            </div>

            <div className={styles.panel} style={{ marginTop: 'var(--gap-md)' }}>
              <div className={styles.panelHeader}>SUMMARY</div>
              <p className={styles.bodyText}>{PERSONNEL.summary}</p>
              <blockquote className={styles.quote}>{PERSONNEL.note}</blockquote>
            </div>
          </section>

          {/* Sidebar */}
          <aside>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>DISCIPLINES</div>
              <ul className={styles.tagList} aria-label="Design disciplines">
                {PERSONNEL.disciplines.map(d => (
                  <li key={d} className={styles.tag}>{d}</li>
                ))}
              </ul>
            </div>

            <div className={styles.panel} style={{ marginTop: 'var(--gap-md)' }}>
              <div className={styles.panelHeader}>TOOLS & SYSTEMS</div>
              <ul className={styles.tagList} aria-label="Tools used">
                {PERSONNEL.tools.map(t => (
                  <li key={t} className={styles.tag}>{t}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {logs.length > 0 && (
          <section className={styles.logsSection}>
            <div className={styles.sectionHeader}>RECOVERED LOGS</div>
            {logs.map(log => <LoreLog key={log.id} log={log} />)}
          </section>
        )}

        {devMode && (
          <section className={styles.devPanel}>
            <div className={styles.panelHeader}>[ DEVELOPER MODE ]</div>
            <p className={styles.bodyText}>
              <strong>Design decision:</strong> Personnel file framing keeps the horror aesthetic
              while making the About section immediately navigable. All real information is surface-level —
              no reading required to find role or skills. The lore log adds depth for curious visitors
              without hiding anything critical.
            </p>
          </section>
        )}

      </div>
    </main>
  )
}
