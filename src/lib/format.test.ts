import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';

const digitsOnly = (value: string) => value.replace(/\D/g, '');

describe('formatPrice', () => {
  it('formats euros for Slovak with the symbol after the amount', () => {
    const result = formatPrice('sk', 290);
    expect(digitsOnly(result)).toBe('290');
    expect(result.trim().endsWith('€')).toBe(true);
  });

  it('formats euros for English with the symbol before the amount', () => {
    const result = formatPrice('en', 290);
    expect(digitsOnly(result)).toBe('290');
    expect(result.startsWith('€')).toBe(true);
  });

  it('keeps all digits of larger amounts', () => {
    expect(digitsOnly(formatPrice('sk', 1190))).toBe('1190');
    expect(digitsOnly(formatPrice('en', 1190))).toBe('1190');
  });

  it('never shows cents', () => {
    expect(formatPrice('en', 120)).not.toContain('.');
  });
});
