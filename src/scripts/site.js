// Consent, analytics, A/B test and lead forms. No tracking runs unless the visitor accepts.
const body = document.body;
const GA = body.dataset.ga;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
let consent = store.get('pzm_consent');

function loadGA() {
  if (!GA || window.__gaLoaded) return;
  window.__gaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const s = document.createElement('script');
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('consent', 'default', { analytics_storage: 'granted' });
  gtag('config', GA, { anonymize_ip: true });
}
function track(name, params = {}) {
  if (consent === 'yes' && window.gtag) window.gtag('event', name, { lang: body.dataset.lang, ...params });
}

// ---- A/B test: floating button. A = Book a visit, B = Ask us a question. Assigned only with consent.
function variant() {
  if (consent !== 'yes') return 'A';
  let v = store.get('pzm_ab_float');
  if (v !== 'A' && v !== 'B') { v = Math.random() < 0.5 ? 'A' : 'B'; store.set('pzm_ab_float', v); }
  return v;
}
function applyVariant() {
  const v = variant();
  const btn = document.getElementById('float-book');
  if (btn && v === 'B') { btn.href = btn.dataset.hrefB; btn.textContent = btn.dataset.labelB; }
  document.querySelectorAll('input[name="ab_variant"]').forEach((i) => (i.value = consent === 'yes' ? v : ''));
  if (consent === 'yes' && window.gtag) {
    window.gtag('set', 'user_properties', { float_variant: v });
    window.gtag('event', 'ab_exposure', { experiment: 'float_button', variant: v });
  }
  return v;
}

function init() {
  if (consent === 'yes') loadGA();
  applyVariant();
}
const bar = document.getElementById('consent');
if (bar && consent !== 'yes' && consent !== 'no') bar.hidden = false;
bar?.addEventListener('click', (e) => {
  const b = e.target.closest('[data-consent]'); if (!b) return;
  consent = b.dataset.consent; store.set('pzm_consent', consent); bar.hidden = true;
  if (consent === 'yes') { loadGA(); applyVariant(); }
});
init();

document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-cta]'); if (!a) return;
  const extra = a.id === 'float-book' ? { variant: variant() } : {};
  track('cta_click', { cta: a.dataset.cta, href: a.getAttribute('href'), ...extra });
});

// ---- Lead forms (Netlify Forms)
document.querySelectorAll('form[data-lead]').forEach((form) => {
  const q = new URLSearchParams(location.search);
  const set = (n, v) => { const i = form.querySelector(`[name="${n}"]`); if (i && v) i.value = v; };
  set('lang', body.dataset.lang); set('page', location.pathname);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => set(k, q.get(k)));
  const topic = q.get('q'); if (topic) { const m = form.querySelector('textarea'); if (m && !m.value) m.dataset.topic = topic; set('faq_topic', topic); }
  let started = false;
  form.addEventListener('input', () => { if (!started) { started = true; track('form_start', { form: form.name }); } });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const status = form.querySelector('[data-status]');
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; status.className = 'status'; status.textContent = form.dataset.sending;
    try {
      const data = new URLSearchParams(new FormData(form));
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString() });
      if (!r.ok) throw new Error(String(r.status));
      track('form_sent', { form: form.name, variant: form.querySelector('[name="ab_variant"]')?.value || '' });
      location.href = form.dataset.thanks;
    } catch {
      btn.disabled = false; status.className = 'status err'; status.textContent = form.dataset.error;
    }
  });
});
