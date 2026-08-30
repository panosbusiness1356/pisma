/**
 * /sitemap.xml — παράγεται στο build από το PAIRS του i18n.ts (ίδια λογική με το llms.txt).
 * Νέα σελίδα με ζευγάρι EL/EN = μία γραμμή στο PAIRS και μπαίνει εδώ μόνη της,
 * με xhtml:link hreflang εναλλακτικές για κάθε ζευγάρι.
 * Demo σελίδες και 404 μένουν εκτός σκόπιμα (noindex).
 */
import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { PAIRS } from '../i18n';

/** Priority ανά ελληνικό path — η αγγλική έκδοση παίρνει −0.1. */
const PRIORITY: Record<string, number> = {
  '/': 1.0,
  '/se-vriskoun/': 0.9,
  '/doulevei-mono-tou/': 0.9,
  '/kritikes/': 0.9,
  '/tablo/': 0.9,
  '/elegxos/': 0.9,
  '/aftokollita/': 0.8,
  '/times/': 0.8,
  '/odigoi/': 0.8,
  '/apotelesmata/': 0.7,
  '/epikoinonia/': 0.6,
};
const prio = (elPath: string): number =>
  PRIORITY[elPath] ?? (elPath.startsWith('/odigoi/') ? 0.7 : 0.8);

const abs = (p: string) => `${SITE.url}${p}`;
const fmt = (n: number) => n.toFixed(1);

const entry = (loc: string, priority: number, elPath: string, enPath: string) => `  <url>
    <loc>${abs(loc)}</loc>
    <priority>${fmt(priority)}</priority>
    <xhtml:link rel="alternate" hreflang="el" href="${abs(elPath)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${abs(enPath)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(elPath)}"/>
  </url>`;

const urls = PAIRS.flatMap(([el, en]) => [
  entry(el, prio(el), el, en),
  entry(en, Math.max(0.1, prio(el) - 0.1), el, en),
]);

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
