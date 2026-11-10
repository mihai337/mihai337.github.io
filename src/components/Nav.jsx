import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { List, X, DownloadSimple } from '@phosphor-icons/react'
import { contact } from '../data.js'
import { lenis } from '../scroll.js'

const links = [
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Stack', '#stack'],
  ['Contact', '#contact'],
]

export function Glyph() {
  return (
    <svg className="nav__glyph" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" fill="#15181d" />
      <g fill="#ffc93c">
        <circle cx="10" cy="16" r="4" />
        <circle cx="14.5" cy="12.5" r="5.5" />
        <circle cx="19.5" cy="15.5" r="4.5" />
        <rect x="6" y="15" width="17" height="5" rx="2.5" />
      </g>
    </svg>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState('top')
  const { scrollY } = useScroll()

  // Out of the way while reading down, back as soon as you scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setState(y < 80 ? 'top' : y > prev ? 'hidden' : 'shown')
  })

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    lenis?.stop()
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [open])

  return (
    <header className="nav" data-state={open ? 'shown' : state}>
      <div className="wrap nav__bar">
        <a className="nav__mark" href="#top" aria-label="Mihai Constantin, back to top">
          <Glyph />
          <span>Mihai Constantin</span>
        </a>
        <nav className="nav__links" aria-label="Main">
          {links.map(([label, href]) => (
            <a className="nav__link" href={href} key={href}>{label}</a>
          ))}
          <a className="btn btn--line" href={contact.cv} download>
            <DownloadSimple size={18} weight="bold" aria-hidden="true" />
            Download CV
          </a>
        </nav>
        <button className="btn btn--line nav__menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>
          <List size={18} weight="bold" aria-hidden="true" />
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <button className="btn btn--line menu__close" onClick={() => setOpen(false)} autoFocus style={{ '--b': 'var(--alu)', color: 'var(--alu)' }}>
              <X size={18} weight="bold" aria-hidden="true" />
              Close
            </button>
            <nav className="wrap menu__links" aria-label="Menu">
              {links.map(([label, href], i) => (
                <span className="mask" key={href}>
                  <motion.a
                    className="mask__inner"
                    href={href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.06 }}
                  >
                    {label}
                  </motion.a>
                </span>
              ))}
            </nav>
            <div className="wrap">
              <a className="btn btn--line" href={contact.cv} download style={{ '--b': 'var(--alu)', color: 'var(--alu)' }}>
                <DownloadSimple size={18} weight="bold" aria-hidden="true" />
                Download CV
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
