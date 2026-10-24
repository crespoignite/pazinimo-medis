// Reads each recent article page on pazinimomedis.lt and stores its cover photo (og:image).
// Runs before every build. If the site cannot be reached, the previous results are kept.
import fs from 'node:fs';
const out = new URL('../src/data/news-images.json', import.meta.url);
const news = JSON.parse(fs.readFileSync(new URL('../src/data/news.json', import.meta.url), 'utf8'));
let have = {};
try { have = JSON.parse(fs.readFileSync(out, 'utf8')); } catch {}
const LIMIT = 15;
const get = async (url) => {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
  try { const r = await fetch(url, { signal: ctl.signal, headers: { 'user-agent': 'Mozilla/5.0 PazinimoMedisBuild' } }); return r.ok ? await r.text() : ''; }
  catch { return ''; } finally { clearTimeout(t); }
};
let found = 0;
await Promise.all(news.slice(0, LIMIT).map(async (n) => {
  if (have[n.slug]) return;
  const html = await get(n.url);
  const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (m) { have[n.slug] = m[1]; found++; }
}));
fs.writeFileSync(out, JSON.stringify(have, null, 1) + '\n');
console.log(`news images: ${Object.keys(have).length} known, ${found} new`);
