import type { Lang } from './ui';

export interface ServiceExtra {
  id: 'support' | 'hourly';
  title: string;
  price: string;
  text: string;
}

export interface ServicesCopy {
  title: string;
  description: string;
  intro: string;
  cta: string;
  extrasHeading: string;
  extras: readonly ServiceExtra[];
}

export interface AboutCopy {
  title: string;
  description: string;
  eyebrow: string;
  lead: string;
  story: readonly string[];
  forWhom: {
    heading: string;
    intro: string;
    items: readonly string[];
    problem: string;
    edge: string;
  };
  tools: { heading: string; text: string; items: readonly string[] };
  languages: { heading: string; text: string };
}

export interface NotFoundCopy {
  title: string;
  text: string;
  home: string;
  contact: string;
}

/** Tools named in the brief. Product names, so they are the same in every language. */
const TOOLS = [
  'Astro',
  'Next.js',
  'Tailwind CSS',
  'Supabase',
  'n8n',
  'Airtable',
  'Pipedrive',
  'WordPress',
  'Cloudflare',
] as const;

/** Services page copy. Packages themselves come from the `services` collection. */
export const servicesCopy: Record<Lang, ServicesCopy> = {
  sk: {
    title: 'Služby a ceny',
    description:
      'Balíky služieb s cenami od a termínmi: jednostránkový web, web firmy, rezervácie a automatizácia.',
    intro: 'Vyberte si balík, alebo mi napíšte, čo potrebujete.',
    cta: 'Mám záujem',
    extrasHeading: 'Ďalšie služby',
    extras: [
      {
        id: 'support',
        title: 'Podpora a drobné úpravy',
        price: 'od 25 € / mesiac',
        text: 'Aktualizácie, zálohy, drobné úpravy textov a kontrola, že všetko funguje.',
      },
      {
        id: 'hourly',
        title: 'Dodatočné úpravy',
        price: '20 € / hodinu',
        text: 'Doplnenia a úpravy mimo balíka, za hodinovú sadzbu.',
      },
    ],
  },
  en: {
    title: 'Services and pricing',
    description:
      'Service packages with starting prices and timelines: one-page website, business website, booking system and automation.',
    intro: 'Pick a package, or tell me what you need.',
    cta: 'I’m interested',
    extrasHeading: 'More services',
    extras: [
      {
        id: 'support',
        title: 'Support and small changes',
        price: 'from €25 / month',
        text: 'Updates, backups, small text edits and a check that everything works.',
      },
      {
        id: 'hourly',
        title: 'Additional work',
        price: '€20 / hour',
        text: 'Additions and changes beyond a package, at an hourly rate.',
      },
    ],
  },
};

/** About page copy. Source: docs/brief.md (sections "Obo mne" and "Pre koho pracujem"). */
export const aboutCopy: Record<Lang, AboutCopy> = {
  sk: {
    title: 'O mne',
    description:
      'Daniil Biiakov: weby a automatizácie pre malé firmy z Bratislavy. Pracujem priamo s vami, bez sprostredkovateľov.',
    eyebrow: 'Bratislava',
    lead: 'Robím weby a automatizácie pre malé firmy.',
    story: [
      'Volám sa Daniil. Niekoľko rokov som pracoval v digitálnej agentúre — na weboch, migráciách hostingu, nastavovaní domén a e-mailov a na automatizáciách, ktoré prepájajú web s CRM a fakturáciou.',
      'Popri tom študujem informatiku na FEI STU v Bratislave. Dnes pracujem samostatne: priamo s vami, bez sprostredkovateľov a zbytočných stretnutí.',
    ],
    forWhom: {
      heading: 'Pre koho pracujem',
      intro:
        'Pre malé a stredné firmy a živnostníkov na Slovensku, v Česku a v Rakúsku, ale aj pre klientov v zahraničí po anglicky.',
      items: [
        'Štúdiá a salóny',
        'Reštaurácie a kaviarne',
        'Školy a kurzy',
        'Remeselníci a servisy',
      ],
      problem:
        'Najčastejšie riešim staré alebo chýbajúce stránky, dopyty, ktoré sa strácajú v e-maile a telefóne, a veľa ručnej práce s rezerváciami a faktúrami.',
      edge: 'Rozdiel oproti bežnému webu: stránka je rovno prepojená s vašimi procesmi. Dopyty padajú do tabuľky alebo CRM, klient dostane automatickú odpoveď a rezervácie aj pripomienky fungujú samy.',
    },
    tools: {
      heading: 'S čím pracujem',
      text: 'Nástroje, ktoré používam najčastejšie.',
      items: TOOLS,
    },
    languages: {
      heading: 'Jazyky',
      text: 'S klientmi komunikujem po slovensky, po anglicky a po rusky.',
    },
  },
  en: {
    title: 'About',
    description:
      'Daniil Biiakov: websites and automation for small businesses, based in Bratislava. I work directly with you, with no middlemen.',
    eyebrow: 'Bratislava',
    lead: 'I build websites and automations for small businesses.',
    story: [
      'I’m Daniil. For several years I worked at a digital agency — on websites, hosting migrations, domain and email setup, and on automations that connect a website with a CRM and invoicing.',
      'Alongside that, I study computer science at FEI STU in Bratislava. Today I work independently: directly with you, with no middlemen and no pointless meetings.',
    ],
    forWhom: {
      heading: 'Who I work for',
      intro:
        'Small and medium-sized businesses and sole traders in Slovakia, Czechia and Austria, and clients abroad who prefer English.',
      items: [
        'Studios and salons',
        'Restaurants and cafés',
        'Schools and courses',
        'Craftspeople and service businesses',
      ],
      problem:
        'Most often I deal with an outdated or missing website, enquiries that get lost in email and phone calls, and a lot of manual work with bookings and invoices.',
      edge: 'What sets this apart from an ordinary website: it is connected to your processes from day one. Enquiries land in a spreadsheet or CRM, the customer gets an automatic reply, and bookings and reminders run on their own.',
    },
    tools: {
      heading: 'What I work with',
      text: 'The tools I use most often.',
      items: TOOLS,
    },
    languages: {
      heading: 'Languages',
      text: 'I work with clients in Slovak, English and Russian.',
    },
  },
};

/** The 404 page shows both languages: a static host serves one 404 file for every URL. */
export const notFoundCopy: Record<Lang, NotFoundCopy> = {
  sk: {
    title: 'Stránka sa nenašla',
    text: 'Stránka, ktorú hľadáte, neexistuje alebo bola presunutá.',
    home: 'Späť na úvod',
    contact: 'Kontakt',
  },
  en: {
    title: 'Page not found',
    text: 'The page you are looking for does not exist or has moved.',
    home: 'Back to home',
    contact: 'Contact',
  },
};
