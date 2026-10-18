// Lists English keys that have no Lithuanian text yet. Run: npm run i18n:report
import fs from 'node:fs';
const keys = (f) => [...fs.readFileSync(f, 'utf8').matchAll(/^\s*'([^']+)':/gm)].map((m) => m[1]);
const en = keys('src/i18n/en.ts');
const lt = new Set(keys('src/i18n/lt.ts'));
const missing = en.filter((k) => !lt.has(k));
console.log(`UI strings: ${en.length - missing.length} of ${en.length} have Lithuanian text. ${missing.length} still fall back to English.`);
if (process.argv.includes('--list')) console.log(missing.join('\n'));
else console.log('Add --list to print the keys.');
