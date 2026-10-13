import { describe, expect, it } from 'vitest';
import { buildFaqJsonLd, serializeJsonLd } from './faq-jsonld';

const items = [
  { question: 'How much?', answer: 'From €290.' },
  { question: 'How long?', answer: '3–5 days.' },
];

describe('buildFaqJsonLd', () => {
  it('builds a schema.org FAQPage', () => {
    const data = buildFaqJsonLd(items);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('FAQPage');
  });

  it('maps every item to a Question with an accepted Answer', () => {
    const { mainEntity } = buildFaqJsonLd(items);
    expect(mainEntity).toHaveLength(2);
    expect(mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'How much?',
      acceptedAnswer: { '@type': 'Answer', text: 'From €290.' },
    });
  });

  it('does not mutate the input', () => {
    const input = [...items];
    buildFaqJsonLd(input);
    expect(input).toEqual(items);
  });
});

describe('serializeJsonLd', () => {
  it('round-trips through JSON.parse', () => {
    const data = buildFaqJsonLd(items);
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });

  it('escapes "<" so the payload cannot close the script tag', () => {
    const output = serializeJsonLd({ text: '</script><b>x</b>' });
    expect(output).not.toContain('<');
    expect(JSON.parse(output)).toEqual({ text: '</script><b>x</b>' });
  });
});
