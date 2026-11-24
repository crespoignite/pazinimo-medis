export const site = {
  phone: '+370 700 77015',
  phoneHref: 'tel:+37070077015',
  email: 'info@pazinimo-medis.lt',
  ga4: 'G-PMXJ553E9Y',
  // Ad tracking. Leave empty and nothing loads. All three fire only after cookie consent.
  googleAds: '',        // Google Ads tag, e.g. 'AW-123456789'
  googleAdsLabel: '',   // Conversion label for a sent lead (the part after the slash in AW-123456789/AbC-D_efG)
  metaPixel: '',        // Meta (Facebook) Pixel ID, e.g. '1234567890'
  // 2026 identity (Taktika studio). One logo for the whole school: navy on light, white on dark, cobalt as an option.
  logoDark: '/brand/logo-navy.png',
  logoBlue: '/brand/logo-cobalt.png',
  logoWhite: '/brand/logo-white.png',
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

// Background photos for the four joining steps (Visit, Talk, Trial day, Contract).
// Put the files in public/img/steps and set the paths, e.g. '/img/steps/visit.jpg'.
export const stepImages: string[] = ['/photos/step-visit.jpg', '/photos/step-talk.jpg', '/photos/step-trial.jpg', '/photos/step-join.jpg'];
