import { site } from '../config';
import { route, type Lang } from '../i18n/ui';

export type JsonLdNode = Record<string, unknown>;

export interface HomeJsonLd {
  '@context': 'https://schema.org';
  '@graph': readonly JsonLdNode[];
}

export interface HomeJsonLdInput {
  /** Site origin without a trailing slash, e.g. `https://daniilbiiakov.com`. */
  origin: string;
  lang: Lang;
  description: string;
}

export interface ProjectJsonLdInput {
  origin: string;
  /** Absolute URL of the case page. */
  url: string;
  lang: Lang;
  title: string;
  description: string;
  year: number;
  stack: readonly string[];
  /** Absolute URL of the case image. */
  imageUrl: string;
  concept: boolean;
}

// Facts from docs/brief.md: city, markets and the languages spoken with clients.
const CITY = 'Bratislava';
const COUNTRY_CODE = 'SK';
const CLIENT_LANGUAGES = ['sk', 'en', 'ru'] as const;
const AREA_SERVED = ['Slovakia', 'Czechia', 'Austria'] as const;

const JOB_TITLE: Record<Lang, string> = { sk: 'Webový vývojár', en: 'Web developer' };
const SERVICE_TYPES: Record<Lang, readonly string[]> = {
  sk: ['Tvorba webov a webových aplikácií', 'Automatizácia firemných procesov'],
  en: ['Web and web app development', 'Business process automation'],
};

/** Person and ProfessionalService for the homepage, linked by @id. */
export function buildHomeJsonLd({ origin, lang, description }: HomeJsonLdInput): HomeJsonLd {
  const personId = `${origin}/#person`;
  const address = {
    '@type': 'PostalAddress',
    addressLocality: CITY,
    addressCountry: COUNTRY_CODE,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: site.legalName,
        url: `${origin}/`,
        email: site.email,
        jobTitle: JOB_TITLE[lang],
        address,
        knowsLanguage: [...CLIENT_LANGUAGES],
        sameAs: [site.linkedin],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${origin}/#service`,
        name: site.name,
        url: `${origin}${route(lang, 'home')}`,
        description,
        provider: { '@id': personId },
        email: site.email,
        address,
        areaServed: [...AREA_SERVED],
        availableLanguage: [...CLIENT_LANGUAGES],
        serviceType: [...SERVICE_TYPES[lang]],
      },
    ],
  };
}

/** CreativeWork for a case page. Concept projects say so, so they are not read as client work. */
export function buildProjectJsonLd(input: ProjectJsonLdInput): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.title,
    description: input.description,
    url: input.url,
    inLanguage: input.lang,
    dateCreated: String(input.year),
    image: input.imageUrl,
    keywords: input.stack.join(', '),
    author: { '@type': 'Person', name: site.legalName, url: input.origin },
    ...(input.concept ? { genre: 'Concept' } : {}),
  };
}
