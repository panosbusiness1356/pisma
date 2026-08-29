/**
 * Ευρετήριο αγγλικών οδηγών — αντιστοιχεί 1:1 στο guides.ts.
 * Τα slugs εδώ είναι τα αγγλικά (κάτω από /en/guides/) — βλ. και src/i18n.ts.
 */
import type { GuideMeta } from './guides';

export const GUIDES_EN: GuideMeta[] = [
  {
    slug: 'seo-in-plain-words',
    q: 'What is SEO — in plain words?',
    blurb: 'No technical jargon: what actually matters for your business.',
  },
  {
    slug: 'get-recommended-by-chatgpt',
    q: 'How do you get ChatGPT to recommend you?',
    blurb: "Customers now ask AI too — here's what it looks at before it answers.",
  },
  {
    slug: 'google-maps-profile',
    q: 'How do you show up properly on Google and Maps?',
    blurb: 'Your business’s Google profile, set up right, step by step.',
  },
  {
    slug: 'more-google-reviews',
    q: 'How do you get more Google reviews?',
    blurb: 'How to ask the right way, how to reply — and what never to do.',
  },
  {
    slug: 'website-cost',
    q: 'How much does a business website cost?',
    blurb: 'What drives the price and what it absolutely must include.',
  },
  {
    slug: 'what-are-automations',
    q: 'What are office automations?',
    blurb: 'What each one does — payments, debts, reports — in plain words.',
  },
  {
    slug: 'social-media-management',
    q: 'What is social media management?',
    blurb: 'What it includes, what your options are and what it costs.',
  },
];
