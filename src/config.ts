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
  /** Google Analytics 4 Measurement ID (G-XXXXXXXXXX). Κενό = χωρίς GA και χωρίς μπάνερ cookies. */
  gaId: 'G-HE6GWTRNQM',
} as const;

/** Ο Έλεγχος PISMA */
export const ELEGXOS = {
  minutes: 45,
  price: 'Δωρεάν',
  priceEn: 'Free',
  reportHours: 48,
} as const;

/** Οι τιμές ζουν πλέον στο src/data/pricing.ts (κατηγορίες, πακέτα, builder). */

/** Μορφοποίηση ποσών: 1400 → «1.400€» */
export const eur = (n: number): string =>
  n.toLocaleString('el-GR') + '€';

/** Μορφοποίηση ποσών για τις αγγλικές σελίδες: 1400 → "€1,400" */
export const eurEn = (n: number): string =>
  '€' + n.toLocaleString('en-US');
