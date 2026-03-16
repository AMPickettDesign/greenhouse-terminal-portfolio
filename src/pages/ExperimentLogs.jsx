import { useSanity } from '../context/SanityContext'
import LoreLog from '../components/layout/LoreLog'
import { getLogsForLocation } from '../data/loreLogs'
import styles from './PageShared.module.css'

// ── ADD YOUR REAL PROJECTS HERE ────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'exp-001',
    title: 'PROJECT NAME ONE',
    subtitle: 'Brief one-line description',
    desc: 'Replace this with a real project description. What did you make, what problem did it solve, what was interesting about the design process?',
    tags: ['UI Design', 'React', 'Accessibility'],
    status: 'COMPLETE',
    link: '#', // replace with live link or case study URL
  },
  {
    id: 'exp-002',
    title: 'PROJECT NAME TWO',
    subtitle: 'Brief one-line description',
    desc: 'Replace this with a real project description. Keep it lore-adjacent — think of each project as an "experiment" that was conducted in the facility.',
    tags: ['Product Design', 'Figma'],
    status: 'COMPLETE',
    link: '#',
  },
  {
    id: 'exp-003',
    title: 'PROJECT NAME THREE',
    subtitle: 'Brief one-line description',
    desc: 'Another case study. Add as many as you need — the grid handles any number cleanly.',
    tags: ['Electron', 'Tauri', 'Python'],
    status: 'ONGOING',
    link: '#',
  },
]
// ── END EDIT ZONE ──────────────────────────────────────────────────────────

const STATUS_COLORS = {
  COMPLETE: 'var(--sage)',
  ONGOING:  'var(--amber)',
  REDACTED: 'var(--danger-bright)',
}

export default function ExperimentLogs() {
  const { devMode } = useSanity()
  const logs = getLogsForLocation('experiment-logs')

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        <header className={styles.pageHeader}>
          <div className={styles.pageCode}>SEC-02 / EXPERIMENT LOGS</div>
          <h1 className={styles.pageTitle}>Case Studies</h1>
        </header>

        <div className={styles.projectGrid}>
          {PROJECTS.map(project => (
            <a
              key={project.id}
              href={project.link}
              className={styles.projectCard}
              target={project.link !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
            >
              <div className={styles.projectCardCode}>
                {project.id.toUpperCase()} ·{' '}
                <span style={{ color: STATUS_COLORS[project.status] || 'var(--ash)' }}>
                  {project.status}
                </span>
              </div>
              <div className={styles.projectCardTitle}>{project.title}</div>
              <p className={styles.projectCardDesc}>{project.desc}</p>
              <div className={styles.projectCardTags}>
                {project.tags.map(t => (
                  <span key={t} className={styles.projectCardTag}>{t}</span>
                ))}
              </div>
            </a>
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
              <strong>Design decision:</strong> "Experiment Logs" reframes projects as research
              artifacts. Each card is scannable — status, title, description, tags — before
              clicking through. The lore log placed here references anomalous growth data,
              thematically echoing unexpected outcomes in design work.
            </p>
          </section>
        )}

      </div>
    </main>
  )
}
