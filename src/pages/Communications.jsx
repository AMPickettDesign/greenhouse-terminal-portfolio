import { useSanity } from '../context/SanityContext'
import GlitchText from '../components/effects/GlitchText'
import LoreLog from '../components/layout/LoreLog'
import { getLogsForLocation } from '../data/loreLogs'
import styles from './PageShared.module.css'
import commsStyles from './Communications.module.css'

const CONTACT = {
  email: 'AshleyPickett46@gmail.com',
  github: 'https://github.com/AMPickettDesign',
  linkedin: 'https://www.linkedin.com/in/ashley-pickett-37444394/',
  other: '',
};

export default function Communications() {
  const { sanity, devMode } = useSanity()
  const logs = getLogsForLocation('communications')

  const corrupted = sanity < 35

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        <header className={styles.pageHeader}>
          <div className={styles.pageCode}>SEC-05 / COMMUNICATIONS</div>
          <h1 className={styles.pageTitle}>
            <GlitchText text="Contact" tag="span" />
          </h1>
          {corrupted && (
            <p className={commsStyles.warning}>
              ⚠ TRANSMISSION DEGRADED — SIGNAL UNSTABLE
            </p>
          )}
        </header>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>OPEN CHANNEL — ASHLEY</div>
          <p className={styles.bodyText}>
            Available for freelance work, collaboration, and conversation.
            Response time is usually within a few days — the facility's
            communication arrays are mostly functional.
          </p>

          <div className={commsStyles.links}>
            {CONTACT.email && (
              <a href={`mailto:${CONTACT.email}`} className={commsStyles.contactLink}>
                <span className={commsStyles.linkLabel}>EMAIL</span>
                <span className={commsStyles.linkValue}>{CONTACT.email}</span>
                <span className={commsStyles.linkArrow} aria-hidden="true">→</span>
              </a>
            )}
            {CONTACT.github && (
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className={commsStyles.contactLink}>
                <span className={commsStyles.linkLabel}>GITHUB</span>
                <span className={commsStyles.linkValue}>{CONTACT.github.replace('https://', '')}</span>
                <span className={commsStyles.linkArrow} aria-hidden="true">→</span>
              </a>
            )}
            {CONTACT.linkedin && (
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className={commsStyles.contactLink}>
                <span className={commsStyles.linkLabel}>LINKEDIN</span>
                <span className={commsStyles.linkValue}>{CONTACT.linkedin.replace('https://', '')}</span>
                <span className={commsStyles.linkArrow} aria-hidden="true">→</span>
              </a>
            )}
            {CONTACT.other && (
              <a href={CONTACT.other} target="_blank" rel="noopener noreferrer" className={commsStyles.contactLink}>
                <span className={commsStyles.linkLabel}>OTHER</span>
                <span className={commsStyles.linkValue}>{CONTACT.other.replace('https://', '')}</span>
                <span className={commsStyles.linkArrow} aria-hidden="true">→</span>
              </a>
            )}
          </div>
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
              <strong>Design decision:</strong> The communications page gets the most dramatic
              lore log (the corrupted final transmission). It rewards visitors who reach this
              page last. The contact links remain fully functional and clear regardless of sanity
              level — information accessibility is never compromised by the aesthetic.
            </p>
          </section>
        )}

      </div>
    </main>
  )
}
