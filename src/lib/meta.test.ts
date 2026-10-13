import { describe, expect, it } from 'vitest';
import { projectMetaTitle } from './meta';

const concept = { title: 'Bistro Lipa', type: 'website', concept: true } as const;

describe('projectMetaTitle', () => {
  it('differs between languages even when the project title is the same', () => {
    expect(projectMetaTitle('sk', concept)).not.toBe(projectMetaTitle('en', concept));
  });

  it('names the project, its type in the page language and the brand', () => {
    expect(projectMetaTitle('sk', { ...concept, concept: false })).toBe(
      'Bistro Lipa — Web | Daniil',
    );
    expect(projectMetaTitle('en', { ...concept, concept: false })).toBe(
      'Bistro Lipa — Website | Daniil',
    );
  });

  it('says so when the project is a concept', () => {
    expect(projectMetaTitle('sk', concept)).toBe('Bistro Lipa — Koncept · Web | Daniil');
    expect(projectMetaTitle('en', concept)).toBe('Bistro Lipa — Demo project · Website | Daniil');
  });

  it('stays within the 60 character limit for the longest type label', () => {
    for (const lang of ['sk', 'en'] as const) {
      const title = projectMetaTitle(lang, {
        title: 'Studio Pohyb',
        type: 'automation',
        concept: true,
      });
      expect(title.length).toBeLessThanOrEqual(60);
    }
  });
});
