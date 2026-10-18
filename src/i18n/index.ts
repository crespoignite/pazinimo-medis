import en from './en';
import lt from './lt';

export const locales = ['en', 'lt'] as const;
export type Lang = (typeof locales)[number];
/** Change to 'lt' at launch. Also change the "/" redirect in netlify.toml. */
export const defaultLang: Lang = 'en';

const dict: Record<Lang, Record<string, string>> = { en, lt };

export function useT(lang: Lang) {
  return (key: string, vars: Record<string, string | number> = {}): string => {
    let s = dict[lang][key] ?? dict.en[key] ?? key;
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** Pick the language variant of a {en, lt} object, falling back to English. */
export function pick<T>(o: { en: T; lt?: T } | undefined, lang: Lang): T {
  return ((o as any)?.[lang] || (o as any)?.en) as T;
}

export function localePath(lang: Lang, path = ''): string {
  const p = path.replace(/^\/+/, '');
  return `/${lang}/${p}${p && !p.endsWith('/') ? '/' : ''}`;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'lt' : 'en';
}
