import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pisma.gr',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
});
