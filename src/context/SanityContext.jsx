import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SanityContext = createContext(null)

export function SanityProvider({ children }) {
  const [sanity, setSanity] = useState(100)
  const [devMode, setDevMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769)
  const [bootSeen, setBootSeenState] = useState(
    () => sessionStorage.getItem('greenhollow-boot-seen') === 'true'
  )

  const setBootSeen = useCallback((val) => {
    setBootSeenState(val)
    if (val) sessionStorage.setItem('greenhollow-boot-seen', 'true')
    else sessionStorage.removeItem('greenhollow-boot-seen')
  }, [])

  // Track viewport width for isMobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 769)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Apply reduce-effects class on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('reduce-effects')
    } else {
      document.body.classList.remove('reduce-effects')
    }
    return () => document.body.classList.remove('reduce-effects')
  }, [isMobile])

  // Push sanity value into CSS custom property on root
  useEffect(() => {
    document.documentElement.style.setProperty('--sanity', sanity)
  }, [sanity])

  // Sync high contrast class on body
  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast)
  }, [highContrast])

  // Gradually drift sanity down over time (optional — can disable)
  // Comment this out if you want manual-only control
  // useEffect(() => {
  //   const drift = setInterval(() => {
  //     setSanity(prev => Math.max(0, prev - 0.5))
  //   }, 3000)
  //   return () => clearInterval(drift)
  // }, [])

  const clampedSet = useCallback((val) => {
    setSanity(Math.min(100, Math.max(0, Number(val))))
  }, [])

  // Sanity tier helpers
  const tier = sanity >= 75 ? 'stable'
              : sanity >= 50 ? 'stressed'
              : sanity >= 25 ? 'deteriorating'
              : 'critical'

  // Scramble a string based on current sanity (used by GlitchText)
  const glitchChars = '!@#$%^&*░▒▓█▄▀■□▪▫'
  const scramble = useCallback((text) => {
    if (sanity > 60) return text
    const intensity = (60 - sanity) / 60
    return text.split('').map(char => {
      if (char === ' ') return char
      return Math.random() < intensity * 0.4
        ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
        : char
    }).join('')
  }, [sanity])

  return (
    <SanityContext.Provider value={{
      sanity,
      setSanity: clampedSet,
      tier,
      devMode,
      setDevMode,
      highContrast,
      setHighContrast,
      reducedMotion,
      setReducedMotion,
      scramble,
      isMobile,
      bootSeen,
      setBootSeen,
    }}>
      {children}
    </SanityContext.Provider>
  )
}

export function useSanity() {
  const ctx = useContext(SanityContext)
  if (!ctx) throw new Error('useSanity must be used inside SanityProvider')
  return ctx
}
