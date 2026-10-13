import type { Lang } from '../i18n/ui';

const priceLocales: Record<Lang, string> = { sk: 'sk-SK', en: 'en-IE' };

/** Whole-euro price in the language's convention: "290 €" in Slovak, "€290" in English. */
export function formatPrice(lang: Lang, amount: number): string {
  return new Intl.NumberFormat(priceLocales[lang], {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}
