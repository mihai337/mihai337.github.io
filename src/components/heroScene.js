import { useEffect, useRef } from 'react'
import { gsap } from '../scroll.js'

// The hero's symbol: a live cumulus in a late-afternoon sky, and a branch of golden autumn leaves.

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'
const FRAG = `
precision highp float;
uniform vec2 uRes, uC, uWind;
uniform float uT, uS, uForm;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p;a*=.46;}return s*1.2;}
float lobe(vec2 r,vec2 c,vec2 s,float w){vec2 d=(r-c)/s;return w*exp(-dot(d,d));}

// height of the cloud field: three big lobes on a flat base, eroded by billowing noise
float field(vec2 p){
  vec2 q=p+.05*vec2(fbm(p*2.3+uT*.03),fbm(p*2.3+9.-uT*.02));
  vec2 r=(q-uC)/uS;
  float body=lobe(r,vec2(-.27,-.1),vec2(.24,.2),.95)+lobe(r,vec2(-.02,.1),vec2(.27,.3),1.15)
            +lobe(r,vec2(.27,-.04),vec2(.25,.23),.95)+lobe(r,vec2(0.,-.2),vec2(.56,.12),.8);
  body*=smoothstep(-.4,-.25,r.y)*uForm;
  float billow=fbm(q*3.1+vec2(uT*.03,-uT*.01));
  float puff=1.-abs(2.*noise(q*7.+vec2(uT*.04,0.))-1.); // ridged: the cauliflower tops of a cumulus
  float haze=smoothstep(.56,.9,fbm(q*vec2(1.2,2.4)+vec2(uT*.016+3.,1.)))*.55;
  return body+(billow-.5)*.66+(puff-.55)*.16+haze;
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=vec2(uv.x*uRes.x/uRes.y,uv.y)+uWind;
  vec3 sky=mix(vec3(.80,.87,.93),vec3(.36,.58,.87),smoothstep(.15,1.,uv.y));
  sky=mix(sky,vec3(1.,.89,.72),smoothstep(.6,.2,uv.y)*.6);

  float h=field(p);
  vec2 sun=normalize(vec2(-.5,.85));
  float lit=clamp(.6+(h-field(p+sun*.05))*2.3,0.,1.);
  float d=smoothstep(.42,.53,h);
  vec3 shade=mix(vec3(.68,.76,.90),vec3(.95,.91,.87),smoothstep(.15,.6,lit));
  vec3 cloud=mix(shade,vec3(1.,.99,.95),smoothstep(.42,.9,lit));
  vec3 col=mix(sky,cloud,d);

  // the hero dissolves into the page's ground colour
  col=mix(vec3(.925,.933,.941),col,smoothstep(.02,.34,uv.y));
  gl_FragColor=vec4(col,1.);
}`

function startSky(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
  if (!gl) return null // the hero's CSS gradient stays as the fallback
  const shader = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
    return s
  }
  const prog = gl.createProgram()
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.bindAttribLocation(prog, 0, 'a')
  gl.linkProgram(prog)
  gl.useProgram(prog)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  const u = Object.fromEntries(['uRes', 'uC', 'uWind', 'uT', 'uS', 'uForm'].map((n) => [n, gl.getUniformLocation(prog, n)]))
  return {
    // clouds are soft, so half resolution looks the same at a quarter of the cost
    resize(w, h) {
      canvas.width = Math.max(1, Math.round(w * 0.6))
      canvas.height = Math.max(1, Math.round(h * 0.6))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u.uRes, canvas.width, canvas.height)
    },
    draw({ t, form, wind, cx, cy, size }) {
      gl.uniform1f(u.uT, t)
      gl.uniform1f(u.uForm, form)
      gl.uniform1f(u.uS, size)
      gl.uniform2f(u.uC, cx, cy)
      gl.uniform2f(u.uWind, wind, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
  }
}

// ---------- the branch ----------

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function sprite(size, paint) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  g.translate(size / 2, size / 2)
  paint(g)
  return c
}

// A ginkgo leaf: a notched fan on a long stem, base at the bottom of the sprite.
function ginkgo(edge, core) {
  return sprite(176, (g) => {
    g.strokeStyle = core
    g.lineWidth = 2.4
    g.lineCap = 'round'
    g.beginPath()
    g.moveTo(0, 80)
    g.quadraticCurveTo(3, 44, 0, 8)
    g.stroke()
    const grad = g.createRadialGradient(0, 10, 4, 0, 10, 88)
    grad.addColorStop(0, core)
    grad.addColorStop(0.55, edge)
    grad.addColorStop(1, edge)
    g.shadowColor = 'rgba(90,50,10,0.28)'
    g.shadowBlur = 6
    g.shadowOffsetY = 2
    g.beginPath()
    g.moveTo(0, 12)
    g.quadraticCurveTo(-30, -4, -66, -34)
    g.bezierCurveTo(-58, -64, -26, -78, -6, -71)
    g.lineTo(0, -46)
    g.lineTo(6, -71)
    g.bezierCurveTo(26, -78, 58, -64, 66, -34)
    g.quadraticCurveTo(30, -4, 0, 12)
    g.fillStyle = grad
    g.fill()
    g.save()
    g.clip()
    g.shadowColor = 'transparent'
    g.strokeStyle = 'rgba(150,84,10,0.26)'
    g.lineWidth = 1
    for (let i = -11; i <= 11; i++) {
      const a = (i / 11) * 1.12
      g.beginPath()
      g.moveTo(0, 12)
      g.lineTo(Math.sin(a) * 96, 12 - Math.cos(a) * 96)
      g.stroke()
    }
    g.restore()
  })
}

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, a, b) => Math.min(Math.max(v, a), b)
const backOut = (t) => 1 + 2.9 * (t - 1) ** 3 + 1.9 * (t - 1) ** 2
const bez = ([a, b, c, d], t) => {
  const m = 1 - t
  return [
    m * m * m * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t * t * t * d[0],
    m * m * m * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t * t * t * d[1],
  ]
}

// One spine with forking twigs, leaves placed along them. Seeded: same tree every load.
function grow(w, h, top, bottom, portrait) {
  const r = rng(20260)
  const band = bottom - top
  const unit = clamp(w * 0.066, 58, 100)
  const limit = bottom - unit * 0.9 // nothing hangs low enough to reach the buttons
  const P = portrait
    ? [[w + 30, top + band * 0.68], [w * 0.74, top + band * 0.66], [w * 0.5, top + band * 0.4], [w * 0.12, top + band * 0.1]]
    : [[w + 40, limit - h * 0.06], [w * 0.86, limit - h * 0.1], [w * 0.74, h * 0.4], [w * 0.56, h * 0.23]]
  const limbs = [{ pts: P, w0: portrait ? 15 : 26, w1: 2.5, start: 0, dur: 0.56, amp: 12, seed: 0, parent: null, at: 0 }]
  const items = []
  // leaves hang from their stems; a few reach outward instead
  const place = (limb, t, side, front) => {
    const a = Math.min(t, 0.97)
    const [x0, y0] = bez(limb.pts, a)
    const [x1, y1] = bez(limb.pts, a + 0.03)
    items.push({
      limb, t, front,
      rot: r() > 0.72
        ? Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2 + side * (0.6 + r() * 0.5)
        : Math.PI + side * (0.15 + r() * 0.75) + (r() - 0.5) * 0.5,
      size: unit * (0.78 + r() * 0.5),
      sprite: Math.floor(r() * 3),
      seed: r() * 6.28,
      start: limb.start + limb.dur * t + r() * 0.06,
    })
  }

  const fork = (parent, t, len, side, depth) => {
    const [bx, by] = bez(parent.pts, t)
    const [nx, ny] = bez(parent.pts, Math.min(t + 0.04, 1))
    const base = Math.atan2(ny - by, nx - bx)
    const spread = 0.62 + r() * 0.4
    // a twig that would reach the buttons or the nav forks to the other side instead
    const reach = by + Math.sin(base + side * spread) * len
    if (reach > limit || reach < 80 + unit * 0.9) side = -side
    const dir = base + side * spread
    const ex = bx + Math.cos(dir) * len
    const ey = by + Math.sin(dir) * len
    const limb = {
      pts: [[bx, by], [lerp(bx, ex, 0.35), lerp(by, ey, 0.35) + side * len * 0.1], [lerp(bx, ex, 0.7), lerp(by, ey, 0.7) - side * len * 0.06], [ex, ey]],
      w0: depth ? 4 : 8, w1: 1.4,
      start: parent.start + parent.dur * t, dur: 0.17,
      amp: 10, seed: r() * 6.28, parent, at: t,
    }
    limbs.push(limb)
    const n = depth ? 4 : 5
    for (let i = 0; i < n; i++) place(limb, 0.42 + (i / n) * 0.58, i % 2 ? 1 : -1, r() > 0.28)
    place(limb, 1, 0, true)
    if (!depth && r() > 0.25) fork(limb, 0.45 + r() * 0.2, len * 0.62, -side, 1)
  }

  const main = limbs[0]
  const count = portrait ? 6 : 10
  for (let i = 0; i < count; i++) {
    const t = 0.16 + (i / count) * 0.8
    fork(main, t, (portrait ? band * 0.24 : h * 0.2) * (1.05 - t * 0.5), i % 2 ? 1 : -1, 0)
  }
  for (let i = 0; i < 6; i++) place(main, 0.7 + i * 0.05, i % 2 ? 1 : -1, true)
  place(main, 1, 0, true)
  return { limbs, items: items.sort((a, b) => a.start - b.start) }
}

export function useHeroScene({ skyRef, bloomRef, heroRef, ready, paused }) {
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    if (!ready) return
    const hero = heroRef.current
    const name = hero.querySelector('.hero__name')
    const foot = hero.querySelector('.hero__foot')
    const bloom = bloomRef.current
    const ctx = bloom.getContext('2d')
    const sky = startSky(skyRef.current)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const fresh = [ginkgo('#ffd34d', '#f0a01e'), ginkgo('#ffc93c', '#e58a12'), ginkgo('#f7a93a', '#cf6a14')]
    const deep = [ginkgo('#e8ae32', '#b9761a'), ginkgo('#dc9a2a', '#a8631a'), ginkgo('#d98a2e', '#9c5416')]

    let w = 0, h = 0, tree = { limbs: [], items: [] }, dpr = 1, cloud = { cx: 0, cy: 0, size: 1 }, floor = 0
    let visible = true, wx = 0, wv = 0, time = 0, skyAt = 0, windSky = 0, px = -9999, py = -9999
    const s = { T: reduce ? 1 : 0, form: reduce ? 1 : 0.15 }
    const falling = Array.from({ length: 24 }, () => ({ live: false, x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, size: 0, ph: 0 }))

    const layout = () => {
      w = hero.clientWidth
      h = hero.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      bloom.width = w * dpr
      bloom.height = h * dpr
      sky?.resize(w, h)
      // offsets, not rects: the text block is transformed while scrolling
      const inner = name.offsetParent
      const nameBottom = inner.offsetTop + name.offsetTop + name.offsetHeight
      const footTop = inner.offsetTop + foot.offsetTop
      const portrait = w < h
      floor = footTop
      tree = grow(w, h, nameBottom - (portrait ? 10 : 70), footTop - (portrait ? 14 : 26), portrait)
      const aspect = w / h
      cloud = portrait
        ? { cx: aspect * 0.5, cy: 1 - (nameBottom + (footTop - nameBottom) * 0.3) / h, size: aspect * 1.25 }
        : { cx: aspect * 0.44, cy: 0.56, size: 1.15 }
      render(performance.now(), true)
    }

    const disp = (limb, t) => {
      const sw = (wx * 1.4 + Math.sin(time * 0.9 + limb.seed) * 0.32) * limb.amp * t * t
      const up = limb.parent ? disp(limb.parent, limb.at) : [0, 0]
      return [up[0] + sw * 0.55, up[1] + sw]
    }

    const drawLimb = (limb) => {
      const g = clamp((s.T - limb.start) / limb.dur, 0, 1)
      if (g <= 0) return
      const n = 26
      const left = []
      const right = []
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * g
        const [x0, y0] = bez(limb.pts, t)
        const [x1, y1] = bez(limb.pts, Math.min(t + 0.01, 1))
        const [dx, dy] = disp(limb, t)
        const a = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2
        const half = lerp(limb.w0, limb.w1, t / Math.max(g, 0.001) * 0.4 + t * 0.6) / 2
        left.push([x0 + dx + Math.cos(a) * half, y0 + dy + Math.sin(a) * half])
        right.push([x0 + dx - Math.cos(a) * half, y0 + dy - Math.sin(a) * half])
      }
      ctx.beginPath()
      left.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](x, y))
      right.reverse().forEach(([x, y]) => ctx.lineTo(x, y))
      ctx.closePath()
      ctx.fillStyle = '#2a2628'
      ctx.fill()
    }

    const drawItem = (it) => {
      const b = clamp((s.T - it.start) / 0.14, 0, 1)
      if (b <= 0) return
      const k = backOut(b)
      const [bx, by] = bez(it.limb.pts, it.t)
      const [dx, dy] = disp(it.limb, it.t)
      const x = bx + dx
      const y = by + dy
      // leaves stay on the twig and turn away from the cursor
      const ax = px - x
      const ay = py - y
      const dist = Math.hypot(ax, ay) || 1
      const cross = (Math.sin(it.rot) * ay + Math.cos(it.rot) * ax) / dist
      const lean = -cross * Math.max(0, 1 - dist / 170) * 0.5
      const size = it.size * k
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(it.rot + lean + wx * 0.12 + Math.sin(time * 1.6 + it.seed) * 0.09)
      ctx.drawImage((it.front ? fresh : deep)[it.sprite], -size / 2, -size * 0.95, size, size)
      ctx.restore()
    }

    const spawn = (p, x, y) => {
      p.live = true
      p.x = x
      p.y = y
      p.vx = -24 + (Math.random() - 0.5) * 30
      p.vy = 22 + Math.random() * 30
      p.rot = Math.random() * 6.28
      p.vr = (Math.random() - 0.5) * 2.4
      p.size = 24 + Math.random() * 20
      p.img = Math.floor(Math.random() * 3)
      p.ph = Math.random() * 6.28
    }
    const randomLeaf = () => {
      const open = tree.items.filter((it) => s.T > it.start + 0.14)
      return open.length ? open[Math.floor(Math.random() * open.length)] : null
    }

    const stepFalling = (dt) => {
      for (const p of falling) {
        if (!p.live) {
          if (s.T > 0.7 && Math.random() < dt * 0.4) {
            const it = randomLeaf()
            if (it) spawn(p, ...bez(it.limb.pts, it.t))
          }
          continue
        }
        p.ph += dt * 2.2
        p.x += (p.vx + wx * 90 + Math.sin(p.ph) * 18) * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        if (p.y > floor || p.x < -30 || p.x > w + 30) p.live = false
      }
    }
    const drawFalling = () => {
      for (const p of falling) {
        if (!p.live) continue
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.scale(1, 0.45 + 0.55 * Math.abs(Math.cos(p.ph)))
        ctx.globalAlpha = clamp((floor - p.y) / 60, 0, 0.95)
        ctx.drawImage(fresh[p.img], -p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      }
    }

    function render(now, force) {
      if (sky && (force || now - skyAt > 33)) {
        skyAt = now
        windSky += (clamp(px / Math.max(w, 1) - 0.5, -0.5, 0.5) * (px < -999 ? 0 : 0.03) - windSky) * 0.06
        sky.draw({ t: time, form: s.form, wind: windSky, ...cloud })
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (const it of tree.items) if (!it.front) drawItem(it)
      tree.limbs.forEach(drawLimb)
      for (const it of tree.items) if (it.front) drawItem(it)
      drawFalling()
    }

    const ro = new ResizeObserver(layout)
    ro.observe(hero)
    if (reduce) return () => ro.disconnect()

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(hero)

    const tick = (_, delta) => {
      if (!visible || pausedRef.current) return
      const dt = Math.min(delta / 1000, 1 / 20)
      time += dt
      wv += (-26 * wx - 3 * wv) * dt
      wx += wv * dt
      stepFalling(dt)
      render(performance.now())
    }
    gsap.ticker.add(tick)

    const onMove = (e) => {
      const r = hero.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const dx = px < -999 ? 0 : x - px
      wv += clamp(dx, -40, 40) * 0.05
      // brushing through the branch shakes a leaf loose
      if (Math.abs(dx) > 6) {
        const near = tree.items.find((it) => {
          const [bx, by] = bez(it.limb.pts, it.t)
          return Math.hypot(bx - x, by - y) < 70
        })
        const free = near && falling.find((p) => !p.live)
        if (free) spawn(free, x, y)
      }
      px = x
      py = y
    }
    const onLeave = () => { px = py = -9999 }
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)

    // Boot: the cloud condenses while the branch grows out and its leaves unfurl.
    const boot = gsap.timeline({ delay: 0.3 })
      .to(s, { form: 1, duration: 2.6, ease: 'elastic.out(1, 0.75)' }, 0)
      .to(s, { T: 1, duration: 3.4, ease: 'power1.inOut' }, 0.15)

    return () => {
      ro.disconnect()
      io.disconnect()
      boot.kill()
      gsap.ticker.remove(tick)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
    }
  }, [ready]) // eslint-disable-line react-hooks/exhaustive-deps -- refs are stable, paused is read through a ref
}
