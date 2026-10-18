// Copied from the school's live website (2026-2027). To be confirmed before launch.
export interface Row { key: string; labelKey?: string; label?: string; monthly: number; upfront: number; instalments?: number }
export const kindergarten = {
  preschool: [
    { key: 'full', labelKey: 'pr.fullDay', monthly: 535, upfront: 6099, instalments: 12 },
    { key: 'half', labelKey: 'pr.halfDay', monthly: 375, upfront: 4275, instalments: 12 },
  ],
  preprimary: [
    { key: 'a-full', labelKey: 'pr.preprimary.a', sub: 'pr.fullDay', monthly: 765, upfront: 7267.5, instalments: 10 },
    { key: 'a-half', labelKey: 'pr.preprimary.a', sub: 'pr.halfDay', monthly: 535, upfront: 5082.5, instalments: 10 },
    { key: 'b-full', labelKey: 'pr.preprimary.b', sub: 'pr.fullDay', monthly: 730, upfront: 6935, instalments: 10 },
    { key: 'b-half', labelKey: 'pr.preprimary.b', sub: 'pr.halfDay', monthly: 510, upfront: 4845, instalments: 10 },
  ],
};
export const school = {
  vilnius: [
    { key: 'v0-4', grades: '0–4', monthly: 765, upfront: 7267.5 },
    { key: 'v-cam', labelKey: 'pr.cambridge', monthly: 830, upfront: 7885 },
    { key: 'v5-8', grades: '5–8', monthly: 840, upfront: 7980 },
    { key: 'v9-12', grades: '9–12', monthly: 895, upfront: 8502.5 },
  ],
  kaunas: [
    { key: 'k0-4', grades: '0–4', monthly: 730, upfront: 6935 },
    { key: 'k5-6', grades: '5–6', monthly: 810, upfront: 7695 },
  ],
};
export const extras = { enrolment: 450, afterSchool: 145 };
export const eur = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const startingFrom = { kindergarten: 375, school: 730 };
