import { describe, expect, it } from 'vitest';
import { aboutCopy, notFoundCopy, servicesCopy } from './pages-copy';

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
};

/** Dot-separated paths of every leaf (arrays count by length), to compare the two languages. */
const leafPaths = (value: unknown, prefix = ''): string[] => {
  if (Array.isArray(value)) return [`${prefix}[${value.length}]`];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      leafPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
};

const copies = { servicesCopy, aboutCopy, notFoundCopy };

describe.each(Object.entries(copies))('%s', (_name, copy) => {
  it('has no empty strings in either language', () => {
    for (const lang of ['sk', 'en'] as const) {
      const strings = collectStrings(copy[lang]);
      expect(strings.length).toBeGreaterThan(0);
      for (const text of strings) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has the same structure in both languages', () => {
    expect(leafPaths(copy.en).sort()).toEqual(leafPaths(copy.sk).sort());
  });
});

describe('servicesCopy extras', () => {
  it('lists support and hourly work from the brief with their rates', () => {
    expect(servicesCopy.sk.extras.map((extra) => extra.id)).toEqual(['support', 'hourly']);
    expect(servicesCopy.sk.extras[0]?.price).toContain('25');
    expect(servicesCopy.sk.extras[1]?.price).toContain('20');
  });
});

describe('aboutCopy', () => {
  it('lists the tools and client languages from the brief', () => {
    expect(aboutCopy.sk.tools.items).toContain('Astro');
    expect(aboutCopy.sk.tools.items).toContain('n8n');
    expect(aboutCopy.en.tools.items).toEqual(aboutCopy.sk.tools.items);
  });
});
