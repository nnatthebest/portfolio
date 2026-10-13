import { describe, expect, it } from 'vitest';
import {
  getLang,
  otherLang,
  projectPath,
  resolveAlternates,
  route,
  routes,
  t,
  ui,
  type RouteKey,
} from './ui';

const routeEntries = Object.entries(routes) as [RouteKey, (typeof routes)[RouteKey]][];

describe('routes', () => {
  it.each(routeEntries)('%s has both languages and ends with a slash', (_key, paths) => {
    expect(paths.sk.endsWith('/')).toBe(true);
    expect(paths.en.endsWith('/')).toBe(true);
  });

  it('keeps sk at the root and en under /en/', () => {
    for (const [, paths] of routeEntries) {
      expect(paths.sk.startsWith('/en/')).toBe(false);
      expect(paths.en.startsWith('/en/')).toBe(true);
    }
  });

  it('has no duplicate paths', () => {
    const all = routeEntries.flatMap(([, paths]) => [paths.sk, paths.en]);
    expect(new Set(all).size).toBe(all.length);
  });

  it('returns the CLAUDE.md paths through route()', () => {
    expect(route('sk', 'projects')).toBe('/projekty/');
    expect(route('en', 'projects')).toBe('/en/projects/');
    expect(route('sk', 'about')).toBe('/o-mne/');
    expect(route('en', 'privacy')).toBe('/en/privacy/');
  });
});

describe('resolveAlternates', () => {
  it.each(routeEntries)('round-trips %s from either language', (_key, paths) => {
    expect(resolveAlternates(paths.sk)).toEqual(paths);
    expect(resolveAlternates(paths.en)).toEqual(paths);
  });

  it('maps translated slugs to the equivalent page', () => {
    expect(resolveAlternates('/projekty/')).toEqual({ sk: '/projekty/', en: '/en/projects/' });
    expect(resolveAlternates('/en/projects/')).toEqual({ sk: '/projekty/', en: '/en/projects/' });
  });

  it('maps a case page with the same slug in both languages', () => {
    const expected = {
      sk: '/projekty/bistro-lipa/',
      en: '/en/projects/bistro-lipa/',
    };
    expect(resolveAlternates('/projekty/bistro-lipa/')).toEqual(expected);
    expect(resolveAlternates('/en/projects/bistro-lipa/')).toEqual(expected);
  });

  it('accepts a path without a trailing slash', () => {
    expect(resolveAlternates('/kontakt')).toEqual({ sk: '/kontakt/', en: '/en/contact/' });
  });

  it('returns undefined for pages outside the route table', () => {
    expect(resolveAlternates('/styleguide/')).toBeUndefined();
    expect(resolveAlternates('/projekty/a/b/')).toBeUndefined();
  });
});

describe('projectPath', () => {
  it('builds a case URL per language', () => {
    expect(projectPath('sk', 'studio-pohyb')).toBe('/projekty/studio-pohyb/');
    expect(projectPath('en', 'studio-pohyb')).toBe('/en/projects/studio-pohyb/');
  });
});

describe('getLang', () => {
  it('passes supported locales through', () => {
    expect(getLang('sk')).toBe('sk');
    expect(getLang('en')).toBe('en');
  });

  it('falls back to the default language', () => {
    expect(getLang(undefined)).toBe('sk');
    expect(getLang('de')).toBe('sk');
  });
});

describe('otherLang', () => {
  it('flips the language', () => {
    expect(otherLang('sk')).toBe('en');
    expect(otherLang('en')).toBe('sk');
  });
});

describe('ui strings', () => {
  it('has the same keys in sk and en', () => {
    expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.sk).sort());
  });

  it('has no empty strings', () => {
    for (const lang of ['sk', 'en'] as const) {
      for (const value of Object.values(ui[lang])) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('returns the string for the requested language through t()', () => {
    expect(t('sk', 'navContact')).toBe('Kontakt');
    expect(t('en', 'navContact')).toBe('Contact');
  });
});
