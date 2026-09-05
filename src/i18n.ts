/**
 * i18n — ο χάρτης αντιστοίχισης σελίδων ελληνικά ↔ αγγλικά.
 * ΜΙΑ πηγή αλήθειας: το κουμπί EL/EN, τα hreflang και το sitemap διαβάζουν από εδώ.
 * Νέα σελίδα με αγγλική έκδοση = μία γραμμή στο PAIRS.
 */

export type Lang = 'el' | 'en';

/** [ελληνικό path, αγγλικό path] — πάντα με trailing slash (εκτός από τη ρίζα '/'). */
export const PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['/', '/en/'],
  ['/se-vriskoun/', '/en/get-found/'],
  ['/doulevei-mono-tou/', '/en/runs-by-itself/'],
  ['/kritikes/', '/en/reviews/'],
  ['/psifiako-menou/', '/en/digital-menu/'],
  ['/site-kratiseis/', '/en/booking-website/'],
  ['/site-pou-poulaei/', '/en/website-that-sells/'],
  ['/shopify/', '/en/shopify/'],
  ['/fotografisi-video/', '/en/photo-video/'],
  ['/aftokollita/', '/en/qr-stickers/'],
  ['/tablo/', '/en/business-check/'],
  ['/times/', '/en/pricing/'],
  ['/apotelesmata/', '/en/results/'],
  ['/elegxos/', '/en/free-assessment/'],
  ['/epikoinonia/', '/en/contact/'],
  ['/odigoi/', '/en/guides/'],
  ['/odigoi/poso-kostizei-ena-site/', '/en/guides/website-cost/'],
  ['/odigoi/perissoteres-kritikes-google/', '/en/guides/more-google-reviews/'],
  ['/odigoi/na-se-proteinei-to-chatgpt/', '/en/guides/get-recommended-by-chatgpt/'],
  ['/odigoi/profil-google-maps/', '/en/guides/google-maps-profile/'],
  ['/odigoi/seo-me-apla-logia/', '/en/guides/seo-in-plain-words/'],
  ['/odigoi/ti-einai-oi-aftomatismoi/', '/en/guides/what-are-automations/'],
  ['/odigoi/diaxeirisi-social-media/', '/en/guides/social-media-management/'],
] as const;

/** Κανονικοποίηση: πάντα trailing slash ώστε το lookup να είναι σταθερό. */
const norm = (p: string): string => (p.endsWith('/') ? p : p + '/');

export const langOf = (pathname: string): Lang =>
  norm(pathname).startsWith('/en/') ? 'en' : 'el';

/**
 * Το path της ίδιας σελίδας στην άλλη γλώσσα.
 * Αν δεν υπάρχει αντίστοιχη σελίδα (π.χ. demo), πέφτει στην αρχική της άλλης γλώσσας.
 */
export const altOf = (pathname: string): string => {
  const p = norm(pathname);
  for (const [el, en] of PAIRS) {
    if (p === el) return en;
    if (p === en) return el;
  }
  return langOf(p) === 'en' ? '/' : '/en/';
};
