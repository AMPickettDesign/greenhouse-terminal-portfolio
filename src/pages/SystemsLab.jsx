import { useState } from 'react'
import { useSanity } from '../context/SanityContext'
import HUD from '../components/game-ui/HUD'
import Inventory from '../components/game-ui/Inventory'
import Dialogue from '../components/game-ui/Dialogue'
import Journal from '../components/game-ui/Journal'
import AccessibilityPanel from '../components/game-ui/AccessibilityPanel'
import LoreLog from '../components/layout/LoreLog'
import { getLogsForLocation } from '../data/loreLogs'
import styles from './SystemsLab.module.css'
import pageStyles from './PageShared.module.css'

const DEMOS = ['HUD', 'INVENTORY', 'DIALOGUE', 'JOURNAL', 'ACCESSIBILITY']

export default function SystemsLab() {
  const { sanity, devMode } = useSanity()
  const [activeDemo, setActiveDemo] = useState('HUD')
  const logs = getLogsForLocation('systems-lab')

  return (
    <main className={pageStyles.page}>
      <div className={pageStyles.container}>

        <header className={pageStyles.pageHeader}>
          <div className={pageStyles.pageCode}>SEC-03 / SYSTEMS LAB</div>
          <h1 className={pageStyles.pageTitle}>UI Systems</h1>
        </header>

        <p className={pageStyles.bodyText}>
          Interactive demonstrations of the Greenhollow UI system. All components
          respond to the global sanity level — adjust the slider in the Accessibility
          panel or the navigation bar to observe state changes across every demo.
        </p>

        {/* Demo selector */}
        <nav className={styles.demoNav} aria-label="UI demos">
          {DEMOS.map(demo => (
            <button
              key={demo}
              className={[styles.demoTab, activeDemo === demo ? styles.active : ''].join(' ')}
              onClick={() => setActiveDemo(demo)}
              aria-pressed={activeDemo === demo}
            >
              {demo}
            </button>
          ))}
        </nav>

        {/* Sanity context note */}
        <div className={styles.sanityBar}>
          <span>GLOBAL SANITY:</span>
          <span style={{
            color: sanity > 60 ? 'var(--sage)' : sanity > 30 ? 'var(--amber)' : 'var(--danger-bright)',
            fontWeight: 'bold',
          }}>
            {Math.round(sanity)}%
          </span>
          <span className={styles.sanityHint}>
            — use the Accessibility tab or nav bar to change
          </span>
        </div>

        {/* Active demo */}
        <section aria-label={`${activeDemo} demo`}>
          {activeDemo === 'HUD'           && <HUD interactive />}
          {activeDemo === 'INVENTORY'     && <Inventory interactive />}
          {activeDemo === 'DIALOGUE'      && <Dialogue interactive />}
          {activeDemo === 'JOURNAL'       && <Journal interactive />}
          {activeDemo === 'ACCESSIBILITY' && <AccessibilityPanel />}
        </section>

        {/* Dev notes per demo */}
        {devMode && (
          <section className={pageStyles.devPanel}>
            <div className={pageStyles.panelHeader}>[ DEVELOPER MODE — {activeDemo} ]</div>
            {activeDemo === 'HUD' && (
              <p className={pageStyles.bodyText}>
                <strong>HUD:</strong> Health and stamina readings become unreliable at sanity &lt; 40.
                The displayed value drifts from the real value — a key game mechanic where
                the UI itself becomes an unreliable narrator. ARIA labels always report the
                true value for screen readers.
              </p>
            )}
            {activeDemo === 'INVENTORY' && (
              <p className={pageStyles.bodyText}>
                <strong>Inventory:</strong> Item descriptions corrupt progressively. Icons become
                question marks. Item names pull from a corruption pool. The 4×4 grid is a
                deliberate design constraint — scarcity creates meaning for each slot.
              </p>
            )}
            {activeDemo === 'DIALOGUE' && (
              <p className={pageStyles.bodyText}>
                <strong>Dialogue:</strong> Typewriter effect speed accelerates at low sanity.
                Choice labels corrupt at high corruption. The system uses a simple node graph —
                each choice maps to a named state key in the conversation object.
              </p>
            )}
            {activeDemo === 'JOURNAL' && (
              <p className={pageStyles.bodyText}>
                <strong>Journal:</strong> Entry order shuffles when sanity crosses thresholds
                (40 and 20). Content blur increases with corruption. This mechanic deliberately
                undermines the player's ability to reconstruct chronology — making unreliability
                a storytelling tool.
              </p>
            )}
            {activeDemo === 'ACCESSIBILITY' && (
              <p className={pageStyles.bodyText}>
                <strong>Accessibility:</strong> High contrast mode swaps colour tokens at the
                CSS variable level — no component changes needed. Reduced motion disables all
                animation/glitch intervals in JS. The sanity slider is the primary design
                demonstration control for this portfolio.
              </p>
            )}
          </section>
        )}

        {logs.length > 0 && (
          <section className={pageStyles.logsSection}>
            <div className={pageStyles.sectionHeader}>RECOVERED LOGS</div>
            {logs.map(log => <LoreLog key={log.id} log={log} />)}
          </section>
        )}

      </div>
    </main>
  )
}
