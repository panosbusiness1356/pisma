/**
 * Ευρετήριο οδηγών — μία πηγή για /odigoi/, /llms.txt και ό,τι άλλο τους λιστάρει.
 * Νέος οδηγός = νέα γραμμή εδώ + αρχείο στο src/pages/odigoi/ + γραμμή στο PAIRS (i18n.ts)
 * — το sitemap.xml παράγεται αυτόματα από το PAIRS, δεν θέλει χειροκίνητη ενημέρωση.
 */
export interface GuideMeta {
  slug: string;
  q: string;
  blurb: string;
}

export const GUIDES: GuideMeta[] = [
  {
    slug: 'seo-me-apla-logia',
    q: 'Τι είναι το SEO — με απλά λόγια;',
    blurb: 'Χωρίς τεχνικούς όρους: τι μετράει πραγματικά για την επιχείρησή σας.',
  },
  {
    slug: 'na-se-proteinei-to-chatgpt',
    q: 'Πώς θα σας προτείνει το ChatGPT;',
    blurb: 'Οι πελάτες ρωτάνε πλέον και το AI — να τι κοιτάζει για να απαντήσει.',
  },
  {
    slug: 'profil-google-maps',
    q: 'Πώς θα φαίνεστε σωστά στη Google και στους Χάρτες;',
    blurb: 'Το προφίλ Google της επιχείρησής σας, στημένο σωστά βήμα-βήμα.',
  },
  {
    slug: 'perissoteres-kritikes-google',
    q: 'Πώς θα πάρετε περισσότερες κριτικές στη Google;',
    blurb: 'Πώς να ζητάτε σωστά, πώς να απαντάτε — και τι να μην κάνετε ποτέ.',
  },
  {
    slug: 'poso-kostizei-ena-site',
    q: 'Πόσο κοστίζει ένα site για μια επιχείρηση;',
    blurb: 'Τι καθορίζει την τιμή και τι πρέπει οπωσδήποτε να περιλαμβάνει.',
  },
  {
    slug: 'ti-einai-oi-aftomatismoi',
    q: 'Τι είναι οι αυτοματισμοί γραφείου;',
    blurb: 'Τι κάνει ο καθένας — πληρωμές, οφειλές, αναφορές — με απλά λόγια.',
  },
  {
    slug: 'diaxeirisi-social-media',
    q: 'Τι είναι η διαχείριση social media;',
    blurb: 'Τι περιλαμβάνει, ποιες επιλογές υπάρχουν και τι κοστίζει.',
  },
];
