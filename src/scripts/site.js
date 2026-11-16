// Consent, analytics, A/B test and lead forms. No tracking runs unless the visitor accepts.
const body = document.body;
const GA = body.dataset.ga;          // GA4 measurement id, G-XXXX
const ADS = body.dataset.ads;        // Google Ads tag, AW-XXXX
const ADS_LABEL = body.dataset.adsLabel; // Google Ads conversion label for a sent lead
const PIXEL = body.dataset.pixel;    // Meta (Facebook) Pixel id
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
let consent = store.get('pzm_consent');

// Loads GA4, Google Ads and the Meta Pixel. Runs once, only after consent.
function loadTags() {
  if (window.__tagsLoaded) return;
  window.__tagsLoaded = true;

  // Google tag (gtag.js) drives both GA4 and Google Ads.
  if (GA || ADS) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const s = document.createElement('script');
    s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA || ADS}`;
    document.head.appendChild(s);
    gtag('js', new Date());
    if (GA) gtag('config', GA, { anonymize_ip: true });
    if (ADS) gtag('config', ADS);
  }

  // Meta Pixel.
  if (PIXEL) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
  }
}
function track(name, params = {}) {
  if (consent !== 'yes') return;
  if (GA && window.gtag) window.gtag('event', name, { lang: body.dataset.lang, ...params });
  // A sent lead form is the conversion. Report it to Meta and Google Ads.
  if (name === 'form_sent') {
    if (PIXEL && window.fbq) window.fbq('track', 'Lead', { content_name: params.form || '' });
    if (ADS && ADS_LABEL && window.gtag) window.gtag('event', 'conversion', { send_to: `${ADS}/${ADS_LABEL}` });
  }
}

// ---- A/B test: floating button. A = Book a visit, B = Ask us a question. Assigned only with consent.
// Paused: the button always reads "Book a visit". Set AB_ACTIVE to true to run the test again.
const AB_ACTIVE = false;
function variant() {
  if (!AB_ACTIVE || consent !== 'yes') return 'A';
  let v = store.get('pzm_ab_float');
  if (v !== 'A' && v !== 'B') { v = Math.random() < 0.5 ? 'A' : 'B'; store.set('pzm_ab_float', v); }
  return v;
}
function applyVariant() {
  const v = variant();
  const btn = document.getElementById('float-book');
  if (btn && v === 'B') { btn.href = btn.dataset.hrefB; btn.textContent = btn.dataset.labelB; }
  document.querySelectorAll('input[name="ab_variant"]').forEach((i) => (i.value = AB_ACTIVE && consent === 'yes' ? v : ''));
  if (AB_ACTIVE && consent === 'yes' && window.gtag) {
    window.gtag('set', 'user_properties', { float_variant: v });
    window.gtag('event', 'ab_exposure', { experiment: 'float_button', variant: v });
  }
  return v;
}

function init() {
  if (consent === 'yes') loadTags();
  applyVariant();
}
const bar = document.getElementById('consent');
if (bar && consent !== 'yes' && consent !== 'no') bar.hidden = false;
bar?.addEventListener('click', (e) => {
  const b = e.target.closest('[data-consent]'); if (!b) return;
  consent = b.dataset.consent; store.set('pzm_consent', consent); bar.hidden = true;
  if (consent === 'yes') { loadTags(); applyVariant(); }
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

  // Checkbox groups (school year, campus) write their checked values into a hidden field.
  const groups = form.querySelectorAll('fieldset[data-cbgroup]');
  const syncGroups = () => groups.forEach((fs) => {
    const hid = form.querySelector(`input[type="hidden"][name="${fs.dataset.cbgroup}"]`);
    if (hid) hid.value = [...fs.querySelectorAll('input[type="checkbox"]:checked')].map((c) => c.value).join(', ');
  });

  // Phone: combine the country dial code with the number into the hidden phone field.
  const cc = form.querySelector('.cc');
  const num = form.querySelector('.phone-num');
  const phoneHidden = form.querySelector('input[type="hidden"][name="phone"]');
  const syncPhone = () => { if (phoneHidden) phoneHidden.value = num && num.value.trim() ? `${cc ? cc.value + ' ' : ''}${num.value.trim()}` : ''; };

  const syncAll = () => { syncGroups(); syncPhone(); };
  syncAll();
  form.addEventListener('change', syncAll);

  let started = false;
  form.addEventListener('input', () => { syncPhone(); if (!started) { started = true; track('form_start', { form: form.name }); } });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    syncAll();
    const status = form.querySelector('[data-status]');
    for (const fs of form.querySelectorAll('fieldset[data-cbgroup][data-required]')) {
      if (!fs.querySelector('input[type="checkbox"]:checked')) {
        status.className = 'status err'; status.textContent = form.dataset.pick || form.dataset.error;
        fs.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }
    }
    if (!form.reportValidity()) return;
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
