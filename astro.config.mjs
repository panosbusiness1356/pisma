import { defineConfig } from 'astro/config';

// Σελίδες δοκιμών/προτάσεων (src/dev-pages/): φαίνονται ΜΟΝΟ στο dev server —
// δεν μπαίνουν ποτέ στο build/deploy. Νέα σελίδα δοκιμής = μία γραμμή εδώ.
const DEV_PAGES = ['nea-arxiki', 'neo', 'dokimes-hero', 'dokimes-kartes', 'dokimes-chat'];
const devPages = {
  name: 'pisma-dev-pages',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      for (const p of DEV_PAGES) injectRoute({ pattern: `/${p}`, entrypoint: `./src/dev-pages/${p}.astro` });
    },
  },
};

export default defineConfig({
  site: 'https://pisma.gr',
  integrations: [devPages],
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  // Προφόρτωση εσωτερικών links (hover σε desktop, tap σε κινητό) — στιγμιαία πλοήγηση.
  prefetch: { prefetchAll: true },
});
