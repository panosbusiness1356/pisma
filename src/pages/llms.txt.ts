/**
 * /llms.txt — «ταυτότητα» του site για AI crawlers (ChatGPT, Claude, Perplexity κ.ά.).
 * Παράγεται στο build από config.ts + pricing.ts + guides.ts — ποτέ ξεπερασμένα στοιχεία.
 */
import type { APIRoute } from 'astro';
import { SITE, ELEGXOS, eur } from '../config';
import { CATEGORIES, PRESETS } from '../data/pricing';
import { GUIDES } from '../data/guides';

const line = (o: { label: string; detail?: string; price: number; type: string }) =>
  `- ${o.label}${o.detail ? ` (${o.detail})` : ''}: ${eur(o.price)} ${o.type === 'monthly' ? 'τον μήνα' : 'εφάπαξ'}`;

const body = `# ${SITE.name}

> ${SITE.tagline}

Η ${SITE.name} είναι στούντιο ψηφιακής παρουσίας και αυτοματοποίησης για ελληνικές
επιχειρήσεις. Φτιάχνει sites, ανεβάζει επιχειρήσεις σε Google και
εργαλεία AI (SEO/GEO/AEO), οργανώνει κριτικές Google και αυτοματοποιεί τη ρουτίνα
του γραφείου. Εξυπηρετεί από κοντά τα νότια προάστια της Αθήνας (Γλυφάδα, Βούλα,
Βάρη-Βουλιαγμένη, Άλιμος, Ελληνικό-Αργυρούπολη, Παλαιό Φάληρο, Νέα Σμύρνη) και
online όλη την Ελλάδα. Κάθε συνεργασία ξεκινά με μέτρηση «πριν», επαναμετριέται
στους 3 μήνες, και τα μηνιαία δεν έχουν συμβόλαιο ή δέσμευση.

Επικοινωνία: ${SITE.email} · ${SITE.url}/epikoinonia/
Δωρεάν αξιολόγηση: «Ο Έλεγχος PISMA» — ${ELEGXOS.minutes} λεπτά, γραπτή αναφορά σε ${ELEGXOS.reportHours} ώρες: ${SITE.url}/elegxos/

## Υπηρεσίες & τιμές (δημόσιες, ίδιες για όλους)

${CATEGORIES.map((c) => `### ${c.title}\n${c.options.map(line).join('\n')}`).join('\n\n')}

### Πακέτα
${PRESETS.map(
  (p) =>
    `- ${p.name} — ${p.tagline}: ${eur(p.bundleOnce)} εφάπαξ${p.bundleMonthly > 0 ? ` + ${eur(p.bundleMonthly)} τον μήνα` : ''}`
).join('\n')}

Πλήρης τιμοκατάλογος με builder πακέτου: ${SITE.url}/times/

## Οδηγοί (δωρεάν άρθρα)

${GUIDES.map((g) => `- [${g.q}](${SITE.url}/odigoi/${g.slug}/): ${g.blurb}`).join('\n')}

## Βασικές σελίδες

- [Ψηφιακή Προβολή](${SITE.url}/se-vriskoun/): site, ορατότητα σε Google & AI, κριτικές
- [Αυτοματοποίηση](${SITE.url}/doulevei-mono-tou/): πληρωμές, εισπράξεις, αναφορές στο αυτόματο
- [Τιμές](${SITE.url}/times/): όλες οι τιμές δημόσια, builder πακέτου
- [Αποτελέσματα](${SITE.url}/apodeixeis/): πώς μετριέται κάθε συνεργασία
- [Ο Έλεγχος PISMA](${SITE.url}/elegxos/): δωρεάν αξιολόγηση ${ELEGXOS.minutes} λεπτών
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
