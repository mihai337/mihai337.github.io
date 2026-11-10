import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { startSmoothScroll, ScrollTrigger } from './scroll.js'
import Preloader from './components/Preloader.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Work from './components/Work.jsx'
import Stack from './components/Stack.jsx'
import Builds from './components/Builds.jsx'
import Contact from './components/Contact.jsx'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [ready, setReady] = useState(reducedMotion)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !ready)
    if (!ready) return
    ScrollTrigger.refresh()
    if (!reducedMotion) return startSmoothScroll()
  }, [ready])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#main">Skip to content</a>
      <AnimatePresence>{!ready && <Preloader key="preloader" onDone={() => setReady(true)} />}</AnimatePresence>
      <Nav />
      <main id="main">
        <Hero ready={ready} />
        <About />
        <Experience />
        <Work />
        <Stack />
        <Builds />
      </main>
      <Contact />
    </MotionConfig>
  )
}
