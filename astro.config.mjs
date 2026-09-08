import { defineConfig } from 'astro/config';

// Σελίδες δοκιμών/προτάσεων (src/dev-pages/): φαίνονται ΜΟΝΟ στο dev server —
// δεν μπαίνουν ποτέ στο build/deploy. Νέα σελίδα δοκιμής = μία γραμμή εδώ.
const DEV_PAGES = ['nea-arxiki', 'neo', 'dokimes-hero', 'dokimes-kartes', 'dokimes-chat', 'dokimes-stil', 'dokimes-aesthetic', 'dokimes-skini', 'dokimes-kapnos', 'dokimes-pisma-efe', 'dokimes-intro', 'dokimes-pisma-hover'];
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
  // Όλο το CSS μπαίνει inline στο HTML: κανένα render-blocking αίτημα stylesheet —
  // η πρώτη ζωγραφιά σε κινητό/αργό δίκτυο γίνεται ένα RTT νωρίτερα (~0,5-0,9 s).
  build: { inlineStylesheets: 'always' },
  // Προφόρτωση εσωτερικών links (hover σε desktop, tap σε κινητό) — στιγμιαία πλοήγηση.
  prefetch: { prefetchAll: true },
});
