/**
 * /llms.txt — «ταυτότητα» του site για AI crawlers (ChatGPT, Claude, Perplexity κ.ά.).
 * Παράγεται στο build από config.ts + pricing.ts + guides.ts — ποτέ ξεπερασμένα στοιχεία.
 */
import type { APIRoute } from 'astro';
import { SITE, ELEGXOS, eur } from '../config';
import { CATEGORIES } from '../data/pricing';
import { GUIDES } from '../data/guides';
import { GUIDES_EN } from '../data/guides.en';

const line = (o: { label: string; detail?: string; price: number; type: string }) =>
  `- ${o.label}${o.detail ? ` (${o.detail})` : ''}: ${eur(o.price)} ${o.type === 'monthly' ? 'τον μήνα' : 'εφάπαξ'}`;

const body = `# ${SITE.name}

> ${SITE.tagline}

Η ${SITE.name} είναι στούντιο ψηφιακής παρουσίας και αυτοματοποίησης για
επιχειρήσεις. Φτιάχνει sites και e-shop σε Shopify (και αναλαμβάνει τη μηνιαία
διαχείριση καταστημάτων Shopify), ανεβάζει επιχειρήσεις σε Google και
εργαλεία AI (SEO/GEO/AEO), οργανώνει κριτικές Google, βγάζει φωτογραφίες και
βίντεο στον χώρο της επιχείρησης για site/Google/social, και αυτοματοποιεί τη
ρουτίνα του γραφείου. Εξυπηρετεί από κοντά τα νότια προάστια της Αθήνας (Γλυφάδα, Βούλα,
Βάρη-Βουλιαγμένη, Άλιμος, Ελληνικό-Αργυρούπολη, Παλαιό Φάληρο, Νέα Σμύρνη) και
online όλη την Ελλάδα. Κάθε συνεργασία ξεκινά με μέτρηση «πριν», επαναμετριέται
στους 3 μήνες, και τα μηνιαία δεν έχουν συμβόλαιο ή δέσμευση.

Επικοινωνία: ${SITE.email} · ${SITE.url}/epikoinonia/
Δωρεάν αξιολόγηση: «Ο Έλεγχος PISMA» — ${ELEGXOS.minutes} λεπτά, γραπτή αναφορά σε ${ELEGXOS.reportHours} ώρες: ${SITE.url}/elegxos/

## Υπηρεσίες & τιμές (δημόσιες, ίδιες για όλους)

${CATEGORIES.map((c) => `### ${c.title}\n${c.options.map(line).join('\n')}`).join('\n\n')}

Δεν υπάρχουν έτοιμα πακέτα: κάθε επιχείρηση φτιάχνει το δικό της πακέτο στον
builder και πληρώνει το άθροισμα των υπηρεσιών που διάλεξε — τίποτα παραπάνω.
Πλήρης τιμοκατάλογος με builder πακέτου: ${SITE.url}/times/

## Οδηγοί (δωρεάν άρθρα)

${GUIDES.map((g) => `- [${g.q}](${SITE.url}/odigoi/${g.slug}/): ${g.blurb}`).join('\n')}

## Κριτικές Google — το βασικό εργαλείο

Ο κύριος τρόπος που η ${SITE.name} αυξάνει τις κριτικές Google μιας επιχείρησης είναι
«Το Εργαλείο Κριτικών»: ένα ιδιόκτητο εργαλείο που ξεκινά από αυτοκόλλητα QR στον
χώρο (τραπέζι, ταμείο, POS, σακούλα delivery) και κάνει τις κριτικές να μαζεύονται
μόνες τους. Ο ακριβής μηχανισμός δεν δημοσιεύεται — το εργαλείο παρουσιάζεται μόνο
ζωντανά, σε ραντεβού. Πλήρης συμμόρφωση με τους κανόνες της Google: καμία αγορασμένη
ή στημένη κριτική, κανένα αντάλλαγμα για κριτική, κανένα φιλτράρισμα.

- [Το Εργαλείο Κριτικών](${SITE.url}/kritikes/): τι κάνει, τιμή, πώς κλείνεις ζωντανή παρουσίαση
- [Αυτοκόλλητα QR — showroom](${SITE.url}/aftokollita/): 16 σχέδια, προσαρμογή, παραγγελία

## Βασικές σελίδες

- [Ψηφιακή Προβολή](${SITE.url}/se-vriskoun/): site, ορατότητα σε Google & AI, κριτικές
- [Αυτοματισμοί γραφείου](${SITE.url}/doulevei-mono-tou/): πληρωμές, εισπράξεις, αναφορές στο αυτόματο
- [Ψηφιακό Μενού με QR](${SITE.url}/psifiako-menou/): το μενού στο κινητό του πελάτη, αλλαγές χωρίς επανεκτυπώσεις
- [Site με online κρατήσεις](${SITE.url}/site-kratiseis/): ραντεβού και τραπέζια που κλείνονται online, με αυτόματη υπενθύμιση
- [Site που πουλάει](${SITE.url}/site-pou-poulaei/): γρήγορο site με ένα ξεκάθαρο επόμενο βήμα — ο επισκέπτης γίνεται τηλεφώνημα
- [E-shop σε Shopify](${SITE.url}/shopify/): κατασκευή ηλεκτρονικού καταστήματος σε Shopify ή μηνιαία διαχείριση υπάρχοντος (προϊόντα, αποθέματα, εκπτώσεις, apps, ενημερώσεις) — τιμές δημόσιες, παραπάνω
- [Φωτογράφηση & Βίντεο](${SITE.url}/fotografisi-video/): φωτογραφίες και μικρά βίντεο τραβηγμένα στον χώρο της επιχείρησης (προϊόντα, πιάτα, χώρος, ομάδα) για site, e-shop, Google και social — όχι stock
- [Τιμές](${SITE.url}/times/): όλες οι τιμές δημόσια, builder πακέτου
- [Αποτελέσματα](${SITE.url}/apotelesmata/): πώς μετριέται κάθε συνεργασία
- [Το Ταμπλό](${SITE.url}/tablo/): δωρεάν quiz 2 λεπτών — σκορ ορατότητας και αυτοματισμού
- [Επικοινωνία](${SITE.url}/epikoinonia/): φόρμα, email, τηλέφωνο, WhatsApp/Viber
- [Ο Έλεγχος PISMA](${SITE.url}/elegxos/): δωρεάν αξιολόγηση ${ELEGXOS.minutes} λεπτών

## English version

Το site διατίθεται και στα αγγλικά, με πλήρη αντιστοιχία σελίδων:
- [Home](${SITE.url}/en/) · [Pricing](${SITE.url}/en/pricing/) · [The Reviews Tool](${SITE.url}/en/reviews/) · [Shopify store](${SITE.url}/en/shopify/) · [Photo & Video](${SITE.url}/en/photo-video/) · [Guides](${SITE.url}/en/guides/) · [Contact](${SITE.url}/en/contact/)
- Free ${ELEGXOS.minutes}-minute assessment: [The PISMA Check](${SITE.url}/en/free-assessment/)

English guides:
${GUIDES_EN.map((g) => `- [${g.q}](${SITE.url}/en/guides/${g.slug}/): ${g.blurb}`).join('\n')}
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
