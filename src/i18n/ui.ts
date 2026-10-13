export const languages = ['sk', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'sk';

const sk = {
  skipToContent: 'Preskočiť na obsah',
  mainNav: 'Hlavná navigácia',
  menu: 'Menu',
  navServices: 'Služby',
  navProjects: 'Projekty',
  navAbout: 'O mne',
  navContact: 'Kontakt',
  ctaConsultation: 'Bezplatná konzultácia',
  tagline: 'Weby a automatizácia pre malé firmy. Rýchlo a poriadne.',
  switchLangLabel: 'Switch to English',
  switchLangText: 'EN',
  footerContact: 'Kontakt',
  footerLegal: 'Fakturačné údaje',
  footerQuickCall: 'Rýchly hovor (15 min)',
  footerSole: 'Živnostník',
  footerIco: 'IČO',
  footerDic: 'DIČ',
  footerVat: 'Nie som platiteľ DPH.',
  footerPrivacy: 'Ochrana údajov',
  footerRights: 'Všetky práva vyhradené.',
} as const;

type Strings = Record<keyof typeof sk, string>;

const en: Strings = {
  skipToContent: 'Skip to content',
  mainNav: 'Main navigation',
  menu: 'Menu',
  navServices: 'Services',
  navProjects: 'Projects',
  navAbout: 'About',
  navContact: 'Contact',
  ctaConsultation: 'Free consultation',
  tagline: 'Websites and automation for small businesses. Fast, and done right.',
  switchLangLabel: 'Prepnúť na slovenčinu',
  switchLangText: 'SK',
  footerContact: 'Contact',
  footerLegal: 'Business details',
  footerQuickCall: 'Quick call (15 min)',
  footerSole: 'Sole trader',
  footerIco: 'Company ID (IČO)',
  footerDic: 'Tax ID (DIČ)',
  footerVat: 'Not a VAT payer.',
  footerPrivacy: 'Privacy',
  footerRights: 'All rights reserved.',
};

export const ui: Record<Lang, Strings> = { sk, en };

export type UiKey = keyof Strings;

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key];
}

/** Route map from CLAUDE.md. Every path ends with a slash (astro `trailingSlash: 'always'`). */
export const routes = {
  home: { sk: '/', en: '/en/' },
  projects: { sk: '/projekty/', en: '/en/projects/' },
  services: { sk: '/sluzby/', en: '/en/services/' },
  about: { sk: '/o-mne/', en: '/en/about/' },
  contact: { sk: '/kontakt/', en: '/en/contact/' },
  privacy: { sk: '/ochrana-udajov/', en: '/en/privacy/' },
  thankYou: { sk: '/dakujem/', en: '/en/thank-you/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

export function route(lang: Lang, key: RouteKey): string {
  return routes[key][lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === 'sk' ? 'en' : 'sk';
}

/** Narrows `Astro.currentLocale` to a supported language, falling back to the default. */
export function getLang(locale: string | undefined): Lang {
  return languages.find((code) => code === locale) ?? defaultLang;
}

/** Case page URL. A case has the same slug in both languages. */
export function projectPath(lang: Lang, slug: string): string {
  return `${routes.projects[lang]}${slug}/`;
}

const withTrailingSlash = (path: string): string => (path.endsWith('/') ? path : `${path}/`);

/**
 * URLs of the page equivalent to `pathname` in every language, or undefined for pages
 * outside the route table. Used by hreflang and the language switch, because Astro's
 * built-in i18n cannot map translated slugs (`/projekty/` ↔ `/en/projects/`).
 */
export function resolveAlternates(pathname: string): Record<Lang, string> | undefined {
  const path = withTrailingSlash(pathname);

  for (const paths of Object.values(routes)) {
    if (languages.some((lang) => paths[lang] === path)) {
      return { sk: paths.sk, en: paths.en };
    }
  }

  for (const lang of languages) {
    const base = routes.projects[lang];
    if (!path.startsWith(base)) continue;

    const slug = path.slice(base.length, -1);
    if (slug && !slug.includes('/')) {
      return { sk: projectPath('sk', slug), en: projectPath('en', slug) };
    }
  }

  return undefined;
}
