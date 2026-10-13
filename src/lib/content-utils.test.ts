import { describe, expect, it } from 'vitest';
import {
  isPublished,
  missingTranslations,
  nextEntry,
  presentTypes,
  sortByOrder,
  splitEntryId,
} from './content-utils';

describe('missingTranslations', () => {
  it('returns nothing when every slug exists in both languages', () => {
    expect(missingTranslations(['sk/a', 'en/a', 'sk/b', 'en/b'])).toEqual([]);
  });

  it('returns slugs that exist in only one language', () => {
    expect(missingTranslations(['sk/a', 'en/a', 'sk/only-sk', 'en/only-en'])).toEqual([
      'only-en',
      'only-sk',
    ]);
  });

  it('returns an empty list for no ids', () => {
    expect(missingTranslations([])).toEqual([]);
  });
});

describe('presentTypes', () => {
  const entry = (type: string) => ({ data: { type } });

  it('lists each type once, in order of first appearance', () => {
    const types = presentTypes([entry('webapp'), entry('website'), entry('webapp')]);
    expect(types).toEqual(['webapp', 'website']);
  });

  it('returns an empty list for no entries', () => {
    expect(presentTypes([])).toEqual([]);
  });
});

describe('nextEntry', () => {
  const entries = [{ id: 'sk/a' }, { id: 'sk/b' }, { id: 'sk/c' }];

  it('returns the following entry', () => {
    expect(nextEntry(entries, 'sk/a')).toEqual({ id: 'sk/b' });
  });

  it('wraps around from the last entry to the first', () => {
    expect(nextEntry(entries, 'sk/c')).toEqual({ id: 'sk/a' });
  });

  it('returns undefined when there is only one entry', () => {
    expect(nextEntry([{ id: 'sk/a' }], 'sk/a')).toBeUndefined();
  });

  it('returns undefined for an unknown id', () => {
    expect(nextEntry(entries, 'sk/zzz')).toBeUndefined();
  });
});

describe('splitEntryId', () => {
  it('splits a collection id into language and slug', () => {
    expect(splitEntryId('sk/bistro-lipa')).toEqual({ lang: 'sk', slug: 'bistro-lipa' });
    expect(splitEntryId('en/studio-pohyb')).toEqual({ lang: 'en', slug: 'studio-pohyb' });
  });

  it('throws on an id without a supported language prefix', () => {
    expect(() => splitEntryId('bistro-lipa')).toThrow();
    expect(() => splitEntryId('de/bistro-lipa')).toThrow();
    expect(() => splitEntryId('sk/')).toThrow();
  });
});

describe('isPublished', () => {
  it('hides drafts in production', () => {
    expect(isPublished({ draft: true }, true)).toBe(false);
  });

  it('shows drafts outside production', () => {
    expect(isPublished({ draft: true }, false)).toBe(true);
  });

  it('always shows published entries', () => {
    expect(isPublished({ draft: false }, true)).toBe(true);
    expect(isPublished({ draft: false }, false)).toBe(true);
  });
});

describe('sortByOrder', () => {
  const entry = (id: string, order: number) => ({ id, data: { order } });

  it('sorts ascending by data.order', () => {
    const sorted = sortByOrder([entry('c', 3), entry('a', 1), entry('b', 2)]);
    expect(sorted.map((item) => item.id)).toEqual(['a', 'b', 'c']);
  });

  it('keeps the original order for equal values', () => {
    const sorted = sortByOrder([entry('x', 1), entry('y', 1), entry('z', 1)]);
    expect(sorted.map((item) => item.id)).toEqual(['x', 'y', 'z']);
  });

  it('does not mutate the input array', () => {
    const input = [entry('b', 2), entry('a', 1)];
    sortByOrder(input);
    expect(input.map((item) => item.id)).toEqual(['b', 'a']);
  });
});
