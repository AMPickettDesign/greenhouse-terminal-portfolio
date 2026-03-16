import { useSanity } from '../context/SanityContext'
import LoreLog from '../components/layout/LoreLog'
import { getLogsForLocation } from '../data/loreLogs'
import styles from './PageShared.module.css'
import equipStyles from './Equipment.module.css'

// ── EDIT: Add your tools, skills, and design systems here ─────────────────
const CATEGORIES = [
  {
    label: 'DESIGN',
    items: ['Figma', 'Accessibility (WCAG)', 'Design Systems', 'User Research'],
  },
  {
    label: 'FRONTEND',
    items: ['React', 'HTML / CSS', 'JavaScript', 'Electron', 'Tauri', 'Vite'],
  },
  {
    label: 'BACKEND',
    items: ['Python', 'Node.js', 'REST APIs'],
  },
  {
    label: 'AI',
    items: ['Anthropic Claude API', 'Ollama', 'Local Models'],
  },
  {
    label: 'TOOLING',
    items: ['Git / GitHub', 'GitHub Actions', 'VS Code'],
  },
]
// ── END EDIT ZONE ──────────────────────────────────────────────────────────

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
