import { defineConfig } from 'astro/config';

// Static build for Netlify. Two languages live under /en/ and /lt/.
// The root page sends visitors to the default language (see src/pages/index.astro).
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  site: 'https://pazinimo-medis.netlify.app'
});
