import { describe, expect, it } from 'vitest';
import { homeCopy, projectTypeLabels } from './copy';

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
};

describe('homeCopy', () => {
  it('has no empty strings in either language', () => {
    for (const lang of ['sk', 'en'] as const) {
      const strings = collectStrings(homeCopy[lang]);
      expect(strings.length).toBeGreaterThan(0);
      for (const text of strings) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has the same number of how-it-works steps and FAQ items in both languages', () => {
    expect(homeCopy.en.how.steps).toHaveLength(homeCopy.sk.how.steps.length);
    expect(homeCopy.en.faq.items).toHaveLength(homeCopy.sk.faq.items.length);
  });

  it('keeps the four steps from the brief', () => {
    expect(homeCopy.sk.how.steps).toHaveLength(4);
  });

  it('has six FAQ items from the brief', () => {
    expect(homeCopy.sk.faq.items).toHaveLength(6);
  });

  it('writes FAQ questions as questions', () => {
    for (const lang of ['sk', 'en'] as const) {
      for (const item of homeCopy[lang].faq.items) {
        expect(item.question.endsWith('?')).toBe(true);
      }
    }
  });
});

describe('projectTypeLabels', () => {
  it('labels every project type in both languages', () => {
    for (const lang of ['sk', 'en'] as const) {
      expect(Object.keys(projectTypeLabels[lang]).sort()).toEqual([
        'automation',
        'mobile',
        'webapp',
        'website',
      ]);
    }
  });
});
