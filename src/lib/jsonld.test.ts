import { describe, expect, it } from 'vitest';
import { site } from '../config';
import { buildHomeJsonLd, buildProjectJsonLd, type ProjectJsonLdInput } from './jsonld';

const ORIGIN = 'https://daniilbiiakov.com';

type Node = Record<string, unknown> & { '@type': string };

const graphNodes = (lang: 'sk' | 'en'): Node[] =>
  buildHomeJsonLd({ origin: ORIGIN, lang, description: 'Popis' })['@graph'] as Node[];

describe('buildHomeJsonLd', () => {
  it('describes the person and the professional service in one graph', () => {
    const types = graphNodes('sk').map((node) => node['@type']);
    expect(types).toEqual(['Person', 'ProfessionalService']);
  });

  it('declares the schema.org context', () => {
    expect(buildHomeJsonLd({ origin: ORIGIN, lang: 'en', description: 'x' })['@context']).toBe(
      'https://schema.org',
    );
  });

  it('ties the service to the person through @id references', () => {
    const [person, service] = graphNodes('sk') as [Node, Node];
    expect(service.provider).toEqual({ '@id': person['@id'] });
    expect(String(person['@id']).startsWith(ORIGIN)).toBe(true);
  });

  it('uses facts from the brief only', () => {
    const [person] = graphNodes('en') as [Node];
    expect(person.name).toBe(site.legalName);
    expect(person.email).toBe(site.email);
    expect(person.sameAs).toEqual([site.linkedin]);
    expect(person.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Bratislava',
      addressCountry: 'SK',
    });
    expect(person.knowsLanguage).toEqual(['sk', 'en', 'ru']);
  });

  it('points the service at the homepage of the requested language', () => {
    const sk = graphNodes('sk')[1] as Node;
    const en = graphNodes('en')[1] as Node;
    expect(sk.url).toBe(`${ORIGIN}/`);
    expect(en.url).toBe(`${ORIGIN}/en/`);
  });

  it('translates the job title and service types', () => {
    expect((graphNodes('sk')[0] as Node).jobTitle).not.toBe((graphNodes('en')[0] as Node).jobTitle);
    expect((graphNodes('sk')[1] as Node).serviceType).not.toEqual(
      (graphNodes('en')[1] as Node).serviceType,
    );
  });

  it('survives a JSON round trip without losing anything (no undefined values)', () => {
    const data = buildHomeJsonLd({ origin: ORIGIN, lang: 'sk', description: 'Popis' });
    expect(JSON.parse(JSON.stringify(data))).toEqual(data);
  });
});

describe('buildProjectJsonLd', () => {
  const input: ProjectJsonLdInput = {
    origin: ORIGIN,
    url: `${ORIGIN}/projekty/bistro-lipa/`,
    lang: 'sk',
    title: 'Bistro Lipa',
    description: 'Rýchly web pre malé bistro.',
    year: 2026,
    stack: ['Astro', 'Tailwind', 'n8n'],
    imageUrl: `${ORIGIN}/_astro/cover.jpg`,
    concept: true,
  };

  it('builds a CreativeWork with the case data', () => {
    const data = buildProjectJsonLd(input) as Node;
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('CreativeWork');
    expect(data.name).toBe('Bistro Lipa');
    expect(data.url).toBe(input.url);
    expect(data.inLanguage).toBe('sk');
    expect(data.dateCreated).toBe('2026');
    expect(data.image).toBe(input.imageUrl);
    expect(data.keywords).toBe('Astro, Tailwind, n8n');
  });

  it('credits the author', () => {
    const data = buildProjectJsonLd(input) as Node;
    expect(data.author).toEqual({ '@type': 'Person', name: site.legalName, url: ORIGIN });
  });

  it('marks concept projects so they are not mistaken for client work', () => {
    expect((buildProjectJsonLd(input) as Node).genre).toBe('Concept');
    expect((buildProjectJsonLd({ ...input, concept: false }) as Node).genre).toBeUndefined();
  });

  it('survives a JSON round trip for a real (non-concept) project', () => {
    const data = buildProjectJsonLd({ ...input, concept: false });
    expect(JSON.parse(JSON.stringify(data))).toEqual(data);
  });
});
