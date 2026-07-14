/**
 * PISMA — κεντρικό config.
 * ΟΛΑ τα ποσά, οι ημερομηνίες και τα στοιχεία επικοινωνίας αλλάζουν ΜΟΝΟ εδώ.
 */

export const SITE = {
  name: 'PISMA',
  tagline: 'Με πείσμα, μέχρι να δουλεύει μόνο του.',
  founder: 'Πάνος',
  area: 'Γλυφάδα, Αθήνα',
  region: 'Νότια προάστια Αθήνας',
  email: 'hello@pisma.gr', // placeholder — θα αντικατασταθεί
  phone: '+30 210 000 0000', // placeholder — θα αντικατασταθεί
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

/** Πακέτα τιμών — ενδεικτικά placeholders, εύκολα configurable */
export const PRICES = {
  ekkinisi: { name: 'Εκκίνηση', setup: 590, monthly: 90 },
  leitourgia: { name: 'Λειτουργία', setup: 1400, monthly: 220 },
  parousia: { name: 'Παρουσία+', setup: 1200, monthly: 180 },
} as const;

/** Παράμετροι υπολογισμών στο Ταμπλό (quiz) */
export const QUIZ = {
  hourRate: 15, // €/ώρα γραφείου
} as const;

/** Μορφοποίηση ποσών: 1400 → «1.400€» */
export const eur = (n: number): string =>
  n.toLocaleString('el-GR') + '€';
