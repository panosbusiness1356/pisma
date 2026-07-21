/**
 * Τιμοκατάλογος PISMA — ΟΛΕΣ οι τιμές του site ζουν εδώ.
 *
 * - Νέο automation/υπηρεσία = μία νέα γραμμή στο αντίστοιχο options[].
 * - Οι τιμές social είναι το ΧΑΜΗΛΟ άκρο των ζωνών (απόφαση 15/07/2026).
 * - Τα πακέτα (PRESETS) έχουν προσωρινές εκπτώσεις — TODO: οριστικοποίηση ποσών.
 * - FORM_ENDPOINT: βάλε εδώ το endpoint της υπηρεσίας φορμών (π.χ. Formspree
 *   «https://formspree.io/f/XXXXXXX») για αποθήκευση lead. Όσο είναι κενό,
 *   το κουμπί ανοίγει email με προσυμπληρωμένη την προσφορά.
 */

export type PriceType = 'once' | 'monthly';

export interface PricingOption {
  id: string;
  label: string;
  detail?: string;
  price: number;
  type: PriceType;
}

export interface PricingCategory {
  id: string;
  title: string;
  desc?: string;
  /** radio = μία επιλογή (με διαθέσιμο «Καμία»), checkbox = πολλαπλές */
  mode: 'radio' | 'checkbox';
  options: PricingOption[];
}

export const CATEGORIES: PricingCategory[] = [
  {
    id: 'website',
    title: 'Ιστοσελίδα',
    desc: 'Κατασκευή ή ανακατασκευή — μία επιλογή.',
    mode: 'radio',
    options: [
      { id: 'web-basic', label: 'Basic', detail: 'Καθαρή παρουσία: αρχική, υπηρεσίες, επικοινωνία', price: 220, type: 'once' },
      { id: 'web-standard', label: 'Standard', detail: 'Πλήρες site με περισσότερες σελίδες και φόρμες', price: 320, type: 'once' },
      { id: 'web-pro', label: 'Pro', detail: 'Μεγαλύτερο site με ειδικές λειτουργίες', price: 450, type: 'once' },
    ],
  },
  {
    id: 'gbp',
    title: 'Google Business Profile',
    desc: 'Το προφίλ σας στους Χάρτες και την αναζήτηση Google.',
    mode: 'checkbox',
    options: [
      { id: 'gbp-setup', label: 'Setup', detail: 'Στήσιμο και βελτιστοποίηση προφίλ', price: 65, type: 'once' },
    ],
  },
  {
    id: 'ai',
    title: 'Ορατότητα σε Google & AI',
    desc: 'SEO · GEO · AEO — να εμφανίζεστε και στις απαντήσεις εργαλείων AI.',
    mode: 'checkbox',
    options: [
      { id: 'ai-setup', label: 'Αρχικό setup', price: 420, type: 'once' },
      { id: 'ai-monthly', label: 'Μηνιαία διαχείριση', detail: 'Με μηνιαίο Proof of Value report', price: 200, type: 'monthly' },
    ],
  },
  {
    id: 'social',
    title: 'Social media',
    desc: 'Μία επιλογή — ανάλογα με το ποιος βγάζει το υλικό.',
    mode: 'radio',
    options: [
      { id: 'soc-setup', label: 'Ξεκαθάρισμα και στήσιμο', detail: 'Εφάπαξ, χωρίς μηνιαία συνδρομή', price: 150, type: 'once' },
      { id: 'soc-1p-pisma', label: '1 πλατφόρμα — υλικό από PISMA', detail: '8–12 posts τον μήνα', price: 200, type: 'monthly' },
      { id: 'soc-23p-pisma', label: '2–3 πλατφόρμες — υλικό από PISMA', detail: '15–20 posts + stories τον μήνα', price: 400, type: 'monthly' },
      { id: 'soc-1p-own', label: '1 πλατφόρμα — δικό σας υλικό', detail: '8–12 posts τον μήνα', price: 140, type: 'monthly' },
      { id: 'soc-23p-own', label: '2–3 πλατφόρμες — δικό σας υλικό', detail: '15–20 posts τον μήνα', price: 280, type: 'monthly' },
    ],
  },
  {
    id: 'auto',
    title: 'Αυτοματισμοί',
    desc: 'Διαλέξτε όσους θέλετε — η λίστα μεγαλώνει συνεχώς.',
    mode: 'checkbox',
    options: [
      { id: 'auto-match', label: 'Αυτόματο ταίριασμα πληρωμών', price: 450, type: 'once' },
      { id: 'auto-excel', label: 'Οργανωμένο Excel', price: 150, type: 'once' },
      { id: 'auto-day', label: 'Η Ημέρα σου σε Ένα Μήνυμα', price: 10, type: 'monthly' },
      { id: 'auto-debt', label: 'Αυτόματος Κυνηγός Οφειλών', price: 25, type: 'monthly' },
      { id: 'auto-spy', label: 'Ο Κατάσκοπός σου', price: 20, type: 'monthly' },
      { id: 'auto-reviews', label: 'Το Google Reviews σου στο Αυτόματο', price: 25, type: 'monthly' },
    ],
  },
  {
    id: 'care',
    title: 'Συντήρηση',
    desc: 'Να τρέχουν όλα, χωρίς να το σκέφτεστε.',
    mode: 'checkbox',
    options: [
      { id: 'care-web', label: 'Website care', detail: 'Ενημερώσεις, ασφάλεια, μικροαλλαγές', price: 29, type: 'monthly' },
    ],
  },
];

export interface Preset {
  id: string;
  name: string;
  tagline: string;
  highlighted?: boolean;
  /** ids επιλογών από τα CATEGORIES */
  optionIds: string[];
  /** Τιμές πακέτου — χαμηλότερες από το άθροισμα (TODO: οριστικοποίηση εκπτώσεων) */
  bundleOnce: number;
  bundleMonthly: number;
}

export const PRESETS: Preset[] = [
  {
    id: 'preset-start',
    name: 'Ξεκίνημα',
    tagline: 'Η πρώτη σοβαρή παρουσία στο internet',
    optionIds: ['web-basic', 'gbp-setup'],
    bundleOnce: 260,
    bundleMonthly: 0,
  },
  {
    id: 'preset-visible',
    name: 'Ορατότητα',
    tagline: 'Site — και να σας βρίσκουν σε Google και AI',
    highlighted: true,
    optionIds: ['web-standard', 'gbp-setup', 'ai-setup', 'ai-monthly', 'care-web'],
    bundleOnce: 720,
    bundleMonthly: 215,
  },
  {
    id: 'preset-full',
    name: 'Πλήρες',
    tagline: 'Παρουσία, social και γραφείο στο αυτόματο',
    optionIds: ['web-pro', 'gbp-setup', 'ai-setup', 'ai-monthly', 'soc-1p-pisma', 'auto-day', 'auto-debt', 'care-web'],
    bundleOnce: 850,
    bundleMonthly: 419,
  },
];

/** Endpoint υπηρεσίας φορμών για αποθήκευση lead — κενό = fallback σε email. */
export const FORM_ENDPOINT = '';

/** Βοηθητικά — κοινά για build και client. */
export const ALL_OPTIONS: PricingOption[] = CATEGORIES.flatMap((c) => c.options);

export const optionById = (id: string): PricingOption | undefined =>
  ALL_OPTIONS.find((o) => o.id === id);

/** Άθροισμα μεμονωμένων τιμών ενός συνόλου επιλογών. */
export const sumOf = (ids: string[]): { once: number; monthly: number } => {
  let once = 0;
  let monthly = 0;
  for (const id of ids) {
    const o = optionById(id);
    if (!o) continue;
    if (o.type === 'once') once += o.price;
    else monthly += o.price;
  }
  return { once, monthly };
};
