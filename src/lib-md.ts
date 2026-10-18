const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(?<!\*)\*(?!\*)(.+?)\*/g, '<em>$1</em>');

export function parseMd(raw: string) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  let body = raw;
  if (m) {
    body = m[2];
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  const out: string[] = [];
  let list: string[] = [];
  let quote: string[] = [];
  const flush = () => {
    if (list.length) { out.push('<ul>' + list.map((l) => `<li>${inline(l)}</li>`).join('') + '</ul>'); list = []; }
    if (quote.length) { out.push('<blockquote>' + quote.map((q) => `<p>${inline(q)}</p>`).join('') + '</blockquote>'); quote = []; }
  };
  for (const line of body.split('\n')) {
    const l = line.trimEnd();
    if (!l.trim()) { flush(); continue; }
    let x;
    if ((x = l.match(/^(#{2,3})\s+(.*)$/))) { flush(); out.push(`<h${x[1].length}>${inline(x[2])}</h${x[1].length}>`); }
    else if ((x = l.match(/^[-*]\s+(.*)$/))) { if (quote.length) flush(); list.push(x[1]); }
    else if ((x = l.match(/^>\s?(.*)$/))) { if (list.length) flush(); quote.push(x[1]); }
    else { flush(); out.push(`<p>${inline(l)}</p>`); }
  }
  flush();
  return { meta, html: out.join('\n') };
}
