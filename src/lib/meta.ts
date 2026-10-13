import { homeCopy, projectTypeLabels, type ProjectType } from '../i18n/copy';
import type { Lang } from '../i18n/ui';

const BRAND = 'Daniil';

export interface ProjectMetaInput {
  title: string;
  type: ProjectType;
  concept: boolean;
}

/**
 * Search-result title of a case page. The project title is the same in both languages, so the
 * type (and the concept label) in the page language keeps every title unique and informative.
 */
export function projectMetaTitle(lang: Lang, project: ProjectMetaInput): string {
  const typeLabel = projectTypeLabels[lang][project.type];
  const label = project.concept
    ? `${homeCopy[lang].featured.conceptLabel} · ${typeLabel}`
    : typeLabel;
  return `${project.title} — ${label} | ${BRAND}`;
}
