/**
 * Το Ταμπλό: δεδομένα του quiz (ελληνικά). Η αγγλική εκδοχή στο quiz.en.ts.
 *
 * Στρατηγική:
 * - Πρώτη ερώτηση = φίλτρο (πώς δουλεύει η επιχείρηση). Δεν βαθμολογείται, καθορίζει
 *   ποιες ερωτήσεις κλάδου ακολουθούν, ώστε κανείς να μη βλέπει άσχετη ερώτηση.
 * - 7 ερωτήσεις κορμού για όλους + 4 ερωτήσεις κλάδου = 12 ερωτήσεις, ίδιος αριθμός για όλους.
 * - Κάθε ερώτηση ρωτά ένα ΓΕΓΟΝΟΣ που ο ιδιοκτήτης ξέρει, όχι αυτοβαθμολόγηση.
 * - Σκάλα 0 → 3 (τίποτα → σποραδικά → με το χέρι → συστηματικά). Το v: null σημαίνει
 *   «δεν με αφορά» και βγαίνει από τον παρονομαστή.
 * - Κάθε απάντηση δένει με ΜΙΑ υπηρεσία του pricing.ts (recs[v]) ή με τίποτα (null).
 *   Το αποτέλεσμα βγάζει τα 3 πρώτα βήματα: ταξινόμηση κατά απάντηση (0 πρώτα) και μετά
 *   κατά priority (μικρότερο = πιο σημαντικό για την επιχείρηση).
 * - Οι τιμές ΔΕΝ γράφονται εδώ, διαβάζονται από το pricing.ts στο render.
 */

export type BizType = 'food' | 'appt' | 'retail' | 'b2b';
export type Dim = 'vis' | 'auto';

export interface QuizType {
  id: BizType;
  label: string;
  detail: string;
}

export interface Rec {
  /** id υπηρεσίας από το pricing.ts */
  id: string;
  /** Όνομα όπως εμφανίζεται στο αποτέλεσμα (αλλιώς το label του pricing.ts) */
  label?: string;
  /** Ο λόγος, 2 έως 6 λέξεις, από την απάντηση του χρήστη */
  why: string;
  /** «από» μπροστά από την τιμή (π.χ. ιστοσελίδα, ξεκινά από Basic) */
  from?: boolean;
}

export interface QuizOption {
  label: string;
  /** 0..3, ή null = δεν με αφορά */
  v: 0 | 1 | 2 | 3 | null;
}

export interface QuizQuestion {
  key: string;
  /** Σύντομο όνομα για τα «δυνατά σημεία» */
  name: string;
  q: string;
  dim: Dim;
  /** undefined = για όλους */
  types?: BizType[];
  priority: number;
  opts: QuizOption[];
  /** recs[v] για v = 0..3 */
  recs: [Rec | null, Rec | null, Rec | null, Rec | null];
}

export interface QuizStrings {
  typeQ: string;
  count: (i: number, n: number) => string;
  back: string;
  resultTitle: string;
  vis: string;
  auto: string;
  stepsTitle: string;
  strongTitle: string;
  perfect: string;
  verdict: { low: string; mid: string; high: string; visGap: string; autoGap: string };
  from: string;
  once: string;
  monthly: string;
  ctaPricing: string;
  ctaCheck: (minutes: number) => string;
  ctaNote: string;
  copy: string;
  copied: string;
  copyFail: string;
  restart: string;
  copyHead: string;
  copySteps: string;
  pricingHref: string;
  checkHref: string;
}

export const TYPES: QuizType[] = [
  { id: 'food', label: 'Εστίαση', detail: 'Τραπέζια, μενού, παραγγελίες' },
  { id: 'appt', label: 'Ραντεβού ή κρατήσεις', detail: 'Ο πελάτης κλείνει ώρα ή διαμονή' },
  { id: 'retail', label: 'Προϊόντα', detail: 'Κατάστημα ή e-shop' },
  { id: 'b2b', label: 'Έργα και υπηρεσίες', detail: 'Με προσφορά και τιμολόγιο' },
];

export const QUESTIONS: QuizQuestion[] = [
  /* Κορμός: για όλους */
  {
    key: 'site',
    name: 'Ιστοσελίδα',
    q: 'Τι βρίσκει όποιος ψάξει το όνομά σας στη Google;',
    dim: 'vis',
    priority: 3,
    opts: [
      { label: 'Τίποτα δικό μας', v: 0 },
      { label: 'Μόνο Facebook ή Instagram', v: 1 },
      { label: 'Site που έχει παλιώσει ή δεν ανοίγει καλά στο κινητό', v: 2 },
      { label: 'Ενημερωμένο site που ανοίγει σωστά στο κινητό', v: 3 },
    ],
    recs: [
      { id: 'web-basic', label: 'Ιστοσελίδα', why: 'Χωρίς δικό σας site', from: true },
      { id: 'web-basic', label: 'Ιστοσελίδα', why: 'Μόνο social, χωρίς site', from: true },
      { id: 'web-basic', label: 'Ανακατασκευή ιστοσελίδας', why: 'Site που έχει παλιώσει', from: true },
      null,
    ],
  },
  {
    key: 'gbp',
    name: 'Προφίλ Google',
    q: 'Το προφίλ σας στους Χάρτες Google;',
    dim: 'vis',
    priority: 1,
    opts: [
      { label: 'Δεν υπάρχει, ή δεν ξέρουμε ποιος το διαχειρίζεται', v: 0 },
      { label: 'Υπάρχει, έχουμε μήνες να το ανοίξουμε', v: 1 },
      { label: 'Συμπληρωμένο, το κοιτάμε πού και πού', v: 2 },
      { label: 'Πλήρες: ώρες, φωτογραφίες, υπηρεσίες, απαντήσεις στις κριτικές', v: 3 },
    ],
    recs: [
      { id: 'gbp-setup', label: 'Google Business Profile: στήσιμο', why: 'Χωρίς προφίλ στους Χάρτες' },
      { id: 'gbp-setup', label: 'Google Business Profile: στήσιμο', why: 'Προφίλ χωρίς ενημέρωση' },
      { id: 'gbp-setup', label: 'Google Business Profile: βελτιστοποίηση', why: 'Προφίλ μισοσυμπληρωμένο' },
      null,
    ],
  },
  {
    key: 'reviews',
    name: 'Κριτικές',
    q: 'Πώς έρχονται οι κριτικές σας στη Google;',
    dim: 'vis',
    priority: 2,
    opts: [
      { label: 'Δεν έρχονται', v: 0 },
      { label: 'Τυχαία, όποτε το θυμηθεί ο πελάτης', v: 1 },
      { label: 'Όταν τις ζητήσουμε εμείς', v: 2 },
      { label: 'Σταθερά κάθε εβδομάδα, χωρίς να ζητάμε', v: 3 },
    ],
    recs: [
      { id: 'auto-reviews', label: 'Κριτικές Google', why: 'Καμία νέα κριτική' },
      { id: 'auto-reviews', label: 'Κριτικές Google', why: 'Κριτικές στην τύχη' },
      { id: 'auto-reviews', label: 'Κριτικές Google', why: 'Κριτικές μόνο όταν ζητάτε' },
      null,
    ],
  },
  {
    key: 'search',
    name: 'Αναζήτηση',
    q: 'Πόσοι νέοι πελάτες σας βρίσκουν από αναζήτηση, Google ή AI, και όχι από σύσταση;',
    dim: 'vis',
    priority: 4,
    opts: [
      { label: 'Δεν το μετράμε', v: 0 },
      { label: 'Σχεδόν κανείς, μόνο συστάσεις και περαστικοί', v: 1 },
      { label: 'Μερικοί κάθε μήνα', v: 2 },
      { label: 'Οι περισσότεροι', v: 3 },
    ],
    recs: [
      { id: 'ai-setup', label: 'Ορατότητα σε Google & AI', why: 'Χωρίς μέτρηση από πού έρχονται' },
      { id: 'ai-setup', label: 'Ορατότητα σε Google & AI', why: 'Νέοι πελάτες μόνο από συστάσεις' },
      { id: 'ai-setup', label: 'Ορατότητα σε Google & AI', why: 'Λίγοι από αναζήτηση' },
      null,
    ],
  },
  {
    key: 'photos',
    name: 'Φωτογραφίες',
    q: 'Οι φωτογραφίες που βλέπει ο πελάτης στη Google, στο site και στα social;',
    dim: 'vis',
    priority: 5,
    opts: [
      { label: 'Δεν έχουμε δικές μας', v: 0 },
      { label: 'Από κινητό, όποτε τύχει', v: 1 },
      { label: 'Επαγγελματικές, αλλά παλιές', v: 2 },
      { label: 'Πρόσφατες, επαγγελματικές', v: 3 },
    ],
    recs: [
      { id: 'media-space', why: 'Χωρίς δικές σας φωτογραφίες' },
      { id: 'media-space', why: 'Φωτογραφίες από κινητό' },
      { id: 'media-space', why: 'Παλιές φωτογραφίες' },
      null,
    ],
  },
  {
    key: 'social',
    name: 'Social',
    q: 'Πότε ανεβάσατε τελευταία φορά στο Instagram ή στο Facebook της επιχείρησης;',
    dim: 'vis',
    priority: 6,
    opts: [
      { label: 'Δεν έχουμε λογαριασμό', v: 0 },
      { label: 'Πάνε μήνες', v: 1 },
      { label: 'Μέσα στον μήνα, όποτε προλάβουμε', v: 2 },
      { label: 'Κάθε εβδομάδα, με πρόγραμμα', v: 3 },
    ],
    recs: [
      { id: 'soc-setup', label: 'Social media: ξεκαθάρισμα και στήσιμο', why: 'Χωρίς social' },
      { id: 'soc-setup', label: 'Social media: ξεκαθάρισμα και στήσιμο', why: 'Social χωρίς κίνηση' },
      { id: 'soc-1p-own', label: 'Social media: 1 πλατφόρμα, δικό σας υλικό', why: 'Posts χωρίς πρόγραμμα' },
      null,
    ],
  },
  {
    key: 'day',
    name: 'Εικόνα ημέρας',
    q: 'Απόψε, ξέρετε τι μπήκε, τι βγήκε και τι εκκρεμεί;',
    dim: 'auto',
    priority: 9,
    opts: [
      { label: 'Όχι', v: 0 },
      { label: 'Στο περίπου', v: 1 },
      { label: 'Ναι, το βγάζουμε με το χέρι κάθε βράδυ', v: 2 },
      { label: 'Ναι, έρχεται έτοιμο', v: 3 },
    ],
    recs: [
      { id: 'auto-day', why: 'Χωρίς εικόνα ημέρας' },
      { id: 'auto-day', why: 'Εικόνα ημέρας στο περίπου' },
      { id: 'auto-day', why: 'Ημερήσια εικόνα με το χέρι' },
      null,
    ],
  },

  /* Εστίαση */
  {
    key: 'menu',
    name: 'Μενού',
    q: 'Το μενού σας;',
    dim: 'auto',
    types: ['food'],
    priority: 7,
    opts: [
      { label: 'Μόνο έντυπο', v: 0 },
      { label: 'Έντυπο και PDF στο site ή στα social', v: 1 },
      { label: 'QR στο τραπέζι, αλλά αλλάζει δύσκολα', v: 2 },
      { label: 'QR στο τραπέζι, το αλλάζουμε μόνοι μας όποτε θέλουμε', v: 3 },
    ],
    recs: [
      { id: 'auto-menu', why: 'Μενού μόνο σε χαρτί' },
      { id: 'auto-menu', why: 'Μενού σε PDF' },
      { id: 'auto-menu', why: 'QR μενού που δεν αλλάζει εύκολα' },
      null,
    ],
  },
  {
    key: 'table',
    name: 'Κρατήσεις',
    q: 'Πώς κλείνει τραπέζι ο πελάτης;',
    dim: 'auto',
    types: ['food'],
    priority: 7,
    opts: [
      { label: 'Δεν παίρνουμε κρατήσεις', v: null },
      { label: 'Μόνο τηλέφωνο', v: 0 },
      { label: 'Τηλέφωνο και μηνύματα στα social', v: 1 },
      { label: 'Online, χωρίς αυτόματη υπενθύμιση', v: 2 },
      { label: 'Online, με αυτόματη υπενθύμιση', v: 3 },
    ],
    recs: [
      { id: 'web-bookings', why: 'Κρατήσεις μόνο από τηλέφωνο' },
      { id: 'web-bookings', why: 'Κρατήσεις από μηνύματα' },
      { id: 'web-bookings', why: 'Κρατήσεις χωρίς υπενθύμιση' },
      null,
    ],
  },
  {
    key: 'loyalty',
    name: 'Επιστροφή πελατών',
    q: 'Πώς ξαναφέρνετε τον ίδιο πελάτη;',
    dim: 'auto',
    types: ['food', 'retail'],
    priority: 8,
    opts: [
      { label: 'Δεν κάνουμε κάτι', v: 0 },
      { label: 'Προσφορές στα social πού και πού', v: 1 },
      { label: 'Χάρτινη κάρτα ή έκπτωση στο χέρι', v: 2 },
      { label: 'Ψηφιακή κάρτα πιστότητας στο ταμείο', v: 3 },
    ],
    recs: [
      { id: 'auto-loyalty', why: 'Χωρίς λόγο να ξανάρθει' },
      { id: 'auto-loyalty', why: 'Επιστροφή χωρίς σύστημα' },
      { id: 'auto-loyalty', why: 'Χάρτινη κάρτα' },
      null,
    ],
  },
  {
    key: 'excel-food',
    name: 'Οργάνωση στοιχείων',
    q: 'Πού κρατάτε τζίρο ημέρας, έξοδα και παραγγελίες προμηθευτών;',
    dim: 'auto',
    types: ['food'],
    priority: 10,
    opts: [
      { label: 'Στο μυαλό και σε χαρτιά', v: 0 },
      { label: 'Σκόρπια σε αρχεία και μηνύματα', v: 1 },
      { label: 'Σε Excel που ενημερώνουμε με το χέρι', v: 2 },
      { label: 'Σε αρχείο που ενημερώνεται μόνο του', v: 3 },
    ],
    recs: [
      { id: 'auto-excel', why: 'Στοιχεία σε χαρτιά' },
      { id: 'auto-excel', why: 'Στοιχεία σκόρπια' },
      { id: 'auto-excel', why: 'Excel με το χέρι' },
      null,
    ],
  },

  /* Ραντεβού ή κρατήσεις */
  {
    key: 'booking',
    name: 'Ραντεβού',
    q: 'Πώς κλείνει ώρα ο πελάτης;',
    dim: 'auto',
    types: ['appt'],
    priority: 7,
    opts: [
      { label: 'Μόνο τηλέφωνο', v: 0 },
      { label: 'Τηλέφωνο και μηνύματα στα social', v: 1 },
      { label: 'Online, χωρίς αυτόματη υπενθύμιση', v: 2 },
      { label: 'Online, με αυτόματη υπενθύμιση', v: 3 },
    ],
    recs: [
      { id: 'web-bookings', why: 'Ραντεβού μόνο από τηλέφωνο' },
      { id: 'web-bookings', why: 'Ραντεβού από μηνύματα' },
      { id: 'web-bookings', why: 'Ραντεβού χωρίς υπενθύμιση' },
      null,
    ],
  },
  {
    key: 'return',
    name: 'Επιστροφή πελατών',
    q: 'Πόσοι πελάτες ξανάρχονται;',
    dim: 'auto',
    types: ['appt'],
    priority: 8,
    opts: [
      { label: 'Δεν το ξέρουμε', v: 0 },
      { label: 'Λίγοι', v: 1 },
      { label: 'Οι περισσότεροι, χωρίς να κάνουμε κάτι', v: 2 },
      { label: 'Οι περισσότεροι, με πρόγραμμα επιβράβευσης', v: 3 },
    ],
    recs: [
      { id: 'auto-loyalty', why: 'Χωρίς μέτρηση επιστροφών' },
      { id: 'auto-loyalty', why: 'Λίγοι ξανάρχονται' },
      { id: 'auto-loyalty', why: 'Επιστροφή χωρίς σύστημα' },
      null,
    ],
  },
  {
    key: 'excel-appt',
    name: 'Στοιχεία πελατών',
    q: 'Πού κρατάτε τα στοιχεία των πελατών: τηλέφωνα, ιστορικό, ραντεβού;',
    dim: 'auto',
    types: ['appt'],
    priority: 10,
    opts: [
      { label: 'Στο μυαλό και σε χαρτιά', v: 0 },
      { label: 'Σκόρπια σε ατζέντα, κινητό και μηνύματα', v: 1 },
      { label: 'Σε Excel που ενημερώνουμε με το χέρι', v: 2 },
      { label: 'Σε αρχείο που ενημερώνεται μόνο του', v: 3 },
    ],
    recs: [
      { id: 'auto-excel', why: 'Πελάτες σε χαρτιά' },
      { id: 'auto-excel', why: 'Πελάτες σκόρπιοι' },
      { id: 'auto-excel', why: 'Excel με το χέρι' },
      null,
    ],
  },
  {
    key: 'spy-appt',
    name: 'Ανταγωνισμός',
    q: 'Ο ανταγωνισμός δίπλα σας βγάζει προσφορά. Πότε το μαθαίνετε;',
    dim: 'auto',
    types: ['appt'],
    priority: 11,
    opts: [
      { label: 'Μάλλον ποτέ', v: 0 },
      { label: 'Τυχαία, από πελάτες', v: 1 },
      { label: 'Όποτε κοιτάξουμε εμείς', v: 2 },
      { label: 'Αμέσως, έρχεται ενημέρωση', v: 3 },
    ],
    recs: [
      { id: 'auto-spy', why: 'Χωρίς εικόνα ανταγωνισμού' },
      { id: 'auto-spy', why: 'Ανταγωνισμός από τρίτους' },
      { id: 'auto-spy', why: 'Ανταγωνισμός με το χέρι' },
      null,
    ],
  },

  /* Προϊόντα */
  {
    key: 'eshop',
    name: 'Online πωλήσεις',
    q: 'Πουλάτε online;',
    dim: 'vis',
    types: ['retail'],
    priority: 3,
    opts: [
      { label: 'Δεν μας ενδιαφέρει το online', v: null },
      { label: 'Όχι, ακόμα', v: 0 },
      { label: 'Μέσω Instagram ή μηνυμάτων', v: 1 },
      { label: 'Έχουμε e-shop, αλλά δεν φέρνει παραγγελίες', v: 2 },
      { label: 'E-shop που φέρνει παραγγελίες κάθε εβδομάδα', v: 3 },
    ],
    recs: [
      { id: 'web-shopify', why: 'Χωρίς online πωλήσεις' },
      { id: 'web-shopify', why: 'Πωλήσεις μόνο από μηνύματα' },
      { id: 'web-shopify', why: 'E-shop που δεν πουλάει' },
      null,
    ],
  },
  {
    key: 'product-photos',
    name: 'Φωτογραφίες προϊόντων',
    q: 'Οι φωτογραφίες των προϊόντων σας;',
    dim: 'vis',
    types: ['retail'],
    priority: 5,
    opts: [
      { label: 'Δεν έχουμε', v: 0 },
      { label: 'Από κινητό', v: 1 },
      { label: 'Από τον προμηθευτή, ίδιες με τον ανταγωνισμό', v: 2 },
      { label: 'Δικές μας, επαγγελματικές', v: 3 },
    ],
    recs: [
      { id: 'media-products', why: 'Χωρίς φωτογραφίες προϊόντων' },
      { id: 'media-products', why: 'Προϊόντα από κινητό' },
      { id: 'media-products', why: 'Ίδιες φωτογραφίες με τον ανταγωνισμό' },
      null,
    ],
  },
  {
    key: 'spy-retail',
    name: 'Ανταγωνισμός',
    q: 'Ο ανταγωνισμός αλλάζει τιμές ή βγάζει προσφορά. Πότε το μαθαίνετε;',
    dim: 'auto',
    types: ['retail'],
    priority: 11,
    opts: [
      { label: 'Μάλλον ποτέ', v: 0 },
      { label: 'Τυχαία, από πελάτες', v: 1 },
      { label: 'Όποτε κοιτάξουμε εμείς', v: 2 },
      { label: 'Αμέσως, έρχεται ενημέρωση', v: 3 },
    ],
    recs: [
      { id: 'auto-spy', why: 'Χωρίς εικόνα ανταγωνισμού' },
      { id: 'auto-spy', why: 'Ανταγωνισμός από τρίτους' },
      { id: 'auto-spy', why: 'Ανταγωνισμός με το χέρι' },
      null,
    ],
  },

  /* Έργα και υπηρεσίες */
  {
    key: 'match',
    name: 'Πληρωμές',
    q: 'Ποιος βρίσκει ποια πληρωμή εξοφλεί ποιο τιμολόγιο;',
    dim: 'auto',
    types: ['b2b'],
    priority: 9,
    opts: [
      { label: 'Λίγα τιμολόγια, δεν χρειάζεται', v: null },
      { label: 'Κανείς, δεν το παρακολουθούμε', v: 0 },
      { label: 'Εμείς, όποτε προλάβουμε', v: 1 },
      { label: 'Εμείς, τακτικά, με το χέρι', v: 2 },
      { label: 'Ταιριάζουν μόνες τους', v: 3 },
    ],
    recs: [
      { id: 'auto-match', why: 'Πληρωμές χωρίς παρακολούθηση' },
      { id: 'auto-match', why: 'Ταίριασμα όποτε προλάβετε' },
      { id: 'auto-match', why: 'Ταίριασμα με το χέρι' },
      null,
    ],
  },
  {
    key: 'debt',
    name: 'Οφειλές',
    q: 'Ποιος κυνηγάει όσους σας χρωστάνε;',
    dim: 'auto',
    types: ['b2b'],
    priority: 8,
    opts: [
      { label: 'Κανείς, συνήθως το αφήνουμε', v: 0 },
      { label: 'Εμείς, όποτε το θυμηθούμε', v: 1 },
      { label: 'Εμείς, με λίστα', v: 2 },
      { label: 'Σύστημα, βλέπουμε μόνο ποιος πλήρωσε', v: 3 },
    ],
    recs: [
      { id: 'auto-debt', why: 'Οφειλές χωρίς παρακολούθηση' },
      { id: 'auto-debt', why: 'Οφειλές όποτε θυμηθείτε' },
      { id: 'auto-debt', why: 'Οφειλές με το χέρι' },
      null,
    ],
  },
  {
    key: 'excel-b2b',
    name: 'Οργάνωση στοιχείων',
    q: 'Πού κρατάτε προσφορές, τιμολόγια και εξοφλήσεις;',
    dim: 'auto',
    types: ['b2b'],
    priority: 10,
    opts: [
      { label: 'Στο μυαλό και σε χαρτιά', v: 0 },
      { label: 'Σκόρπια σε αρχεία και email', v: 1 },
      { label: 'Σε Excel που ενημερώνουμε με το χέρι', v: 2 },
      { label: 'Σε αρχείο που ενημερώνεται μόνο του', v: 3 },
    ],
    recs: [
      { id: 'auto-excel', why: 'Στοιχεία σε χαρτιά' },
      { id: 'auto-excel', why: 'Στοιχεία σκόρπια' },
      { id: 'auto-excel', why: 'Excel με το χέρι' },
      null,
    ],
  },
  {
    key: 'spy-b2b',
    name: 'Ανταγωνισμός',
    q: 'Ο ανταγωνισμός βγάζει νέα τιμή ή νέα υπηρεσία. Πότε το μαθαίνετε;',
    dim: 'auto',
    types: ['b2b'],
    priority: 11,
    opts: [
      { label: 'Μάλλον ποτέ', v: 0 },
      { label: 'Τυχαία, από πελάτες', v: 1 },
      { label: 'Όποτε κοιτάξουμε εμείς', v: 2 },
      { label: 'Αμέσως, έρχεται ενημέρωση', v: 3 },
    ],
    recs: [
      { id: 'auto-spy', why: 'Χωρίς εικόνα ανταγωνισμού' },
      { id: 'auto-spy', why: 'Ανταγωνισμός από τρίτους' },
      { id: 'auto-spy', why: 'Ανταγωνισμός με το χέρι' },
      null,
    ],
  },
];

export const STRINGS: QuizStrings = {
  typeQ: 'Πώς δουλεύει η επιχείρησή σας;',
  count: (i, n) => `Ερώτηση ${i} από ${n}`,
  back: '← Προηγούμενη',
  resultTitle: 'Το σκορ σας',
  vis: 'Ορατότητα',
  auto: 'Αυτοματισμός',
  stepsTitle: 'Τα 3 πρώτα βήματα για εσάς',
  strongTitle: 'Δουλεύει ήδη',
  perfect: 'Δεν βρήκαμε κενό. Στον Δωρεάν Έλεγχο βλέπουμε μαζί τι μπορεί να γίνει ακόμα καλύτερα.',
  verdict: {
    low: 'Τα περισσότερα γίνονται ακόμα με το χέρι ή δεν γίνονται. Όλα όσα μετρήσατε φτιάχνονται.',
    mid: 'Κάποια πράγματα δουλεύουν ήδη. Αρκετά κρατιούνται ακόμα στο χέρι και στη μνήμη.',
    high: 'Καλά νούμερα. Τα σκαλιά που λείπουν είναι λίγα και συγκεκριμένα.',
    visGap: 'Το μεγαλύτερο περιθώριο: η ορατότητα. Εκεί σας ψάχνουν πελάτες που δεν σας βρίσκουν.',
    autoGap: 'Το μεγαλύτερο περιθώριο: ο αυτοματισμός. Εκεί φεύγουν οι ώρες σας κάθε εβδομάδα.',
  },
  from: 'από',
  once: 'εφάπαξ',
  monthly: '/μήνα',
  ctaPricing: 'Δείτε τα στον τιμοκατάλογο →',
  ctaCheck: (m) => `Δωρεάν Έλεγχος ${m}′ μαζί μας`,
  ctaNote: 'Στον τιμοκατάλογο τα βήματα είναι ήδη επιλεγμένα. Αλλάζετε ό,τι θέλετε, τίποτα δεν είναι υποχρεωτικό.',
  copy: 'Αντιγράψτε τα αποτελέσματα',
  copied: 'Αντιγράφηκε',
  copyFail: 'Δεν επιτράπηκε η αντιγραφή',
  restart: '↺ Ξαναπάρτε το τεστ',
  copyHead: 'Το Ταμπλό PISMA',
  copySteps: 'Πρώτα βήματα',
  pricingHref: '/times/',
  checkHref: '/elegxos/',
};
