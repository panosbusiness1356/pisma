# PISMA — Website

Πολυσέλιδο στατικό site της PISMA (Astro 5, ελληνικά). Ζει αυτόνομα στον φάκελο `pisma/` — δεν σχετίζεται με τα αρχεία POPO DESIGNS του γονικού φακέλου.

## Εντολές

```bash
npm install        # μία φορά
npm run dev        # dev server στο http://localhost:4321
npm run build      # στατικό build στο dist/
npm run preview    # σερβίρει το dist/ τοπικά
```

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- Καμία μεταβλητή περιβάλλοντος δεν χρειάζεται.

## Πού αλλάζουν τα πράγματα

| Τι | Πού |
|---|---|
| Ποσά πακέτων, ημερομηνίες, email, τηλέφωνο | **`src/config.ts`** — μόνο εδώ, πουθενά αλλού |
| Χρώματα, τυπογραφία, κοινά utilities | `src/styles/global.css` |
| Meta/OG/JSON-LD ανά σελίδα | props του `<Base>` σε κάθε `src/pages/*.astro` |
| Κόκκινη κορδέλα προθεσμίας | `src/components/Ribbon.astro` |
| Ερωτήσεις/βαρύτητες του Ταμπλό | `src/pages/tablo.astro` (πίνακας ερωτήσεων + `QUIZ.hourRate` στο config) |

## Σελίδες

`/` αρχική · `/se-vriskoun` πυλώνας Α' · `/doulevei-mono-tou` πυλώνας Β' · `/tablo` quiz · `/timologisi-2026` landing ηλ. τιμολόγησης · `/times` · `/apodeixeis` · `/elegxos` κράτηση · `/epikoinonia`

## Σχεδιαστικές αποφάσεις που δεν είναι λάθη

- Το brand `--orange: #E67E22` δεν περνά WCAG AA ως κείμενο, οπότε υπάρχουν AA παραλλαγές ανά χρήση: `--orange-cta #BA5D0C` (φόντο κουμπιών + accent σε μεγάλα headings), `--orange-text #9C4D08` (μικρό πορτοκαλί κείμενο/links), `--ok-text`/`--red-text` (κείμενο σε πράσινα/κόκκινα soft φόντα), `--red-deep` (φόντο κορδέλας). Το `#E67E22` μένει για διακοσμητικά: εικονίδια, chips, logo dot, δαχτυλίδια.
- Οι φόρμες (Έλεγχος, Επικοινωνία) δουλεύουν με `mailto:` — δεν υπάρχει backend. Στο `elegxos.astro` υπάρχει TODO σχόλιο για μελλοντικό Cal.com/Calendly embed.
- Το quiz δεν αποθηκεύει τίποτα (ούτε localStorage) και δεν ζητά email — συνειδητή απόφαση του spec.
- Οι 2 από τις 3 κάρτες στις Αποδείξεις είναι σημασμένες «ΕΝΔΕΙΚΤΙΚΟ ΣΕΝΑΡΙΟ ΕΦΑΡΜΟΓΗΣ» μέχρι να υπάρξουν πραγματικοί πελάτες — μην αφαιρεθεί το tag χωρίς πραγματικά δεδομένα.

## SEO

Κάθε σελίδα έχει δικό της title/description/canonical/OG (μέσω `Base.astro`), JSON-LD (LocalBusiness, Service, FAQPage, Offers, ContactPage), και υπάρχουν `public/robots.txt` + `public/sitemap.xml`. Αν αλλάξει το domain από `pisma.gr`, ενημέρωσε το `astro.config.mjs` (site), το `src/config.ts` (SITE.url) και το sitemap.
