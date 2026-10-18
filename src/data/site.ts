export const site = {
  phone: '+370 700 77015',
  phoneHref: 'tel:+37070077015',
  email: 'info@pazinimo-medis.lt',
  ga4: 'G-PMXJ553E9Y',
  logoDark: 'https://pazinimomedis.lt/wp-content/uploads/2026/02/Be-pavadinimo-1920-x-776-piks.-1.svg',
  logoWhite: 'https://pazinimomedis.lt/wp-content/uploads/2026/02/Pazinimo_medis_Mokykla_White.svg',
  campuses: {
    vg: { name: 'Vilnius, K. Kalinausko g. 13', city: 'vilnius' },
    vp: { name: 'Vilnius, Ozo g. 37', city: 'vilnius' },
    vk: { name: 'Vilnius, Pievų g. 4', city: 'vilnius' },
    k: { name: 'Kaunas, Vilties g. 2', city: 'kaunas' },
  },
  campaign: {
    enabled: true,
    slug: 'summer-camp',
    // The banner links to a standalone landing page with its own URL and form ID.
  },
};

// Homepage video divider. Drop the files in public/video and set the paths here.
// Recommended: 30s loop, 1920x1080, H.264 MP4 under 8 MB, no audio. Optional WebM and poster image.
export const divider = {
  mp4: '' as string, // e.g. '/video/life-at-pazinimo-medis.mp4'
  webm: '' as string,
  poster: '' as string, // e.g. '/video/life-at-pazinimo-medis.jpg'
};
