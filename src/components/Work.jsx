import { useRef, useState } from 'react'
import { gsap, useGSAP, scrollToY, addSnap } from '../scroll.js'
import Lines from './Lines.jsx'
import { projects } from '../data.js'

const last = projects.length - 1

const vw = (n) => () => (n * window.innerWidth) / 100
const vh = (n) => () => (n * window.innerHeight) / 100

// Where a card sits relative to the active one: waiting deck bottom-right, centre, or flown off top-left.
// Offsets are functions so ScrollTrigger re-measures them on resize.
function pose(d) {
  if (d === 0) return { x: 0, y: 0, rotation: 0, rotationX: 0, rotationY: 0, scale: 1, autoAlpha: 1 }
  if (d > 0) {
    const k = d - 1
    return { x: () => vw(33)() + k * 16, y: () => vh(31)() - k * 12, rotation: 6 + k * 3, rotationX: 10, rotationY: -32, scale: 0.34, autoAlpha: d > 3 ? 0 : 1 }
  }
  return { x: vw(-40), y: vh(-46), rotation: -10, rotationX: 10, rotationY: 32, scale: 0.3, autoAlpha: 0 }
}

function Meta({ p }) {
  return (
    <dl className="work__meta">
      <div><dt>Type</dt><dd>{p.kind}</dd></div>
      <div><dt>Built with</dt><dd>{p.stack}</dd></div>
    </dl>
  )
}

export default function Work() {
  const ref = useRef(null)
  const stRef = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(() => {
    gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray('.work__card')
      const lefts = gsap.utils.toArray('.work__side--l .work__panel')
      const rights = gsap.utils.toArray('.work__side--r .work__panel')
      cards.forEach((c, j) => gsap.set(c, { ...pose(j), zIndex: 40 - j }))
      gsap.set([...lefts.slice(1), ...rights.slice(1)], { autoAlpha: 0, y: 24 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut', duration: 1 },
        scrollTrigger: {
          trigger: '.work__stage',
          start: 'top top',
          end: () => `+=${last * window.innerHeight * 0.9}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.round(self.progress * last)),
        },
      })
      const st = (stRef.current = tl.scrollTrigger)
      const unsnap = addSnap(() => projects.map((_, i) => st.start + (i / last) * (st.end - st.start)))

      for (let s = 1; s <= last; s++) {
        const t = s - 1
        const out = cards[s - 1]
        const inn = cards[s]
        tl.set(inn, { zIndex: 60 }, t).set(out, { zIndex: 50 }, t)
        // incoming card swings in along an arc, outgoing swings away along the mirror arc
        tl.to(inn, {
          keyframes: [
            { x: vw(15), y: vh(12), rotation: 9, rotationX: 14, rotationY: -38, scale: 0.72, autoAlpha: 1, ease: 'power1.in' },
            { ...pose(0), ease: 'power2.out' },
          ],
        }, t)
        tl.to(out, {
          keyframes: [
            { x: vw(-16), y: vh(-14), rotation: -8, rotationX: 14, rotationY: 38, scale: 0.66, ease: 'power1.in' },
            { ...pose(-1), ease: 'power2.out' },
          ],
        }, t)
        cards.forEach((c, j) => {
          if (j < s - 1) tl.to(c, pose(j - s), t)
          if (j > s) tl.to(c, pose(j - s), t)
        })
        tl.set(out, { zIndex: 40 - s }, t + 1)
        tl.to([lefts[s - 1], rights[s - 1]], { autoAlpha: 0, y: -24, duration: 0.4, ease: 'power2.in' }, t + 0.1)
        tl.to([lefts[s], rights[s]], { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, t + 0.5)
      }
      return () => {
        unsnap()
        stRef.current = null
      }
    })
  }, { scope: ref })

  const jump = (i) => {
    const st = stRef.current
    if (st) scrollToY(st.start + (i / last) * (st.end - st.start))
  }

  return (
    <section className="work" id="work" ref={ref} aria-labelledby="work-title">
      <div className="work__stage">
        <Lines id="work-title" className="work__word" lines={['Selected projects']} />

        <div className="work__side work__side--l">
          <div className="work__panels">
            {projects.map((p) => (
              <article className="work__panel" key={p.title}>
                <h3 className="h3">{p.title}</h3>
                <Meta p={p} />
              </article>
            ))}
          </div>
        </div>

        <div className="work__cards">
          {projects.map((p) => (
            <figure className="work__card" key={p.title} style={{ margin: 0 }}>
              <img src={p.img} alt={p.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>

        <div className="work__side work__side--r">
          {projects.map((p) => (
            <div className="work__panel" key={p.title}>
              <p className="work__text">{p.text}</p>
            </div>
          ))}
        </div>

        <nav className="work__index" aria-label="Projects">
          {projects.map((p, i) => (
            <button key={p.title} aria-current={active === i} onClick={() => jump(i)}>{p.title}</button>
          ))}
        </nav>
      </div>

      <div className="work__list wrap">
        <Lines lines={['Selected', 'projects']} />
        {projects.map((p) => (
          <article className="proj" key={p.title}>
            <div className="proj__img"><img src={p.img} alt={p.alt} loading="lazy" decoding="async" /></div>
            <h3 className="h3">{p.title}</h3>
            <Meta p={p} />
            <p className="proj__text">{p.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
