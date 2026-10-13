import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { isPublished, sortByOrder, splitEntryId } from './content-utils';

/** Published projects of one language, ordered by `order`. Drafts only appear outside production. */
export async function getProjects(lang: Lang) {
  const entries = await getCollection(
    'projects',
    ({ id, data }) => splitEntryId(id).lang === lang && isPublished(data, import.meta.env.PROD),
  );
  return sortByOrder(entries);
}

/** Services of one language, ordered by `order`. */
export async function getServices(lang: Lang) {
  const entries = await getCollection('services', ({ id }) => splitEntryId(id).lang === lang);
  return sortByOrder(entries);
}
