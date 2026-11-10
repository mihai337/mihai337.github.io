import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'

const DIGITS = '0123456789'.split('')

// Counts to 100 while the variable font loads, so the kinetic type never flashes a fallback.
export default function Preloader({ onDone }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    let alive = true
    const count = animate(0, 100, {
      duration: 1.7,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => document.fonts.ready.then(() => alive && setTimeout(onDone, 200)),
    })
    return () => {
      alive = false
      count.stop()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- runs once; onDone only flips state

  return (
    <motion.div
      className="preloader"
      role="status"
      aria-label="Loading"
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="wrap preloader__row">
        <p className="preloader__name">Mihai Constantin</p>
        <div className="odometer" aria-hidden="true">
          {String(n).padStart(3, '0').split('').map((d, i) => (
            <span className="odometer__col" key={i}>
              <span className="odometer__strip" style={{ transform: `translateY(-${d * 10}%)` }}>
                {DIGITS.map((x) => <span key={x}>{x}</span>)}
              </span>
            </span>
          ))}
        </div>
      </div>
      <span className="preloader__bar" style={{ transform: `scaleX(${n / 100})` }} />
    </motion.div>
  )
}
