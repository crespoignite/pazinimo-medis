// Public documents the school must keep available. Titles are the school's own (Lithuanian) with an English gloss.
// `href` points at the school's current website. When the PDFs are hosted here, put them in public/documents/ and change the href to '/documents/<file>.pdf'.
const old = 'https://pazinimomedis.lt/wp-content/uploads/';
export interface Doc { id: string; title: { lt: string; en: string }; href: string }
export const documents: Doc[] = [
  { id: 'edu-plan-individual', title: { lt: 'Individualus ugdymosi planas 2023–2024 ir 2024–2025 m. m. (III gimnazijos klasė)', en: 'Individual education plan 2023–2024 and 2024–2025 (grade 11)' }, href: old + '2026/02/Individualus_ugdymo_planas-1.pdf' },
  { id: 'menu-kindergarten', title: { lt: 'Darželių, Ozo ir Kauno padalinių valgiaraštis', en: 'Kindergarten menu: Ozo and Kaunas campuses' }, href: old + '2026/02/Darzeliu-Ozo-ir-Kauno-padaliniu-valgiarastis-2024-2025-m.m.-.pdf' },
  { id: 'menu-gymnasium', title: { lt: 'Gimnazijos valgiaraštis', en: 'Gymnasium menu' }, href: old + '2026/02/Gimnazijos-valgiarastis-2024-2025-m.-2-pietu-variantai-2-1-1.pdf' },
  { id: 'extras-prices', title: { lt: 'Papildomų paslaugų kainynas 2026–2027 m. m.', en: 'Additional services price list 2026–2027' }, href: old + '2026/03/papildomu-paslaugu-kainynas-2026-2027-m-m.pdf' },
  { id: 'e-diary', title: { lt: 'Elektroninio dienyno tvarkymo nuostatai 2026–2027 m. m.', en: 'Electronic diary regulations 2026–2027' }, href: old + '2026/08/Pazinimo_medis_Elektroninio_dienyno_tvarkymo_nuostatai_2026-2207m.m.-pasirasyta.pdf' },
  { id: 'curriculum-plan', title: { lt: '2025–2026 ir 2026–2027 mokslo metų pradinio, pagrindinio ir vidurinio ugdymo programų ugdymo planas', en: 'Education plan for primary, basic and secondary programmes, 2025–2026 and 2026–2027' }, href: old + '2026/08/Pazinimo_medis_BUP-2026-2027m.m.-pasirasyta.pdf' },
  { id: 'bullying', title: { lt: 'Smurto ir patyčių prevencijos ir intervencijos vykdymo tvarkos aprašas', en: 'Violence and bullying prevention and intervention procedure' }, href: old + '2026/10/SMURTO-IR-PATYCIU-PREVENCIJOS-IR-INTERVENCIJOS-VYKDYMO-TVARKOS-APRASAS.pdf' },
  { id: 'conduct', title: { lt: 'Mokyklos Pažinimo medis mokinių elgesio taisyklės', en: 'Student code of conduct' }, href: old + '2026/10/Mokyklos-Pazinimo-medis-mokiniu-elgesio-taisykles.pdf' },
];
