import type { FaqItem } from '../i18n/copy';

export interface FaqPageJsonLd {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }[];
}

/** schema.org FAQPage built from the same items the page renders, so markup and visible text match. */
export function buildFaqJsonLd(items: readonly FaqItem[]): FaqPageJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** JSON for a `<script type="application/ld+json">` tag; `<` is escaped so it cannot close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
