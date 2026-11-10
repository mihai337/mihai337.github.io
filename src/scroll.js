import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export let lenis = null

// Snap points for pinned scenes. ScrollTrigger's own snap fights Lenis, so we settle through Lenis:
// once scrolling rests inside a scene's range, glide to its nearest step.
const snaps = new Set()
export function addSnap(getPoints) {
  snaps.add(getPoints)
  return () => snaps.delete(getPoints)
}
let settle = 0
function snapWhenResting() {
  clearTimeout(settle)
  settle = setTimeout(() => {
    const y = lenis.scroll
    for (const get of snaps) {
      const pts = get()
      if (!pts.length || y < pts[0] - 1 || y > pts[pts.length - 1] + 1) continue
      const near = pts.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a))
      if (Math.abs(near - y) > 2) lenis.scrollTo(near, { duration: 0.7, easing: (t) => 1 - (1 - t) ** 3 })
      return
    }
  }, 140)
}

export function startSmoothScroll() {
  lenis = new Lenis({ anchors: true, lerp: 0.09 })
  lenis.on('scroll', ScrollTrigger.update)
  lenis.on('scroll', snapWhenResting)
  const tick = (t) => lenis.raf(t * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    clearTimeout(settle)
    gsap.ticker.remove(tick)
    lenis.destroy()
    lenis = null
  }
}

export function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { duration: 1.1 })
  else window.scrollTo({ top: y })
}

export { gsap, ScrollTrigger, useGSAP }
