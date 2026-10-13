import type { Lang } from '../i18n/ui';

export const BUDGET_VALUES = ['lt-300', '300-700', '700-1500', 'gt-1500', 'unsure'] as const;
export type BudgetValue = (typeof BUDGET_VALUES)[number];
export const DEFAULT_BUDGET: BudgetValue = 'unsure';

/** Project type for requests that fit none of the service packages. */
export const PROJECT_TYPE_OTHER = 'other';

/**
 * Shape of a project type (a service id). The server cannot read the services collection,
 * so it checks the shape instead of a list.
 */
export const PROJECT_TYPE_PATTERN = /^[a-z0-9-]{1,40}$/;

export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 5000,
} as const;

export interface ContactValues {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  consent: boolean;
  /** Honeypot: real visitors never see or fill it. */
  website: string;
}

export type ContactField = 'name' | 'email' | 'projectType' | 'budget' | 'message' | 'consent';
export type ContactErrorCode = 'required' | 'tooShort' | 'tooLong' | 'invalid';
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

/** JSON body sent to /api/contact. The Turnstile token is verified there, on the server, never in the browser. */
export interface ContactPayload {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  consent: boolean;
  lang: Lang;
  turnstileToken: string;
  website: string;
}

// Pragmatic check: one "@", no spaces, a dot in the domain, a top-level part of 2+ characters.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;

function textError(value: string, min: number, max: number): ContactErrorCode | undefined {
  const length = value.trim().length;
  if (length === 0) return 'required';
  if (length < min) return 'tooShort';
  if (length > max) return 'tooLong';
  return undefined;
}

function emailError(value: string): ContactErrorCode | undefined {
  const email = value.trim();
  if (email.length === 0) return 'required';
  if (email.length > LIMITS.emailMax) return 'tooLong';
  return EMAIL_PATTERN.test(email) ? undefined : 'invalid';
}

function choiceError(value: string, allowed: readonly string[]): ContactErrorCode | undefined {
  if (value === '') return 'required';
  return allowed.includes(value) ? undefined : 'invalid';
}

/** Validates the visible fields. Returns only the fields that have a problem. */
export function validateContact(
  values: ContactValues,
  allowedProjectTypes: readonly string[],
): ContactErrors {
  const candidates: ContactErrors = {
    name: textError(values.name, LIMITS.nameMin, LIMITS.nameMax),
    email: emailError(values.email),
    projectType: choiceError(values.projectType, allowedProjectTypes),
    budget: choiceError(values.budget, BUDGET_VALUES),
    message: textError(values.message, LIMITS.messageMin, LIMITS.messageMax),
    consent: values.consent ? undefined : 'required',
  };

  return Object.fromEntries(
    Object.entries(candidates).filter(([, code]) => code !== undefined),
  ) as ContactErrors;
}

/** The project type from `?type=` when it is one the form offers; anything else is ignored. */
export function preselectedType(
  search: string,
  allowedProjectTypes: readonly string[],
): string | undefined {
  const requested = new URLSearchParams(search).get('type') ?? '';
  return allowedProjectTypes.includes(requested) ? requested : undefined;
}

export function isHoneypotFilled(values: Pick<ContactValues, 'website'>): boolean {
  return values.website.trim() !== '';
}

export interface PayloadContext {
  lang: Lang;
  turnstileToken: string;
}

export function buildPayload(values: ContactValues, context: PayloadContext): ContactPayload {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    projectType: values.projectType,
    budget: values.budget,
    message: values.message.trim(),
    consent: values.consent,
    lang: context.lang,
    turnstileToken: context.turnstileToken,
    website: values.website,
  };
}
