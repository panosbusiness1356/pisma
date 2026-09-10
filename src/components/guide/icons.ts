/**
 * Line icons για τα «τουβλάκια» των οδηγών (Tiles / Steps).
 * 24x24, stroke currentColor, χωρίς fill, μπαίνουν σε .icon-chip του global.css.
 * Ένα εικονίδιο = το εσωτερικό του <svg>. Πρόσθεσε νέα εδώ, όχι inline στις σελίδες.
 */
export const guideIcons: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4.5"/>',
  tag: '<path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  camera: '<path d="M4 8h3.5l1.5-2.5h6L16.5 8H20v11H4z"/><circle cx="12" cy="13" r="3.2"/>',
  list: '<path d="M9 7h11M9 12h11M9 17h11"/><circle cx="5" cy="7" r="1.1" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="5" cy="17" r="1.1" fill="currentColor" stroke="none"/>',
  text: '<path d="M5 7h14M5 12h14M5 17h9"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
  star: '<path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>',
  alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  message: '<path d="M4 5h16v11H9l-5 4z"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  bot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4M9 4h6"/><circle cx="9" cy="13.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="13.5" r="1.1" fill="currentColor" stroke="none"/>',
  euro: '<path d="M17 6.5A6.5 6.5 0 0 0 7.5 12 6.5 6.5 0 0 0 17 17.5"/><path d="M4.5 10.5h9M4.5 13.5h9"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  image: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="M20 16l-5-5-8 8"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5a13 13 0 0 1 0 17M12 3.5a13 13 0 0 0 0 17"/>',
  phone: '<path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
  home: '<path d="M4 11l8-7 8 7v9h-5v-5h-6v5H4z"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  users: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="16.5" cy="9.5" r="2.4"/><path d="M15.5 14.5a4.5 4.5 0 0 1 5 4.5"/>',
  chart: '<path d="M4 19h16"/><path d="M6 16v-5M11 16V7M16 16v-3M20 16v-8" stroke-width="2.4"/>',
  bolt: '<path d="M13 3L5 13h6l-1 8 9-11h-6z"/>',
  gift: '<rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M4 14h16M12 10v10M12 10c-2-4-6-4-6-1.5S10 10 12 10zm0 0c2-4 6-4 6-1.5S14 10 12 10z"/>',
};
