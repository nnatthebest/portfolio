import { describe, expect, it } from 'vitest';
import { calLinkFromUrl, calNamespaceFromLink } from './cal';

describe('calLinkFromUrl', () => {
  it('returns the user/event path of a Cal.com booking URL', () => {
    expect(calLinkFromUrl('https://cal.com/daniil-biiakov/30min')).toBe('daniil-biiakov/30min');
  });

  it('ignores a trailing slash, query string and hash', () => {
    expect(calLinkFromUrl('https://cal.com/daniil-biiakov/15min/?month=2026-11#top')).toBe(
      'daniil-biiakov/15min',
    );
  });

  it('throws for something that is not a URL', () => {
    expect(() => calLinkFromUrl('daniil-biiakov/30min')).toThrow();
  });
});

describe('calNamespaceFromLink', () => {
  it('uses the event slug as the embed namespace', () => {
    expect(calNamespaceFromLink('daniil-biiakov/30min')).toBe('30min');
  });

  it('falls back to the whole link when there is no slash', () => {
    expect(calNamespaceFromLink('30min')).toBe('30min');
  });
});
