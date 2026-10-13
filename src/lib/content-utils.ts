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

/** Slugs that are not present in every language, sorted. A case must exist in both languages. */
export function missingTranslations(ids: readonly string[]): string[] {
  const langsBySlug = new Map<string, Set<string>>();
  for (const id of ids) {
    const { lang, slug } = splitEntryId(id);
    langsBySlug.set(slug, new Set([...(langsBySlug.get(slug) ?? []), lang]));
  }

  return [...langsBySlug]
    .filter(([, langs]) => langs.size < languages.length)
    .map(([slug]) => slug)
    .sort();
}

/** Distinct `data.type` values in order of first appearance. */
export function presentTypes<T extends { data: { type: string } }>(
  entries: readonly T[],
): T['data']['type'][] {
  return [...new Set(entries.map((entry) => entry.data.type))];
}

/** The entry after `id`, wrapping to the first. Undefined when there is nothing else to show. */
export function nextEntry<T extends { id: string }>(
  entries: readonly T[],
  id: string,
): T | undefined {
  const index = entries.findIndex((entry) => entry.id === id);
  if (index === -1 || entries.length < 2) return undefined;
  return entries[(index + 1) % entries.length];
}
