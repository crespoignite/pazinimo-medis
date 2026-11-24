// Section-title highlight: wraps the closing word(s) of a title in a colour block (cobalt, violet, teal),
// the headline device from the 2026 identity. The tone cycles so neighbouring titles differ.
const tones = ['', ' v', ' t'];
let n = 0;
export function hl(text: string): string {
  const m = text.match(/^(.*?)(\s*)([^\s]+?)([?.!,:;…»”"]*)$/s);
  if (!m) return text;
  const words = text.trim().split(/\s+/);
  const take = words.length >= 6 ? 2 : 1;
  const trail = (text.match(/[?.!,:;…»”"]+$/) || [''])[0];
  const core = trail ? text.slice(0, text.length - trail.length) : text;
  const parts = core.trim().split(/\s+/);
  if (parts.length < 2) return text;
  const head = parts.slice(0, parts.length - take).join(' ');
  const tail = parts.slice(parts.length - take).join(' ');
  const tone = tones[n++ % 3];
  return `${head} <span class="mark${tone}">${tail}</span>${trail}`;
}
