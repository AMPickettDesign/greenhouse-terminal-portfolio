import styles from './Briefing.module.css'

/**
 * Briefing
 * Full-screen terminal dossier shown on first visit after boot sequence.
 * Sets localStorage key 'ghf-briefing-seen' on dismiss.
 */
export default function Briefing({ onEnter }) {
  const handleEnter = () => {
    localStorage.setItem('ghf-briefing-seen', 'true')
    onEnter()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.content}>

        <header className={styles.header}>
          <div className={styles.title}>GREENHOLLOW RESEARCH FACILITY — OPERATIVE BRIEFING</div>
          <div className={styles.clearance}>CLEARANCE LEVEL: VISITOR — ACCESS GRANTED</div>
        </header>

        <div className={styles.body}>
          <p className={styles.intro}>
            You have entered the Greenhollow Research Facility personnel archive.
            This system contains the recovered work, records, and field notes of
            operative A.M. PICKETT — Graphic Designer &amp; Creative Technologist.
          </p>

          <div className={styles.sectionLabel}>TO NAVIGATE THE FACILITY:</div>

          <ul className={styles.navList}>
            <li><span className={styles.navCode}>SEC-00 LOBBY</span> — facility overview and entry point</li>
            <li><span className={styles.navCode}>SEC-01 PERSONNEL</span> — operative profile and credentials</li>
            <li><span className={styles.navCode}>SEC-02 EXPERIMENT LOGS</span> — completed and active projects</li>
            <li><span className={styles.navCode}>SEC-03 SYSTEMS LAB</span> — interactive design components</li>
            <li><span className={styles.navCode}>SEC-04 EQUIPMENT</span> — skills and tools on record</li>
            <li><span className={styles.navCode}>SEC-05 COMMUNICATIONS</span> — establish contact</li>
          </ul>

          <div className={styles.separator} />

          <p className={styles.note}>
            Some records have been redacted. Locate the eraser tool in the Systems Lab to recover classified information.
          </p>

          <p className={styles.warning}>
            Proceed with caution. Some systems are unstable.
          </p>

          <button className={styles.enterBtn} onClick={handleEnter}>
            [ ENTER FACILITY ]
          </button>
        </div>
      </div>
    </div>
  )
}
