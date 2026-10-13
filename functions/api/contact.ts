// Cloudflare Pages Function: POST /api/contact. The site itself stays static.
// All logic lives in src/lib/contact-handler.ts so it can be unit tested.
import { MAX_BODY_BYTES, processContact } from '../../src/lib/contact-handler';

/**
 * Secrets of the Pages project. Production: Settings → Variables and Secrets (type "Secret"),
 * or `wrangler pages secret put <NAME>`. Local: `.dev.vars` (see `.dev.vars.example`).
 */
export interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  /** Where visitor messages are delivered. */
  CONTACT_TO: string;
  /** Sender of both emails. Its domain must be verified in Resend. */
  CONTACT_FROM: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

const respond = (status: number, body: unknown): Response =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export const onRequestPost = async ({ request, env }: EventContext): Promise<Response> => {
  const declaredLength = Number(request.headers.get('Content-Length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return respond(413, { ok: false, error: 'too_large' });

  const result = await processContact({
    rawBody: await request.text(),
    ip: request.headers.get('CF-Connecting-IP'),
    env,
  });
  return respond(result.status, result.body);
};
