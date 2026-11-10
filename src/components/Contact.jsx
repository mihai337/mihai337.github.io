import { useRef } from 'react'
import { ArrowUpRight, DownloadSimple, Phone, WhatsappLogo } from '@phosphor-icons/react'
import { gsap, useGSAP } from '../scroll.js'
import Lines from './Lines.jsx'
import { contact } from '../data.js'

const [user, domain] = contact.email.split('@')

export default function Contact() {
  const ref = useRef(null)

  // The address stretches from condensed to full width as it arrives: the page's last type move.
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.contact__mail', { fontStretch: '62%' }, {
        fontStretch: '100%',
        ease: 'none',
        scrollTrigger: { trigger: '.contact__mail', start: 'top bottom', end: 'top 45%', scrub: 0.5 },
      })
    })
  }, { scope: ref })

  return (
    <footer className="contact" id="contact" ref={ref}>
      <div className="wrap contact__body">
        <Lines lines={['Have a role or a', 'project in mind?']} />
        <a className="contact__mail" href={`mailto:${contact.email}`}>
          {user}<wbr />@{domain}
        </a>
        <div className="contact__links">
          <a className="btn btn--line" href={`tel:${contact.phone}`}>
            <Phone size={18} weight="bold" aria-hidden="true" /> {contact.phoneLabel}
          </a>
          <a className="btn btn--line" href={contact.whatsapp} target="_blank" rel="noreferrer">
            <WhatsappLogo size={18} weight="bold" aria-hidden="true" /> WhatsApp <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a className="btn btn--line" href={contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={18} weight="bold" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
          </a>
          <a className="btn btn--line" href={contact.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={18} weight="bold" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
          </a>
          <a className="btn btn--line" href={contact.cv} download>
            <DownloadSimple size={18} weight="bold" aria-hidden="true" /> Download CV
          </a>
        </div>
      </div>
      <div className="wrap">
        <div className="foot">
          <p>© 2026 Mihai Constantin. Built with React, Framer Motion and GSAP.</p>
          <p className="foot__credits">
            Photos via Wikimedia Commons: Blogtrepreneur (CC BY 2.0), Stevepb (CC0), unknown author (CC0), Simon Waldherr (CC BY 4.0), Joe Mabel (CC BY-SA 4.0).
          </p>
        </div>
      </div>
    </footer>
  )
}
