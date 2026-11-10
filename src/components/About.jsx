import { useRef } from 'react'
import { gsap, useGSAP } from '../scroll.js'

const TEXT =
  'I build software end to end: React and Flutter front ends, Spring Boot and Node.js services, and the Terraform and Docker that put them on AWS. At Nokia I write and test C++, and I am most at home owning a feature from the first design to the deploy.'

const facts = [
  ['Now', 'Working student, software engineer at Nokia'],
  ['Studying', 'M.Eng., Digital Media and Web Development, Politehnica University of Timișoara'],
  ['Focus', 'Full-stack and backend, with cloud and DevOps'],
]

export default function About() {
  const ref = useRef(null)

  // Words ink in as the paragraph scrolls past, so it reads at the speed you scroll.
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '.about__word',
        { opacity: 0.24 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: '.about__text', start: 'top 78%', end: 'bottom 42%', scrub: true },
        },
      )
    })
  }, { scope: ref })

  return (
    <section className="about wrap" ref={ref} aria-label="About">
      <p className="about__text">
        {TEXT.split(' ').map((word, i) => (
          <span key={i}>
            <span className="about__word">{word}</span>{' '}
          </span>
        ))}
      </p>
      <dl className="about__facts">
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
