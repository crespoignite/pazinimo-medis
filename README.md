# Pažinimo medis website

Astro static site for Netlify. English and Lithuanian under /en/ and /lt/.

- `npm install`, `npm run dev`, `npm run build`
- `npm run i18n:report` shows UI strings still missing Lithuanian (they fall back to English)
- Floating button A/B test is paused (`AB_ACTIVE` in `src/scripts/site.js`). The button always reads "Book a visit".
- Search hiding: `X-Robots-Tag` noindex header in `netlify.toml` and a robots meta in `Layout.astro`. Remove both at launch.
- Default language: `defaultLang` in `src/i18n/index.ts` and the "/" redirect in `netlify.toml`. Currently `lt` (switched from `en`).
- Pipedrive: form submissions sync to Pipedrive directly via `netlify/functions/submission-created.mjs` (Person via API v2, Lead + Note via v1). No Make webhook needed. Set `PIPEDRIVE_API_TOKEN` in Netlify env vars (only required var; uses the generic `api.pipedrive.com` host). Optional: `PIPEDRIVE_DOMAIN` (company subdomain) and `LEAD_OWNER_ID`. Preview and branch deploys show the demo campaign banner (`PUBLIC_DEMO_BANNER`).
- Clubs data: edit `scripts/build-clubs.py`, then run `python3 scripts/build-clubs.py`.
- Content to confirm before launch: prices, class size (16 vs 16 to 18), proof source link, team, methodologies, prospectus file, photos, logo file, Lithuanian copy for general text.
