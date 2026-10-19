// Public documents the school must keep available. Titles are the school's own (Lithuanian) with an English gloss.
// All documents are hosted in public/documents/.
export interface Doc { id: string; title: { lt: string; en: string }; href: string }
export const documents: Doc[] = [
  { id: 'edu-plan-individual', title: { lt: 'Individualus ugdymosi planas 2023–2024 ir 2024–2025 m. m. (III gimnazijos klasė)', en: 'Individual education plan 2023–2024 and 2024–2025 (grade 11)' }, href: '/documents/individualus-ugdymo-planas.pdf' },
  { id: 'menu-kindergarten', title: { lt: 'Darželių, Ozo ir Kauno padalinių valgiaraštis', en: 'Kindergarten menu: Ozo and Kaunas campuses' }, href: '/documents/darzeliu-valgiarastis.pdf' },
  { id: 'menu-gymnasium', title: { lt: 'Gimnazijos valgiaraštis', en: 'Gymnasium menu' }, href: '/documents/gimnazijos-valgiarastis.pdf' },
  { id: 'extras-prices', title: { lt: 'Papildomų paslaugų kainynas 2026–2027 m. m.', en: 'Additional services price list 2026–2027' }, href: '/documents/papildomu-paslaugu-kainynas-2026-2027.pdf' },
  { id: 'e-diary', title: { lt: 'Elektroninio dienyno tvarkymo nuostatai 2026–2027 m. m.', en: 'Electronic diary regulations 2026–2027' }, href: '/documents/elektroninio-dienyno-nuostatai-2026-2027.pdf' },
  { id: 'curriculum-plan', title: { lt: '2025–2026 ir 2026–2027 mokslo metų pradinio, pagrindinio ir vidurinio ugdymo programų ugdymo planas', en: 'Education plan for primary, basic and secondary programmes, 2025–2026 and 2026–2027' }, href: '/documents/ugdymo-planas-2026-2027.pdf' },
  { id: 'bullying', title: { lt: 'Smurto ir patyčių prevencijos ir intervencijos vykdymo tvarkos aprašas', en: 'Violence and bullying prevention and intervention procedure' }, href: '/documents/smurto-ir-patyciu-prevencijos-tvarka.pdf' },
  { id: 'conduct', title: { lt: 'Mokyklos Pažinimo medis mokinių elgesio taisyklės', en: 'Student code of conduct' }, href: '/documents/mokiniu-elgesio-taisykles.pdf' },
];
