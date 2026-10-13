import type { BudgetValue } from '../lib/contact-validation';
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
  /** Search-result title (≤ 60 characters) and description (70–160). Unique per language. */
  meta: { title: string; description: string };
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
    meta: {
      title: 'Weby a automatizácia pre malé firmy | Daniil',
      description:
        'Rýchle weby a automatizácia pre malé firmy: dopyty padajú rovno do tabuľky, klient dostane automatickú odpoveď a rezervácie fungujú samy.',
    },
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
    meta: {
      title: 'Websites and automation for small businesses | Daniil',
      description:
        'Fast websites and automation for small businesses: enquiries go straight to a spreadsheet, customers get an automatic reply, bookings run on their own.',
    },
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

export interface ProjectsCopy {
  list: {
    title: string;
    description: string;
    intro: string;
    filterLabel: string;
    all: string;
    /** Contains a `{count}` placeholder. */
    shown: string;
    emptyTitle: string;
    emptyText: string;
    emptyCta: string;
  };
  case: {
    back: string;
    conceptNotice: string;
    year: string;
    client: string;
    brief: string;
    solution: string;
    result: string;
    ownerGets: string;
    stack: string;
    gallery: string;
    demo: string;
    code: string;
    next: string;
  };
}

/** Copy for the projects list and case pages. Concept projects carry no invented results. */
export const projectsCopy: Record<Lang, ProjectsCopy> = {
  sk: {
    list: {
      title: 'Projekty',
      description:
        'Ukážky práce: weby, webové aplikácie a automatizácie pre malé firmy. Pozrite si, ako pristupujem k zadaniam.',
      intro: 'Ukážky toho, ako pristupujem k zadaniam malých firiem.',
      filterLabel: 'Filtrovať podľa typu',
      all: 'Všetky',
      shown: 'Zobrazené projekty: {count}',
      emptyTitle: 'Skutočné projekty pribudnú čoskoro',
      emptyText:
        'Zatiaľ pripravujem prvé ukážky. Ak potrebujete web alebo automatizáciu, ozvite sa a vysvetlím vám, ako by som postupoval.',
      emptyCta: 'Bezplatná konzultácia',
    },
    case: {
      back: '← Všetky projekty',
      conceptNotice:
        'Toto je koncept, nie projekt skutočného klienta. Ukazuje, ako by som pristúpil k takémuto zadaniu.',
      year: 'Rok',
      client: 'Klient',
      brief: 'Úloha',
      solution: 'Riešenie',
      result: 'Výsledok',
      ownerGets: 'Čo získa majiteľ',
      stack: 'Technológie',
      gallery: 'Galéria',
      demo: 'Pozrieť demo',
      code: 'Zdrojový kód',
      next: 'Ďalší projekt',
    },
  },
  en: {
    list: {
      title: 'Projects',
      description:
        'Examples of work: websites, web apps and automations for small businesses. See how I approach a brief.',
      intro: 'A look at how I approach briefs from small businesses.',
      filterLabel: 'Filter by type',
      all: 'All',
      shown: 'Projects shown: {count}',
      emptyTitle: 'Real projects are coming soon',
      emptyText:
        'I am preparing the first examples. If you need a website or automation, get in touch and I will explain how I would approach it.',
      emptyCta: 'Free consultation',
    },
    case: {
      back: '← All projects',
      conceptNotice:
        'This is a concept, not a real client project. It shows how I would approach a brief like this.',
      year: 'Year',
      client: 'Client',
      brief: 'The brief',
      solution: 'Solution',
      result: 'Result',
      ownerGets: 'What the owner gets',
      stack: 'Technologies',
      gallery: 'Gallery',
      demo: 'View demo',
      code: 'Source code',
      next: 'Next project',
    },
  },
};

export interface ContactCopy {
  page: {
    title: string;
    description: string;
    intro: string;
    directHeading: string;
    emailLabel: string;
    whatsappLabel: string;
    linkedinLabel: string;
  };
  form: {
    heading: string;
    required: string;
    nameLabel: string;
    emailLabel: string;
    projectTypeLabel: string;
    projectTypePlaceholder: string;
    projectTypeOther: string;
    budgetLabel: string;
    messageLabel: string;
    messageHint: string;
    consentBefore: string;
    consentLink: string;
    consentAfter: string;
    submit: string;
    submitting: string;
    noscript: string;
  };
  errors: {
    required: string;
    tooShort: string;
    tooLong: string;
    invalid: string;
    emailInvalid: string;
    consent: string;
    summary: string;
  };
  states: { error: string; verification: string; timeout: string; success: string };
  unavailable: { title: string; text: string };
  budget: Record<BudgetValue, string>;
  cal: { heading: string; text: string; button: string; loading: string; fallback: string };
  thanks: {
    title: string;
    description: string;
    heading: string;
    text: string;
    home: string;
    book: string;
  };
}

/** Contact page, form and thank-you copy. Budget ranges are orientation points based on the brief's packages. */
export const contactCopy: Record<Lang, ContactCopy> = {
  sk: {
    page: {
      title: 'Kontakt',
      description: 'Napíšte mi o svojom projekte alebo si rovno dohodnite bezplatnú konzultáciu.',
      intro:
        'Napíšte, čo potrebujete, a ozvem sa vám e-mailom. Ak chcete, môžete si rovno vybrať termín hovoru.',
      directHeading: 'Alebo priamo',
      emailLabel: 'E-mail',
      whatsappLabel: 'WhatsApp',
      linkedinLabel: 'LinkedIn',
    },
    form: {
      heading: 'Napíšte mi',
      required: 'povinné',
      nameLabel: 'Meno',
      emailLabel: 'E-mail',
      projectTypeLabel: 'Typ projektu',
      projectTypePlaceholder: 'Vyberte možnosť',
      projectTypeOther: 'Iné',
      budgetLabel: 'Orientačný rozpočet',
      messageLabel: 'Správa',
      messageHint: 'Stačí pár viet: čo potrebujete a dokedy.',
      consentBefore:
        'Súhlasím so spracovaním osobných údajov na účely odpovede na moju správu. Viac v ',
      consentLink: 'zásadách ochrany údajov',
      consentAfter: '.',
      submit: 'Odoslať správu',
      submitting: 'Odosielam…',
      noscript: 'Na odoslanie formulára je potrebný JavaScript. Napíšte mi radšej na e-mail.',
    },
    errors: {
      required: 'Vyplňte toto pole.',
      tooShort: 'Text je príliš krátky.',
      tooLong: 'Text je príliš dlhý.',
      invalid: 'Vyberte jednu z možností.',
      emailInvalid: 'Zadajte e-mail v tvare meno@domena.sk.',
      consent: 'Na odoslanie je potrebný váš súhlas.',
      summary: 'Opravte prosím označené polia.',
    },
    states: {
      error: 'Správu sa nepodarilo odoslať. Skúste to prosím znova alebo mi napíšte na e-mail.',
      verification: 'Overenie proti spamu zlyhalo. Skúste to prosím znova.',
      timeout: 'Odpoveď trvá príliš dlho. Skúste to prosím znova alebo mi napíšte na e-mail.',
      success: 'Ďakujem, správa je odoslaná.',
    },
    unavailable: {
      title: 'Formulár je dočasne nedostupný',
      text: 'Napíšte mi prosím priamo na e-mail.',
    },
    budget: {
      'lt-300': 'Do 300 €',
      '300-700': '300 – 700 €',
      '700-1500': '700 – 1 500 €',
      'gt-1500': 'Nad 1 500 €',
      unsure: 'Neviem, potrebujem poradiť',
    },
    cal: {
      heading: 'Radšej hovor?',
      text: 'Vyberte si termín bezplatnej 30-minútovej konzultácie.',
      button: 'Zobraziť kalendár',
      loading: 'Načítavam kalendár…',
      fallback: 'Otvoriť rezerváciu v novom okne',
    },
    thanks: {
      title: 'Ďakujem',
      description: 'Správa bola odoslaná.',
      heading: 'Ďakujem!',
      text: 'Správu som dostal a ozvem sa vám e-mailom. Potvrdenie nájdete aj vo svojej schránke.',
      home: 'Späť na úvod',
      book: 'Dohodnúť konzultáciu',
    },
  },
  en: {
    page: {
      title: 'Contact',
      description: 'Tell me about your project, or book a free consultation straight away.',
      intro:
        'Tell me what you need and I will reply by email. If you prefer, you can pick a time for a call right away.',
      directHeading: 'Or reach me directly',
      emailLabel: 'Email',
      whatsappLabel: 'WhatsApp',
      linkedinLabel: 'LinkedIn',
    },
    form: {
      heading: 'Write to me',
      required: 'required',
      nameLabel: 'Name',
      emailLabel: 'Email',
      projectTypeLabel: 'Project type',
      projectTypePlaceholder: 'Choose an option',
      projectTypeOther: 'Other',
      budgetLabel: 'Approximate budget',
      messageLabel: 'Message',
      messageHint: 'A few sentences are enough: what you need and by when.',
      consentBefore:
        'I agree to my personal data being processed to reply to my message. More in the ',
      consentLink: 'privacy policy',
      consentAfter: '.',
      submit: 'Send message',
      submitting: 'Sending…',
      noscript: 'JavaScript is needed to send the form. Please email me instead.',
    },
    errors: {
      required: 'Please fill in this field.',
      tooShort: 'This text is too short.',
      tooLong: 'This text is too long.',
      invalid: 'Please choose one of the options.',
      emailInvalid: 'Enter an email like name@domain.com.',
      consent: 'Your consent is needed to send the form.',
      summary: 'Please fix the highlighted fields.',
    },
    states: {
      error: 'The message could not be sent. Please try again or email me.',
      verification: 'The spam check failed. Please try again.',
      timeout: 'This is taking too long. Please try again or email me.',
      success: 'Thank you, your message has been sent.',
    },
    unavailable: {
      title: 'The form is temporarily unavailable',
      text: 'Please email me directly.',
    },
    budget: {
      'lt-300': 'Up to €300',
      '300-700': '€300 – €700',
      '700-1500': '€700 – €1,500',
      'gt-1500': 'Over €1,500',
      unsure: 'Not sure, I need advice',
    },
    cal: {
      heading: 'Prefer a call?',
      text: 'Pick a time for a free 30-minute consultation.',
      button: 'Show calendar',
      loading: 'Loading the calendar…',
      fallback: 'Open the booking page in a new window',
    },
    thanks: {
      title: 'Thank you',
      description: 'Your message has been sent.',
      heading: 'Thank you!',
      text: 'I have received your message and will reply by email. You will also find a confirmation in your inbox.',
      home: 'Back to home',
      book: 'Book a consultation',
    },
  },
};
