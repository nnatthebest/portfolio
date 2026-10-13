import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';
import {
  isPublished,
  missingTranslations,
  nextEntry,
  sortByOrder,
  splitEntryId,
} from './content-utils';

/** Published projects of one language, ordered by `order`. Drafts only appear outside production. */
export async function getProjects(lang: Lang) {
  const entries = await getCollection(
    'projects',
    ({ id, data }) => splitEntryId(id).lang === lang && isPublished(data, import.meta.env.PROD),
  );
  return sortByOrder(entries);
}

/**
 * `getStaticPaths` result for the case pages of one language. A case must exist in both
 * languages with the same slug and draft state; otherwise hreflang would point to a 404.
 */
export async function getProjectStaticPaths(lang: Lang) {
  const published = await getCollection('projects', ({ data }) =>
    isPublished(data, import.meta.env.PROD),
  );

  const missing = missingTranslations(published.map((entry) => entry.id));
  if (missing.length > 0) {
    throw new Error(
      `Projects missing a translation or published in one language only: ${missing.join(', ')}`,
    );
  }

  return sortByOrder(published.filter((entry) => splitEntryId(entry.id).lang === lang)).map(
    (entry) => ({ params: { slug: splitEntryId(entry.id).slug }, props: { entry } }),
  );
}

/** The case shown after `id` (wrapping around), or undefined when there is only one. */
export async function getNextProject(lang: Lang, id: string) {
  return nextEntry(await getProjects(lang), id);
}

/** Services of one language, ordered by `order`. */
export async function getServices(lang: Lang) {
  const entries = await getCollection('services', ({ id }) => splitEntryId(id).lang === lang);
  return sortByOrder(entries);
}
