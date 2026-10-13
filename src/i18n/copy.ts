import type { Lang } from './ui';

export interface Step {
  title: string;
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type ProjectType = 'website' | 'webapp' | 'automation' | 'mobile';

export interface HomeCopy {
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    languages: string;
  };
  featured: { heading: string; note: string; conceptLabel: string };
  services: { heading: string; from: string; vatNote: string; promo: string };
  how: { heading: string; steps: readonly Step[] };
  testimonials: { heading: string };
  faq: { heading: string; items: readonly FaqItem[]; moreQuestions: string };
  cta: { heading: string; text: string; primary: string; secondary: string };
}

/** Homepage copy. Source: docs/brief.md. No invented figures, clients or testimonials. */
export const homeCopy: Record<Lang, HomeCopy> = {
  sk: {
    hero: {
      eyebrow: 'Daniil Biiakov · Bratislava',
      title: 'Weby a automatizácia pre malé firmy. Rýchlo a poriadne.',
      lead: 'Web, ktorý je prepojený s vašimi procesmi: dopyty chodia rovno do tabuľky, zákazník dostane automatickú odpoveď a rezervácie si pripomínajú samy.',
      primaryCta: 'Bezplatná konzultácia (30 min)',
      secondaryCta: 'Pozrieť služby',
      languages: 'Komunikujem po slovensky, po anglicky a po rusky.',
    },
    featured: {
      heading: 'Vybrané projekty',
      note: 'Zatiaľ ukazujem koncepty, ktoré som pripravil ako ukážky. Skutočné projekty pribudnú.',
      conceptLabel: 'Koncept',
    },
    services: {
      heading: 'Služby a ceny',
      from: 'od',
      vatNote:
        'Ceny sú konečné, nie som platiteľ DPH. Presnú cenu dostanete po konzultácii, vždy ako fixnú sumu.',
      promo: 'Prvým trom klientom dávam zľavu 20 % výmenou za referenciu a súhlas ukázať projekt.',
    },
    how: {
      heading: 'Ako pracujem',
      steps: [
        {
          title: 'Bezplatná konzultácia',
          text: '30 minút. Prejdeme, čo potrebujete a čo sa dá zautomatizovať.',
        },
        {
          title: 'Ponuka',
          text: 'Fixná cena a termín do 1–2 dní. Bez prekvapení za hodiny práce.',
        },
        {
          title: 'Tvorba',
          text: 'Pracovnú verziu vám ukazujem priebežne a úpravy robím hneď.',
        },
        {
          title: 'Spustenie a podpora',
          text: 'Web spustím na vašej doméne a dám vám návod. Podpora podľa potreby.',
        },
      ],
    },
    testimonials: { heading: 'Čo hovoria klienti' },
    faq: {
      heading: 'Časté otázky',
      moreQuestions: 'Máte inú otázku?',
      items: [
        {
          question: 'Koľko stojí web?',
          answer:
            'Jednostránkový web od 290 €, firemný web od 590 €. Presnú cenu dostanete po krátkej konzultácii, vždy ako fixnú sumu.',
        },
        {
          question: 'Ako dlho to trvá?',
          answer: 'Jednostránkový web 3–5 dní, firemný web 1–2 týždne.',
        },
        {
          question: 'Čo potrebujete odo mňa?',
          answer: 'Logo, fotky (ak máte) a základné informácie o firme. S textami pomôžem.',
        },
        {
          question: 'Môžem si web upravovať sám?',
          answer:
            'Áno, texty a menu sa dajú upravovať jednoducho a ukážem vám ako. Alebo to urobím za vás v rámci podpory.',
        },
        {
          question: 'Kto sa bude starať o web po spustení?',
          answer: 'Môžem ja (podpora od 25 € mesačne), alebo dostanete všetko odovzdané.',
        },
        {
          question: 'Pracujete aj mimo Slovenska?',
          answer: 'Áno, aj po česky a po anglicky, online.',
        },
      ],
    },
    cta: {
      heading: 'Máte projekt? Dohodnime si krátky hovor.',
      text: '30 minút zadarmo. Preberieme, čo potrebujete, a do 1–2 dní dostanete fixnú cenu a termín.',
      primary: 'Bezplatná konzultácia',
      secondary: 'Napísať e-mail',
    },
  },
  en: {
    hero: {
      eyebrow: 'Daniil Biiakov · Bratislava',
      title: 'Websites and automation for small businesses. Fast, and done right.',
      lead: 'A website connected to how you work: enquiries land straight in a spreadsheet, customers get an automatic reply, and bookings remind themselves.',
      primaryCta: 'Free consultation (30 min)',
      secondaryCta: 'See services',
      languages: 'I work in Slovak, English and Russian.',
    },
    featured: {
      heading: 'Selected projects',
      note: 'For now these are concepts I built as demos. Real projects will be added.',
      conceptLabel: 'Demo project',
    },
    services: {
      heading: 'Services and pricing',
      from: 'from',
      vatNote:
        'Prices are final: I am not a VAT payer. You get the exact price after a consultation, always as a fixed amount.',
      promo:
        'The first three clients get 20% off in exchange for a testimonial and permission to show the project.',
    },
    how: {
      heading: 'How I work',
      steps: [
        {
          title: 'Free consultation',
          text: '30 minutes. We go through what you need and what can be automated.',
        },
        {
          title: 'Proposal',
          text: 'A fixed price and a date within 1–2 days. No surprises from hourly billing.',
        },
        {
          title: 'Build',
          text: 'I show you a working version as I go and make changes straight away.',
        },
        {
          title: 'Launch and support',
          text: 'I launch the site on your domain and give you instructions. Support if you want it.',
        },
      ],
    },
    testimonials: { heading: 'What clients say' },
    faq: {
      heading: 'Frequently asked questions',
      moreQuestions: 'Have another question?',
      items: [
        {
          question: 'How much does a website cost?',
          answer:
            'A one-page website starts at €290, a business website at €590. You get the exact price after a short consultation, always as a fixed amount.',
        },
        {
          question: 'How long does it take?',
          answer: 'A one-page website takes 3–5 days, a business website 1–2 weeks.',
        },
        {
          question: 'What do you need from me?',
          answer:
            'Your logo, photos (if you have them) and basic information about your business. I can help with the text.',
        },
        {
          question: 'Can I edit the website myself?',
          answer:
            'Yes. Text and menus are easy to edit, and I will show you how. Or I can do it for you as part of support.',
        },
        {
          question: 'Who looks after the website after launch?',
          answer: 'I can (support from €25 a month), or you get everything handed over.',
        },
        {
          question: 'Do you work outside Slovakia?',
          answer: 'Yes, in Czech and English too, online.',
        },
      ],
    },
    cta: {
      heading: 'Have a project? Let’s have a short call.',
      text: '30 minutes, free. We go through what you need, and within 1–2 days you get a fixed price and a date.',
      primary: 'Free consultation',
      secondary: 'Send an email',
    },
  },
};

export const projectTypeLabels: Record<Lang, Record<ProjectType, string>> = {
  sk: {
    website: 'Web',
    webapp: 'Webová aplikácia',
    automation: 'Automatizácia',
    mobile: 'Mobilná aplikácia',
  },
  en: {
    website: 'Website',
    webapp: 'Web app',
    automation: 'Automation',
    mobile: 'Mobile app',
  },
};
