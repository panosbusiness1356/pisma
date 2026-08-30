# PISMA — Website

Πολυσέλιδο στατικό, δίγλωσσο (EL + `/en/`) site της PISMA (Astro 5). Ζει αυτόνομα στον φάκελο `pisma/` — δεν σχετίζεται με τα αρχεία POPO DESIGNS του γονικού φακέλου.

## Εντολές

```bash
npm install        # μία φορά
npm run dev        # dev server στο http://localhost:4321
npm run build      # στατικό build στο dist/
npm run preview    # σερβίρει το dist/ τοπικά
```

## Deploy (Vercel)

- Deploy από το GitHub `main` (Vercel). Ο VPS origin είναι μόνο sync hub — push εκεί ΔΕΝ κάνει deploy.
- Build command: `npm run build`, output: `dist`. Καμία μεταβλητή περιβάλλοντος.
- Το `vercel.json` κρατά: `trailingSlash: true`, κεφαλίδες ασφαλείας (nosniff, SAMEORIGIN, HSTS κ.λπ.), cache 1 έτους για `/fonts/`, redirects `/apodeixeis → /apotelesmata/`.

## Πού αλλάζουν τα πράγματα

| Τι | Πού |
|---|---|
| Email, τηλέφωνο, tagline, στοιχεία ελέγχου (45΄/48h) | **`src/config.ts`** — μόνο εδώ, πουθενά αλλού |
| Τιμές/πακέτα/builder | `src/data/pricing.ts` (τα EN λεκτικά στο `pricing.en.ts` — τα ποσά κληρονομούνται, ΔΕΝ διπλογράφονται) |
| Οδηγοί (λίστα) | `src/data/guides.ts` + `guides.en.ts` |
| Ζευγάρια σελίδων EL↔EN (κουμπί γλώσσας, hreflang, sitemap) | `src/i18n.ts` (πίνακας `PAIRS`) — νέα σελίδα = μία γραμμή εδώ |
| Χρώματα, τυπογραφία, κοινά utilities | `src/styles/global.css` |
| Meta/OG/JSON-LD ανά σελίδα | props του `<Base>` σε κάθε `src/pages/*.astro` |
| Ερωτήσεις του Ταμπλό | `src/pages/tablo.astro` (πίνακας ερωτήσεων) |

Το `sitemap.xml` και το `llms.txt` **παράγονται αυτόματα** στο build (`src/pages/sitemap.xml.ts`, `llms.txt.ts`) από τα παραπάνω — δεν συντηρούνται με το χέρι.

## Σελίδες

Ελληνικά: `/` αρχική · `/se-vriskoun` πυλώνας Α' · `/doulevei-mono-tou` πυλώνας Β' · `/kritikes` · `/aftokollita` showroom · `/tablo` quiz · `/times` · `/apotelesmata` · `/elegxos` κράτηση · `/epikoinonia` · `/odigoi/*` 7 οδηγοί · `/demo/*` 2 demo (noindex).
Αγγλικά: αντίστοιχες κάτω από `/en/` με αγγλικά slugs (βλ. `PAIRS` στο `src/i18n.ts`).

## Σχεδιαστικές αποφάσεις που δεν είναι λάθη

- Το gradient των κουμπιών (`--grad` στο global.css) είναι σκόπιμα σκουρεμένο ώστε το λευκό κείμενο να περνά WCAG AA (≥4.5:1) — μην «φωτιστεί» χωρίς νέο έλεγχο αντίθεσης.
- Οι φόρμες (Έλεγχος, Επικοινωνία, Τιμές, showroom) στέλνουν μέσω **FormSubmit** (`FORM_ENDPOINT` στο `src/data/pricing.ts`) — το FormSubmit απαντά 200 και σε αποτυχία, γι' αυτό όλες ελέγχουν και το `json.success`. Στο `elegxos.astro` υπάρχει TODO για μελλοντικό Cal.com embed.
- Το quiz δεν αποθηκεύει τίποτα (ούτε localStorage) και δεν ζητά email — συνειδητή απόφαση του spec.
- Αριθμοί-αποτελέσματα χωρίς πραγματικούς πελάτες σημαίνονται ως ενδεικτικά (π.χ. kicker «Ενδεικτικό παράδειγμα» στο πάνελ «Μία ημέρα του συστήματος») — μην αφαιρεθεί η σήμανση χωρίς πραγματικά δεδομένα.
- Γραμματοσειρές self-hosted (Inter var, Unbounded 800 latin, JetBrains Mono) — κανένα αίτημα σε Google στις κανονικές σελίδες. Μόνο το showroom αυτοκόλλητων φορτώνει Noto Sans Display από Google Fonts, γιατί είναι η γραμματοσειρά ΤΟΥ ΠΡΟΪΟΝΤΟΣ (ίδια στην εκτύπωση).
- Οι δύο showroom σελίδες (`/aftokollita`, `/en/qr-stickers`) ΔΕΝ περνούν από το `Base.astro` — έχουν δικό τους `<head>`· ό,τι προστίθεται στο Base (icons, hreflang κ.λπ.) πρέπει να μπει και εκεί με το χέρι.

## SEO

Κάθε σελίδα έχει δικό της title/description/canonical/OG (μέσω `Base.astro`), hreflang el/en/x-default από το `PAIRS`, JSON-LD (WebSite, ProfessionalService, Service, FAQPage, Article+Breadcrumbs στους οδηγούς), αυτόματο `sitemap.xml` με xhtml:link alternates, `robots.txt` φιλικό και σε AI crawlers, και `llms.txt`. Πλήρες σετ favicon (`favicon.ico/svg`, `apple-touch-icon.png`, `site.webmanifest`). Αν αλλάξει το domain από `pisma.gr`, ενημέρωσε `astro.config.mjs` (site) και `src/config.ts` (SITE.url) — sitemap/llms.txt ακολουθούν αυτόματα.
