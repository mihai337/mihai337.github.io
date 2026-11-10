import { useRef } from 'react'
import { gsap, useGSAP } from '../scroll.js'
import Lines from './Lines.jsx'
import { builds, education, courses, languages } from '../data.js'

export default function Builds() {
  const ref = useRef(null)

  // The strip only moves while you scroll, so nothing loops on its own.
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.marquee', { xPercent: 0 }, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      })
    })
  }, { scope: ref })

  return (
    <div ref={ref}>
      <section className="builds" aria-labelledby="builds-title">
        <div className="wrap">
          <Lines id="builds-title" lines={['Other builds']} />
        </div>
        <ul className="marquee">
          {[...builds, ...builds].map((b, i) => (
            <li className="marquee__item" key={i} aria-hidden={i >= builds.length || undefined}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="edu wrap" aria-labelledby="edu-title">
        <div className="edu__main">
          <Lines id="edu-title" lines={['Education']} />
          <ol className="edu__list">
            {education.map((e) => (
              <li className="edu__row" key={e.when}>
                <span className="edu__when">{e.when}</span>
                <p className="edu__school">{e.school}</p>
                <p className="edu__what">{e.what}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="edu__side">
          <div>
            <h3>Courses</h3>
            <ul>{courses.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
          <div>
            <h3>Languages</h3>
            <ul>{languages.map((l) => <li key={l}>{l}</li>)}</ul>
          </div>
          <div>
            <h3>Foundation</h3>
            <p>Physics, electrical engineering and computer architecture.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
