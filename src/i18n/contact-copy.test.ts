import { describe, expect, it } from 'vitest';
import { BUDGET_VALUES } from '../lib/contact-validation';
import { contactCopy } from './copy';
import { privacyCopy } from './privacy';

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
};

/** Dot-separated paths of every leaf, so the two languages can be compared structurally. */
const leafPaths = (value: unknown, prefix = ''): string[] => {
  if (Array.isArray(value)) return [`${prefix}[${value.length}]`];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      leafPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
};

describe('contactCopy', () => {
  it('has no empty strings in either language', () => {
    for (const lang of ['sk', 'en'] as const) {
      const strings = collectStrings(contactCopy[lang]);
      expect(strings.length).toBeGreaterThan(0);
      for (const text of strings) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has the same structure in both languages', () => {
    expect(leafPaths(contactCopy.en).sort()).toEqual(leafPaths(contactCopy.sk).sort());
  });

  it('labels every budget option in both languages', () => {
    for (const lang of ['sk', 'en'] as const) {
      expect(Object.keys(contactCopy[lang].budget).sort()).toEqual([...BUDGET_VALUES].sort());
    }
  });
});

describe('privacyCopy', () => {
  it('has no empty strings in either language', () => {
    for (const lang of ['sk', 'en'] as const) {
      for (const text of collectStrings(privacyCopy[lang])) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has the same sections in both languages', () => {
    expect(privacyCopy.en.sections).toHaveLength(privacyCopy.sk.sections.length);
    privacyCopy.sk.sections.forEach((section, index) => {
      expect(privacyCopy.en.sections[index]?.body).toHaveLength(section.body.length);
    });
  });

  it('marks the same number of open [TODO] items in both languages', () => {
    const count = (lang: 'sk' | 'en') =>
      collectStrings(privacyCopy[lang]).join(' ').split('[TODO').length - 1;
    expect(count('en')).toBe(count('sk'));
  });
});
