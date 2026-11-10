import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Pause, Play } from '@phosphor-icons/react'
import { contact } from '../data.js'
import { useHeroScene } from './heroScene.js'

const NAME = ['Mihai', 'Constantin']
// Phones end the widening at normal width so the name can be set larger (see .hero__name).
const STRETCH = matchMedia('(max-width: 600px)').matches ? '100%' : '125%'

export default function Hero({ ready }) {
  const ref = useRef(null)
  const skyRef = useRef(null)
  const bloomRef = useRef(null)
  const [paused, setPaused] = useState(false)
  useHeroScene({ skyRef, bloomRef, heroRef: ref, ready, paused })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0.15])

  const rise = (delay) => ({
    initial: { y: '110%' },
    animate: ready ? { y: '0%' } : undefined,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay },
  })

  return (
    <section className="hero" id="top" ref={ref}>
      <canvas ref={skyRef} className="hero__sky" aria-hidden="true" />
      <canvas ref={bloomRef} className="hero__bloom" aria-hidden="true" />
      <motion.div className="wrap hero__inner" style={{ y, opacity: fade }}>
        <h1 className="hero__name" aria-label={NAME.join(' ')}>
          {NAME.map((word, line) => (
            <span className="mask" key={word} aria-hidden="true">
              <motion.span
                className="mask__inner"
                initial={{ fontStretch: '62%' }}
                animate={ready ? { fontStretch: STRETCH } : undefined}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.35 + line * 0.12 }}
              >
                {word.split('').map((ch, i) => (
                  <motion.span className="hero__char" key={i} {...rise(0.15 + line * 0.12 + i * 0.035)}>
                    {ch}
                  </motion.span>
                ))}
              </motion.span>
            </span>
          ))}
        </h1>
        <div className="hero__foot">
          <span className="mask">
            <motion.p className="hero__lede mask__inner" {...rise(0.75)}>
              Full-stack and cloud software engineer in Timișoara. I build apps end to end, from Spring Boot services to AWS, and write C++ at Nokia.
            </motion.p>
          </span>
          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
          >
            <a className="btn btn--solid" href="#work">See projects</a>
            <a className="btn btn--line" href={`mailto:${contact.email}`}>Email me</a>
            <button
              className="btn btn--line hero__pause"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? 'Play background animation' : 'Pause background animation'}
            >
              {paused ? <Play size={18} weight="bold" aria-hidden="true" /> : <Pause size={18} weight="bold" aria-hidden="true" />}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
