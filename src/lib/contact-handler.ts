import type { Lang } from '../i18n/ui';
import { buildAutoReply, buildOwnerEmail, type ContactSubmission } from './contact-email';
import { PROJECT_TYPE_PATTERN, validateContact, type ContactValues } from './contact-validation';

/** Secrets and variables the function needs (Cloudflare Pages settings, or `.dev.vars` locally). */
export interface ContactEnv {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
}

export interface ContactResponseBody {
  ok: boolean;
  error?: string;
  fields?: string[];
}

export interface ContactResult {
  status: number;
  body: ContactResponseBody;
}

export interface ContactInput {
  rawBody: string;
  /** Visitor IP from `CF-Connecting-IP`, if known. */
  ip: string | null;
  env: Partial<ContactEnv>;
  /** Replaceable in tests. */
  fetchImpl?: typeof fetch;
}

export const MAX_BODY_CHARS = 20_000;
/** A character takes at most 4 bytes in UTF-8; used to reject huge bodies before reading them. */
export const MAX_BODY_BYTES = MAX_BODY_CHARS * 4;

const MAX_TOKEN_LENGTH = 2048;
const MAX_LOGGED_DETAIL = 200;
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_URL = 'https://api.resend.com/emails';
const ENV_NAMES = [
  'RESEND_API_KEY',
  'TURNSTILE_SECRET_KEY',
  'CONTACT_TO',
  'CONTACT_FROM',
] as const satisfies readonly (keyof ContactEnv)[];

const fail = (status: number, error: string, fields?: string[]): ContactResult => ({
  status,
  body: fields ? { ok: false, error, fields } : { ok: false, error },
});
const succeed = (): ContactResult => ({ status: 200, body: { ok: true } });

const text = (value: unknown): string => (typeof value === 'string' ? value : '');

function parseObject(raw: string): Record<string, unknown> | undefined {
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

const missingEnv = (env: Partial<ContactEnv>): string[] =>
  ENV_NAMES.filter((name) => (env[name] ?? '').trim() === '');

interface Checked {
  submission: ContactSubmission;
  token: string;
  fields: string[];
}

function check(body: Record<string, unknown>): Checked {
  const values: ContactValues = {
    name: text(body.name),
    email: text(body.email),
    projectType: text(body.projectType),
    budget: text(body.budget),
    message: text(body.message),
    consent: body.consent === true,
    website: '',
  };
  const allowedTypes = PROJECT_TYPE_PATTERN.test(values.projectType) ? [values.projectType] : [];
  const fields: string[] = Object.keys(validateContact(values, allowedTypes));

  const lang: Lang | undefined = body.lang === 'sk' || body.lang === 'en' ? body.lang : undefined;
  if (!lang) fields.push('lang');

  const token = text(body.turnstileToken);
  if (token === '' || token.length > MAX_TOKEN_LENGTH) fields.push('turnstileToken');

  return {
    submission: {
      name: values.name.trim(),
      email: values.email.trim(),
      projectType: values.projectType,
      budget: values.budget,
      message: values.message.trim(),
      lang: lang ?? 'sk',
    },
    token,
    fields,
  };
}

type Verdict = 'passed' | 'rejected' | 'unavailable';

async function verifyTurnstile(
  fetchImpl: typeof fetch,
  secret: string,
  token: string,
  ip: string | null,
): Promise<Verdict> {
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set('remoteip', ip);

  try {
    const response = await fetchImpl(SITEVERIFY_URL, { method: 'POST', body: form });
    if (!response.ok) return 'unavailable';
    const result = (await response.json()) as { success?: boolean };
    return result.success === true ? 'passed' : 'rejected';
  } catch {
    return 'unavailable';
  }
}

interface OutgoingEmail {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}

type SendResult = { ok: true } | { ok: false; detail: string };

async function sendEmail(
  fetchImpl: typeof fetch,
  apiKey: string,
  mail: OutgoingEmail,
): Promise<SendResult> {
  try {
    const response = await fetchImpl(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: mail.from,
        to: mail.to,
        reply_to: mail.replyTo,
        subject: mail.subject,
        html: mail.html,
      }),
    });
    if (response.ok) return { ok: true };

    const message = await response
      .json()
      .then((data: { message?: unknown }) => text(data.message))
      .catch(() => '');
    return { ok: false, detail: `HTTP ${response.status} ${message}`.slice(0, MAX_LOGGED_DETAIL) };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'network error';
    return { ok: false, detail: reason.slice(0, MAX_LOGGED_DETAIL) };
  }
}

/**
 * The whole contact flow: honeypot, validation, Turnstile, then two emails through Resend.
 * Logs never contain what the visitor wrote.
 */
export async function processContact({
  rawBody,
  ip,
  env,
  fetchImpl = fetch,
}: ContactInput): Promise<ContactResult> {
  if (rawBody.length > MAX_BODY_CHARS) return fail(413, 'too_large');

  const body = parseObject(rawBody);
  if (!body) return fail(400, 'invalid_body');

  // Bots fill the trap field: answer as if it worked and do nothing else.
  if (text(body.website).trim() !== '') return succeed();

  const missing = missingEnv(env);
  if (missing.length > 0) {
    console.error(`[contact] missing environment: ${missing.join(', ')}`);
    return fail(500, 'config');
  }
  const { RESEND_API_KEY, TURNSTILE_SECRET_KEY, CONTACT_TO, CONTACT_FROM } = env as ContactEnv;

  const { submission, token, fields } = check(body);
  if (fields.length > 0) return fail(400, 'validation', fields);

  const verdict = await verifyTurnstile(fetchImpl, TURNSTILE_SECRET_KEY, token, ip);
  if (verdict === 'rejected') return fail(403, 'turnstile');
  if (verdict === 'unavailable') {
    console.error('[contact] Turnstile verification is unavailable');
    return fail(502, 'turnstile_unavailable');
  }

  const owner = buildOwnerEmail(submission);
  const ownerResult = await sendEmail(fetchImpl, RESEND_API_KEY, {
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: submission.email,
    ...owner,
  });
  if (!ownerResult.ok) {
    console.error(`[contact] owner email failed: ${ownerResult.detail}`);
    return fail(500, 'email');
  }

  const reply = buildAutoReply(submission);
  const replyResult = await sendEmail(fetchImpl, RESEND_API_KEY, {
    from: CONTACT_FROM,
    to: submission.email,
    replyTo: CONTACT_TO,
    ...reply,
  });
  if (!replyResult.ok) {
    // The owner already has the message, so the visitor still gets a success.
    console.error(`[contact] auto-reply failed: ${replyResult.detail}`);
  }

  return succeed();
}
