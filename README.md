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
- Γραμματοσειρές self-hosted (Inter var, Unbounded 800 Basic Latin, JetBrains Mono, Noto Sans Display) — κανένα αίτημα σε Google στις κανονικές σελίδες. Μόνο το showroom αυτοκόλλητων φορτώνει Noto Sans Display από Google Fonts, γιατί είναι η γραμματοσειρά ΤΟΥ ΠΡΟΪΟΝΤΟΣ (ίδια στην εκτύπωση).
- Οι δύο showroom σελίδες (`/aftokollita`, `/en/qr-stickers`) ΔΕΝ περνούν από το `Base.astro` — έχουν δικό τους `<head>`· ό,τι προστίθεται στο Base (icons, hreflang κ.λπ.) πρέπει να μπει και εκεί με το χέρι.

## Απόδοση (έλεγχος 07/09/2026 — «να τρέχει τέλεια και στην πιο αδύναμη συσκευή»)

Μετρήσεις με Lighthouse σε εξομοίωση κινητού (CPU 4× πιο αργό, αργό 4G): αρχική 68 → 95+, εσωτερικές 91-95 → 95-99, TBT από 1,3-2 s σε 0. Τι το κρατά έτσι — μην το αναιρέσεις χωρίς νέα μέτρηση:

- **Όλο το CSS inline** (`build.inlineStylesheets: 'always'` στο `astro.config.mjs`): κανένα render-blocking αίτημα stylesheet.
- **Καπνός WebGL (`src/scripts/smoke.ts`)** σε τρεις βαθμίδες που διαλέγονται αυτόματα: `full` (desktop, ίδια εικόνα με την επιλογή της χρήστριας), `lite` (κινητό/tablet/αδύναμη CPU: 4 οκτάβες, φθηνός φωτισμός, .45× ανάλυση, 30 fps), `still` (save-data, ≤2 GB RAM ή reduced motion: ένα καρέ). Ξεκινά μετά το `load` + idle, ώστε το compile του shader να μη μπλοκάρει την πρώτη ζωγραφιά.
- **Ντοτ (`Mascot.astro`)**: η λάμψη είναι στατικό gradient (ΟΧΙ `filter: drop-shadow` — ξαναζωγράφιζε τους 135 κύκλους σε κάθε καρέ), γράφει στο DOM μόνο όταν αλλάζει τιμή, στις οθόνες αφής δεν περιστρέφει το σύννεφο.
- **Lenis μόνο με ποντίκι** (`(hover: hover) and (pointer: fine)`) και με dynamic import — στο κινητό δεν κατεβαίνει καν.
- **Intro αρχικής**: τα στοιχεία του hero είναι ορατά κάτω από το μαύρο πέπλο (το LCP μετριέται στην πρώτη ζωγραφιά) και οι είσοδοι ξαναπαίζουν όταν ανοίγει· ο shader του μεταγλωττίζεται στο παρασκήνιο.
- **Unbounded** μόνο Basic Latin (28 KB αντί 51 KB, `pyftsubset`), preload μόνο στην αρχική.
- **Fallback γραμματοσειρές με ίδιες μετρικές** (`Unbounded Fallback`, `Inter Fallback` στο `fonts.css`: τοπική Arial/Roboto με `size-adjust`/`ascent-override`): σε αργό δίκτυο το swap δεν κουνά τίποτα (CLS αρχικής 0,16 → 0,01 με καθυστερημένες γραμματοσειρές).
- **Χωρίς GPU** (software WebGL — VM, remote desktop, παλιοί drivers): καπνός = ένα καρέ, intro χωρίς καπνό, Ντοτ ακίνητος (`html.gpu-soft`).
- Τα κρυμμένα «αιωρούμενα λογότυπα» του hero αφαιρέθηκαν (φόρτωναν 11 SVG άδικα).
- **Οθόνες αφής (`@media (pointer: coarse)`): τα ίδια εφέ, φθηνά.** Στο Chrome ένα animation με `filter: blur()` δεν τρέχει στον compositor — ξαναζωγραφίζει το στοιχείο στο main thread σε κάθε καρέ. Γι' αυτό στο κινητό: το θόλωμα των εισόδων λύνεται σε 3-6 βήματα (`steps()`) πάνω σε δικό τους layer (`will-change: transform`) ενώ ξεθώριασμα/ανάδυση μένουν ομαλά — τα βήματα γίνονται στην καταχωρημένη μεταβλητή `--blur-step` (`@property`, global.css) και το `filter` είναι πάντα στατικό `blur(var(--blur-step))`, ΠΟΤΕ animation/transition του ίδιου του `filter` με `steps()`: στο WebKit (όλοι οι browsers του iPhone) αυτό περνάει στο Core Animation που δεν υποστηρίζει `steps()` (WebKit bug 186129) και το στοιχείο έμενε θολό για πάντα (τίτλος, WhatsApp/Viber, αριθμοί)· η CSS ομίχλη κινείται αλλά είναι gradient χωρίς `filter`· μενού/cookie banner χωρίς `backdrop-filter` (σχεδόν αδιαφανές φόντο)· page-in μόνο στην πρώτη ενότητα· σκιές κειμένου με μικρό blur και η λάμψη του «PISMA.» ως gradient. Παντού: η λωρίδα φωτός του «PISMA.» είναι δύο transform animations (παράθυρο + αντίγραφο) αντί για `background-position` (ξαναζωγράφιζε 6 γράμματα σε κάθε καρέ), και όλα τα `left/top` animations έγιναν `transform`. Κανόνας για νέα εφέ: στο κινητό μόνο opacity/transform ανά καρέ — ποτέ blur/backdrop-filter/left/top/color/text-shadow/background-position σε κάθε καρέ.
- **Φόρτωμα στο κινητό**: οι ενότητες κάτω από την πρώτη οθόνη έχουν `content-visibility: auto` (δεν στήνονται/ζωγραφίζονται μέχρι να πλησιάσουν — εξαίρεση `.no-cv` για ενότητες με sticky/fixed παιδιά, π.χ. builder Τιμών)· τα layers των εισόδων (will-change) υπάρχουν μόνο όσο παίζουν· η ομίχλη ζωγραφίζεται σε 1/3 ανάλυση και μεγεθύνεται με scale(3)· ο καπνός μεταγλωττίζεται 1,6 s μετά το load (αφού τελειώσουν οι είσοδοι) και κάθε καμβάς μόνο όταν πλησιάσει στην οθόνη· ο AudioContext φτιάχνεται στο παρασκήνιο 2,5 s μετά το load (όχι μέσα στο πρώτο πάτημα)· η «κάψουλα» του μενού με IntersectionObserver-φρουρό αντί για scroll listener (καμία ανάγνωση scrollY)· ο Ντοτ κρατά scrollY/μέγεθος από listeners και μετρά rects το πολύ κάθε 100 ms.
- Μέτρηση «κολλήματος»: `scratchpad/lh/fps.mjs` (SWGL=1 = εξομοίωση αργής GPU) και `ablate.mjs` (απενεργοποίηση ενός εφέ τη φορά), `cpuprofile.mjs`, `trace.mjs`. Η παλιά έκδοση: 6-17 fps για 4 s μετά το φόρτωμα στο κινητό· τώρα 42 στο 2ο δευτερόλεπτο και 60 μετά.

Έλεγχος ξανά: `npm run build`, `npm run preview -- --port 4390` και Lighthouse CLI (`npx lighthouse http://localhost:4390/ --only-categories=performance --throttling.cpuSlowdownMultiplier=4`). Το live μετριέται με το cookie της κλειδαριάς (`--extra-headers '{"Cookie":"pisma_code=..."}'`).

## SEO

Κάθε σελίδα έχει δικό της title/description/canonical/OG (μέσω `Base.astro`), hreflang el/en/x-default από το `PAIRS`, JSON-LD (WebSite, ProfessionalService, Service, FAQPage, Article+Breadcrumbs στους οδηγούς), αυτόματο `sitemap.xml` με xhtml:link alternates, `robots.txt` φιλικό και σε AI crawlers, και `llms.txt`. Πλήρες σετ favicon (`favicon.ico/svg`, `apple-touch-icon.png`, `site.webmanifest`). Αν αλλάξει το domain από `pisma.gr`, ενημέρωσε `astro.config.mjs` (site) και `src/config.ts` (SITE.url) — sitemap/llms.txt ακολουθούν αυτόματα.
