/**
 * Τιμοκατάλογος αυτοκόλλητων QR — η ΜΟΝΗ πηγή αλήθειας για τα ποσά.
 * Τα λεκτικά κάθε γλώσσας ζουν στις σελίδες (aftokollita.astro / en/qr-stickers.astro)·
 * εδώ μόνο οι τιμές, ώστε EL και EN να μην ξεσυγχρονίζονται ποτέ.
 * Η τιμή της πλατφόρμας ΔΕΝ είναι εδώ — έρχεται από το pricing.ts (auto-reviews).
 */

/** Τιμή ανά πακέτο αυτοκόλλητων (€, εφάπαξ), με κλειδί το id του σχεδίου. */
export const STICKER_PRICES: Record<string, number> = {
  tameio: 29,
  trapezi: 35,
  pos: 19,
  vitrina: 22,
  tablet: 25,
  apod: 18,
  souver: 32,
  menu: 24,
  sakoula: 21,
  kathr: 20,
  bar: 29,
  koup: 27,
  psygeio: 26,
  rafi: 23,
  arith: 31,
  paidi: 29,
};

/** Τιμές των έξτρα του καλαθιού (€). */
export const STICKER_EXTRA_PRICES: Record<string, number> = {
  stand: 6,
  nfc: 45,
  logo: 120,
  shop2: 19,
  express: 25,
};
