// Ring scroll story and closing arcs, ported from the concept. GSAP + ScrollTrigger, with a static fallback.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';

function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
type Ring = { el: SVGCircleElement; c: number; a: number; v: number; s: number; o: number; tx: number; ty: number };
function buildRings(g: Element, o: { n: number; c: number; r0: number; step: number; sw: number; colors: (i: number) => string; seed: number }) {
  const R = rng(o.seed); const out: Ring[] = [];
  for (let i = 0; i < o.n; i++) {
    const r = o.r0 + i * o.step;
    const el = document.createElementNS(NS, 'circle');
    el.setAttribute('cx', String(o.c)); el.setAttribute('cy', String(o.c)); el.setAttribute('r', String(r));
    el.setAttribute('fill', 'none'); el.setAttribute('stroke', o.colors(i)); el.setAttribute('stroke-width', String(o.sw));
    el.setAttribute('stroke-linecap', 'round'); el.setAttribute('pathLength', '100');
    const capPad = (o.sw / (2 * Math.PI * r)) * 100;
    const gap = 16 + R() * 16 + capPad * 2;
    el.setAttribute('stroke-dasharray', `${100 - gap} ${gap}`);
    g.appendChild(el);
    out.push({ el, c: o.c, a: R() * 360, v: (R() < .5 ? -1 : 1) * (2 + R() * 5), s: 1, o: 1, tx: 0, ty: 0 });
  }
  return out;
}
const paint = (st: Ring) => { st.el.setAttribute('transform', `translate(${st.c + st.tx} ${st.c + st.ty}) rotate(${st.a}) scale(${st.s}) translate(${-st.c} ${-st.c})`); st.el.setAttribute('opacity', st.o.toFixed(3)); };

// Pointer origin for the circle-fill hover on buttons
document.addEventListener('pointerover', (e) => {
  const b = (e.target as Element).closest?.('.cx-btn') as HTMLElement | null; if (!b) return;
  const r = b.getBoundingClientRect();
  b.style.setProperty('--x', `${e.clientX - r.left}px`); b.style.setProperty('--y', `${e.clientY - r.top}px`);
});

// Closing: the outer arcs drift out like the brandbook's opened symbol
const flight = document.querySelector('#flight g');
if (flight) {
  const cols = ['#2b8cfb', '#ffffff', '#00bfbf', '#785dd9', '#97bdfb'];
  [[400, 400, 120, 70, 210], [440, 360, 200, 40, 20], [470, 330, 280, 55, 300], [520, 300, 360, 48, 120], [580, 260, 440, 36, 200]].forEach(([cx, cy, r, len, rot], i) => {
    const el = document.createElementNS(NS, 'circle');
    el.setAttribute('cx', String(cx)); el.setAttribute('cy', String(cy)); el.setAttribute('r', String(r));
    el.setAttribute('stroke', cols[i]); el.setAttribute('stroke-width', String(18 - i * 2));
    el.setAttribute('pathLength', '100'); el.setAttribute('stroke-dasharray', `${len} ${100 - len}`);
    el.setAttribute('transform', `rotate(${rot} ${cx} ${cy})`); el.setAttribute('class', 'fl');
    flight.appendChild(el);
  });
  if (!reduce) gsap.fromTo('#flight .fl', { scale: .7, transformOrigin: '30% 70%', opacity: 0 }, { scale: 1, opacity: 1, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '.cclose', start: 'top 80%', end: 'top 20%', scrub: .6 } });
}

// Ring scroll: one driver p maps to the stage, the ring colours, the photo and the grade
const section = document.getElementById('years');
if (section) {
  const PAL = [['#00bfbf', '#97bdfb', '#785dd9'], ['#97bdfb', '#00bfbf', '#2b8cfb'], ['#00bfbf', '#2b8cfb', '#97bdfb'], ['#2b8cfb', '#785dd9', '#00bfbf'], ['#785dd9', '#ffffff', '#2b8cfb'], ['#ffffff', '#2b8cfb', '#785dd9']];
  const yrG = document.getElementById('yrRings')!;
  const yr = buildRings(yrG, { n: 3, c: 360, r0: 196, step: 30, sw: 16, colors: (i) => PAL[0][i], seed: 21 });
  const photos = [...document.querySelectorAll('#yrPhotos image')];
  const chs = [...document.querySelectorAll('#chapters li')];
  const now = document.getElementById('yrNow')!, bar = document.getElementById('yrBar')!;
  const Y = 17;
  const chapterOf = (k: number) => (k < 4 ? 0 : k === 4 ? 1 : k < 9 ? 2 : k < 13 ? 3 : 4);
  const labelOf = (k: number) => (k < 4 ? section.dataset.kg! : k === 4 ? section.dataset.g0! : section.dataset.grade!.replace('{n}', String(k - 4)));
  let lastCh = -1;
  const setP = (p: number) => {
    const fl = p > .9;
    const k = Math.min(Y - 1, Math.floor(Math.min(p / .9, .999) * Y));
    const ch = fl ? 5 : chapterOf(k);
    now.textContent = fl ? section.dataset.flight! : labelOf(k);
    bar.style.transform = `scaleX(${p.toFixed(3)})`;
    if (ch !== lastCh) {
      chs.forEach((li, i) => li.classList.toggle('on', i === ch));
      photos.forEach((im, i) => gsap.to(im, { attr: { opacity: i === ch ? 1 : 0 }, duration: .6, overwrite: true }));
      yr.forEach((st, i) => gsap.to(st.el, { stroke: PAL[ch][i], duration: .8, delay: i * .08, ease: 'power2.out', overwrite: true }));
      lastCh = ch;
    }
  };
  yr.forEach(paint);
  if (!reduce) {
    section.classList.remove('static');
    setP(0);
    ScrollTrigger.create({ trigger: section, start: 'top top', end: () => '+=' + Math.round(innerHeight * 3.6), pin: true, scrub: .6, invalidateOnRefresh: true, onUpdate: (s) => setP(s.progress) });
    // idle rotation, only while visible
    let live = true;
    new IntersectionObserver(([e]) => { live = e.isIntersecting; }, { rootMargin: '80px' }).observe(section);
    gsap.ticker.add((_t, dms) => { if (!live) return; const dt = Math.min(dms, 50) / 1000; yr.forEach((st) => { st.a += st.v * dt; paint(st); }); });
  } else {
    section.classList.add('static');
    yr.forEach((st, i) => { st.el.setAttribute('stroke', PAL[5][i]); paint(st); });
    photos.forEach((im, i) => im.setAttribute('opacity', i === 5 ? '1' : '0'));
  }
}
