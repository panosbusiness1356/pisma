import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pisma.gr',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  // Προφόρτωση εσωτερικών links (hover σε desktop, tap σε κινητό) — στιγμιαία πλοήγηση.
  prefetch: { prefetchAll: true },
});
