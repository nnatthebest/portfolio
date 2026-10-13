/** Brand, contact and legal constants. Source of truth: docs/brief.md. */
export const site = {
  name: 'Daniil — web & automation',
  legalName: 'Daniil Biiakov',
  email: 'daniil@daniilbiiakov.com',
  whatsapp: 'https://wa.me/421952156068',
  linkedin: 'https://www.linkedin.com/in/daniil-biyakov',
  github: 'https://github.com/nnatthebest/portfolio',
  calConsultation: 'https://cal.com/daniil-biiakov/30min',
  calQuickCall: 'https://cal.com/daniil-biiakov/15min',
  ico: '57523894',
  dic: '3122421654',
  // [TODO: postal address for GDPR and footer — not in docs/brief.md yet]
} as const;

/** Where the contact form posts. Served by the Pages Function in functions/api/contact.ts. */
export const CONTACT_ENDPOINT = '/api/contact';
