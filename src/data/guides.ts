/**
 * Ευρετήριο οδηγών — μία πηγή για /odigoi/, /llms.txt και ό,τι άλλο τους λιστάρει.
 * Νέος οδηγός = νέα γραμμή εδώ + αρχείο στο src/pages/odigoi/ + γραμμή στο sitemap.
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
    blurb: 'Χωρίς τεχνικούς όρους: τι μετράει πραγματικά για μια μικρή επιχείρηση.',
  },
  {
    slug: 'na-se-proteinei-to-chatgpt',
    q: 'Πώς θα σε προτείνει το ChatGPT;',
    blurb: 'Οι πελάτες ρωτάνε πλέον και το AI — να τι κοιτάζει για να απαντήσει.',
  },
  {
    slug: 'profil-google-maps',
    q: 'Πώς θα φαίνεσαι σωστά στο Google και στους Χάρτες;',
    blurb: 'Το προφίλ Google της επιχείρησής σου, στημένο σωστά βήμα-βήμα.',
  },
  {
    slug: 'perissoteres-kritikes-google',
    q: 'Πώς θα πάρεις περισσότερες κριτικές στο Google;',
    blurb: 'Πώς να ζητάς σωστά, πώς να απαντάς — και τι να μην κάνεις ποτέ.',
  },
  {
    slug: 'poso-kostizei-ena-site',
    q: 'Πόσο κοστίζει ένα site για μικρή επιχείρηση;',
    blurb: 'Τι καθορίζει την τιμή και τι πρέπει οπωσδήποτε να περιλαμβάνει.',
  },
];
