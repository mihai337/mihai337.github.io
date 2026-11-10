import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, addSnap } from '../scroll.js'
import Lines from './Lines.jsx'
import { layers } from '../data.js'

// Brand icons keep their own colour unless it would vanish on the night ground.
function Icon({ icon }) {
  const hex = parseInt(icon.hex, 16)
  const lum = (0.299 * (hex >> 16) + 0.587 * ((hex >> 8) & 255) + 0.114 * (hex & 255)) / 255
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill={lum < 0.32 ? 'currentColor' : `#${icon.hex}`}>
      <path d={icon.path} />
    </svg>
  )
}

export default function Stack() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(() => {
    gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const last = layers.length - 1
      const st = ScrollTrigger.create({
        trigger: '.stack__stage',
        start: 'top top',
        end: () => `+=${layers.length * window.innerHeight * 0.55}`,
        pin: true,
        onUpdate: (self) => setActive(Math.round(self.progress * last)),
      })
      return addSnap(() => layers.map((_, i) => st.start + (i / last) * (st.end - st.start)))
    })

    // The page drops into night while the stack is on screen, then back to day.
    // Created after the pin so its range includes the pinned scroll.
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => { document.documentElement.dataset.scene = self.isActive ? 'night' : 'day' },
    })
  }, { scope: ref })

  return (
    <section className="stack" id="stack" ref={ref} aria-labelledby="stack-title">
      <div className="wrap stack__stage">
        <div className="stack__viz" aria-hidden="true">
          <div className="slabs">
            {layers.map((l, i) => (
              <div
                key={l.name}
                className={`slab${i === active ? ' is-on' : i < active ? ' is-past' : ''}`}
                style={{ '--i': i }}
              >
                {l.name}
              </div>
            ))}
          </div>
        </div>

        <div className="stack__side">
          <Lines id="stack-title" lines={['Every layer', 'of the stack.']} />
          <div className="stack__panels">
            {layers.map((l, i) => (
              <article className={`layer${i === active ? ' is-on' : ''}`} key={l.name}>
                <h3 className="layer__name">{l.name}</h3>
                <p className="layer__text">{l.text}</p>
                <ul className="tools" aria-label={`${l.name} tools`}>
                  {l.tools.map(([label, icon]) => (
                    <li className="tool" key={label}>
                      {icon && <Icon icon={icon} />}
                      {label}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
