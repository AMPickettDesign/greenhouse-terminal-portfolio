import { useSanity } from '../context/SanityContext'
import LoreLog from '../components/layout/LoreLog'
import { getLogsForLocation } from '../data/loreLogs'
import styles from './PageShared.module.css'
import equipStyles from './Equipment.module.css'

const CATEGORIES = [
  {
    id: 'design',
    label: 'DESIGN',
    items: ['UI/UX Design', 'Graphic Design', 'Visual Communication', 'Wireframing & Prototyping', 'Branding & Identity Design', 'Visual Storytelling', 'Style Guide & System Design', 'Accessibility (WCAG)'],
  },
  {
    id: 'tools',
    label: 'TOOLS',
    items: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Unity', 'Procreate'],
  },
  {
    id: 'frontend',
    label: 'FRONTEND',
    items: ['HTML / CSS', 'JavaScript', 'React', 'Vite'],
  },
  {
    id: 'development',
    label: 'DEVELOPMENT',
    items: ['Python', 'Tauri', 'Electron', 'Git / GitHub', 'GitHub Actions'],
  },
  {
    id: 'ai',
    label: 'AI',
    items: ['Anthropic Claude API', 'AI/Emergent Design Concepts', 'AI-Assisted Workflows'],
  },
];

export default function Equipment() {
  const { devMode } = useSanity()
  const logs = getLogsForLocation('equipment')

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        <header className={styles.pageHeader}>
          <div className={styles.pageCode}>SEC-04 / EQUIPMENT STORAGE</div>
          <h1 className={styles.pageTitle}>Tools & Skills</h1>
        </header>

        <div className={equipStyles.equipGrid}>
          {CATEGORIES.map(cat => (
            <div key={cat.label} className={styles.panel}>
              <div className={styles.panelHeader}>{cat.label}</div>
              <ul className={styles.tagList}>
                {cat.items.map(item => (
                  <li key={item} className={styles.tag}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
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
              <strong>Design decision:</strong> Skills as "equipment storage" avoids the tired
              skill-bar anti-pattern. Categories group by domain rather than fake proficiency
              percentages — a more honest representation of capability.
            </p>
          </section>
        )}

      </div>
    </main>
  )
}
