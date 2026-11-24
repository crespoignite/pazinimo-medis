// Section titles sit fully inside a colour block (cobalt, violet or teal), the headline device from the 2026 identity.
// The tone cycles so neighbouring titles differ.
const tones = ['', ' v', ' t'];
let n = 0;
export function hl(text: string): string {
  return `<span class="mark${tones[n++ % 3]}">${text.trim()}</span>`;
}
