import { languages, type Lang } from '../i18n/ui';

export interface EntryRef {
  lang: Lang;
  slug: string;
}

/** Splits a content entry id such as `sk/bistro-lipa` into its language and slug. */
export function splitEntryId(id: string): EntryRef {
  const separator = id.indexOf('/');
  const lang = languages.find((code) => code === id.slice(0, separator));
  const slug = id.slice(separator + 1);

  if (separator === -1 || !lang || !slug) {
    throw new Error(`Unexpected content entry id "${id}", expected "<lang>/<slug>"`);
  }

  return { lang, slug };
}

/** Drafts are hidden in production builds and visible while developing. */
export function isPublished(data: { draft: boolean }, isProd: boolean): boolean {
  return !(isProd && data.draft);
}

/** Returns a new array sorted by `data.order`, leaving the input untouched. */
export function sortByOrder<T extends { data: { order: number } }>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}
