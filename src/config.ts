/**
 * PISMA — κεντρικό config.
 * ΟΛΑ τα ποσά, οι ημερομηνίες και τα στοιχεία επικοινωνίας αλλάζουν ΜΟΝΟ εδώ.
 */

export const SITE = {
  name: 'PISMA',
  tagline: 'Με πείσμα, μέχρι να δουλεύει μόνο του.',
  taglineEn: 'Relentlessly, until it runs on its own.',
  region: 'Νότια προάστια Αθήνας',
  regionEn: 'Southern suburbs of Athens',
  email: 'info@pisma.gr',
  phone: '+30 694 727 1910',
  url: 'https://pisma.gr',
} as const;

/** Ηλεκτρονική τιμολόγηση — Β' φάση (όλες οι επιχειρήσεις) */
export const EINVOICE = {
  deadlineISO: '2026-10-01',
  deadlineHuman: '1η Οκτωβρίου 2026',
  deadlineShort: '1/10/2026',
  earlyBirdISO: '2026-08-03',
  earlyBirdHuman: '3 Αυγούστου 2026',
  maxFine: 2500, // €/παράβαση
  migrationWeeks: '6–10 εβδομάδες',
} as const;

/** Ο Έλεγχος PISMA */
export const ELEGXOS = {
  minutes: 45,
  price: 'Δωρεάν',
  reportHours: 48,
} as const;

/** Οι τιμές ζουν πλέον στο src/data/pricing.ts (κατηγορίες, πακέτα, builder). */

/** Παράμετροι υπολογισμών στο Ταμπλό (quiz) */
export const QUIZ = {
  hourRate: 15, // €/ώρα γραφείου
} as const;

/** Μορφοποίηση ποσών: 1400 → «1.400€» */
export const eur = (n: number): string =>
  n.toLocaleString('el-GR') + '€';

/** Μορφοποίηση ποσών για τις αγγλικές σελίδες: 1400 → "€1,400" */
export const eurEn = (n: number): string =>
  '€' + n.toLocaleString('en-US');
