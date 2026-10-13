import type { Lang } from '../i18n/ui';

export interface Testimonial {
  quote: Record<Lang, string>;
  author: string;
  role?: string;
}

/**
 * Real testimonials only, each with the author's permission to publish.
 * While this list is empty the testimonials section stays hidden.
 */
export const testimonials: readonly Testimonial[] = [];
