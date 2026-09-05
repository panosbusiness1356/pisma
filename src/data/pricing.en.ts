/**
 * Αγγλικός τιμοκατάλογος — ΜΟΝΟ μεταφράσεις λεκτικών.
 * Οι τιμές, τα ids και η δομή έρχονται ΠΑΝΤΑ από το pricing.ts (μία πηγή αλήθειας):
 * αλλαγή τιμής εκεί = αλλάζει αυτόματα και στα αγγλικά.
 */
import { CATEGORIES, type PricingCategory } from './pricing';

const CAT: Record<string, { title: string; desc?: string }> = {
  website: { title: 'Website', desc: 'Build or rebuild — pick one.' },
  gbp: { title: 'Google Business Profile', desc: 'Your profile on Google Maps and Google Search.' },
  ai: { title: 'Visibility on Google & AI', desc: 'SEO · GEO · AEO — show up in AI tools’ answers too.' },
  social: { title: 'Social media', desc: 'Pick one — depending on who produces the content.' },
  media: { title: 'Photography & Video', desc: 'At your premises — pick what you need.' },
  auto: { title: 'Automations', desc: 'Pick as many as you like — the list keeps growing.' },
  care: { title: 'Care', desc: 'Everything keeps running, without you thinking about it.' },
};

const OPT: Record<string, { label: string; detail?: string }> = {
  'web-basic': { label: 'Basic', detail: 'A clean presence: home, services, contact' },
  'web-standard': { label: 'Standard', detail: 'A full site with more pages and forms' },
  'web-pro': { label: 'Pro', detail: 'A larger site with custom features' },
  'web-bookings': { label: 'Site with online bookings', detail: 'Customers book an appointment or a table online and get an automatic reminder — no more no-shows' },
  'web-shopify': { label: 'Shopify store', detail: 'Store set-up, up to 50 products, payments, shipping, training' },
  'web-shopify-large': { label: 'Shopify store — large', detail: 'Up to 300 products, migration from another platform, connection to Google, Instagram and Facebook' },
  'media-space': { label: 'Space & team photography', detail: 'Half a day at your premises, up to 40 edited photos sized for website, Google and social' },
  'media-products': { label: 'Product photography', detail: 'Up to 30 products for your store or catalogue, edited — on a neutral background or inside your space' },
  'media-video': { label: 'Video for social', detail: '3 short videos of 15–30 seconds, edited, in reels and stories dimensions' },
  'care-shopify': { label: 'Shopify management', detail: 'New products, stock, discounts, apps, updates — plus a monthly sales report' },
  'gbp-setup': { label: 'Setup', detail: 'Profile setup and optimization' },
  'ai-setup': { label: 'Initial setup' },
  'ai-monthly': { label: 'Monthly management', detail: 'With a monthly Proof of Value report' },
  'soc-setup': { label: 'Clean-up and setup', detail: 'One-off, no monthly subscription' },
  'soc-1p-pisma': { label: '1 platform — content by PISMA', detail: '8–12 posts per month' },
  'soc-23p-pisma': { label: '2–3 platforms — content by PISMA', detail: '15–20 posts + stories per month' },
  'soc-1p-own': { label: '1 platform — your own content', detail: '8–12 posts per month' },
  'soc-23p-own': { label: '2–3 platforms — your own content', detail: '15–20 posts per month' },
  'auto-match': { label: 'Automatic payment matching' },
  'auto-excel': { label: 'Organized Excel' },
  'auto-day': { label: 'Your Day in One Message' },
  'auto-debt': { label: 'Automatic Debt Chaser' },
  'auto-spy': { label: 'Your Spy' },
  'auto-reviews': { label: 'The Reviews Tool', detail: 'Makes Google reviews pile up on their own — shown only live' },
  'auto-loyalty': { label: 'Loyalty Card', detail: 'A QR code at the register: customers collect stamps on every visit and win a gift — and they come back' },
  'auto-menu': { label: 'Digital Menu', detail: 'A QR code on the table: customers scan and see your menu on their phone — change prices and dishes anytime, no reprints' },
  'care-web': { label: 'Website care', detail: 'Updates, security, small changes' },
};

export const CATEGORIES_EN: PricingCategory[] = CATEGORIES.map((c) => ({
  ...c,
  ...(CAT[c.id] ?? {}),
  options: c.options.map((o) => ({ ...o, ...(OPT[o.id] ?? {}) })),
}));
