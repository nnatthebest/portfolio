import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { processContact, type ContactEnv } from './contact-handler';

const env: ContactEnv = {
  RESEND_API_KEY: 're_test',
  TURNSTILE_SECRET_KEY: 'secret',
  CONTACT_TO: 'owner@example.com',
  CONTACT_FROM: 'Daniil <hello@example.com>',
};

const validBody = {
  name: 'Jana Nováková',
  email: 'jana@salon.sk',
  projectType: 'landing',
  budget: 'unsure',
  message: 'Potrebujem nový web pre salón.',
  lang: 'sk',
  consent: true,
  website: '',
  turnstileToken: 'token-123',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

interface Call {
  url: string;
  init: RequestInit;
}

interface Stubs {
  turnstile?: () => Response | Promise<Response>;
  /** Receives the 1-based number of the Resend call. */
  resend?: (callNumber: number) => Response;
}

function fakeFetch(stubs: Stubs = {}) {
  const calls: Call[] = [];
  let resendCalls = 0;
  const impl = (async (url: RequestInfo | URL, init?: RequestInit) => {
    const target = String(url);
    calls.push({ url: target, init: init ?? {} });
    if (target.includes('siteverify')) {
      return stubs.turnstile ? stubs.turnstile() : json({ success: true });
    }
    resendCalls += 1;
    return stubs.resend ? stubs.resend(resendCalls) : json({ id: `id-${resendCalls}` });
  }) as typeof fetch;

  const resend = () => calls.filter((call) => call.url === 'https://api.resend.com/emails');
  const payloadOf = (call: Call) => JSON.parse(String(call.init.body)) as Record<string, unknown>;
  return { impl, calls, resend, payloadOf };
}

const submit = (
  body: unknown,
  fake: ReturnType<typeof fakeFetch>,
  overrides: Partial<Parameters<typeof processContact>[0]> = {},
) =>
  processContact({
    rawBody: typeof body === 'string' ? body : JSON.stringify(body),
    ip: '203.0.113.7',
    env,
    fetchImpl: fake.impl,
    ...overrides,
  });

let errorLog: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  errorLog = vi.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('request shape', () => {
  it('rejects a body that is not valid JSON', async () => {
    const fake = fakeFetch();
    expect(await submit('not json', fake)).toEqual({
      status: 400,
      body: { ok: false, error: 'invalid_body' },
    });
  });

  it('rejects JSON that is not an object', async () => {
    const fake = fakeFetch();
    expect((await submit('[1,2]', fake)).status).toBe(400);
    expect((await submit('"text"', fake)).status).toBe(400);
  });

  it('rejects a body over the size limit', async () => {
    const fake = fakeFetch();
    const result = await submit('x'.repeat(20_001), fake);
    expect(result).toEqual({ status: 413, body: { ok: false, error: 'too_large' } });
    expect(fake.calls).toHaveLength(0);
  });
});

describe('honeypot', () => {
  it('answers 200 and sends nothing when the trap field is filled', async () => {
    const fake = fakeFetch();
    const result = await submit({ ...validBody, website: 'http://spam.example' }, fake);
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(fake.calls).toHaveLength(0);
  });

  it('does so even when the environment is not configured', async () => {
    const fake = fakeFetch();
    const result = await submit({ ...validBody, website: 'x' }, fake, { env: {} });
    expect(result.status).toBe(200);
    expect(fake.calls).toHaveLength(0);
  });
});

describe('configuration', () => {
  it('answers 500 and names the missing variables, never their values', async () => {
    const fake = fakeFetch();
    const result = await submit(validBody, fake, {
      env: { ...env, RESEND_API_KEY: '', CONTACT_TO: undefined },
    });
    expect(result).toEqual({ status: 500, body: { ok: false, error: 'config' } });
    const logged = errorLog.mock.calls.flat().join(' ');
    expect(logged).toContain('RESEND_API_KEY');
    expect(logged).toContain('CONTACT_TO');
    expect(logged).not.toContain('secret');
    expect(fake.calls).toHaveLength(0);
  });
});

describe('validation', () => {
  const rejected = async (overrides: Record<string, unknown>) => {
    const fake = fakeFetch();
    const result = await submit({ ...validBody, ...overrides }, fake);
    expect(fake.calls).toHaveLength(0);
    return result;
  };

  it('requires the Turnstile token', async () => {
    const result = await rejected({ turnstileToken: '' });
    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({ ok: false, error: 'validation' });
    expect(result.body.fields).toContain('turnstileToken');
  });

  it('requires a name and a well-formed e-mail', async () => {
    const result = await rejected({ name: '', email: 'not-an-email' });
    expect(result.body.fields).toEqual(expect.arrayContaining(['name', 'email']));
  });

  it('allows a message of exactly 5000 characters but not 5001', async () => {
    const fakeOk = fakeFetch();
    const ok = await submit({ ...validBody, message: 'x'.repeat(5000) }, fakeOk);
    expect(ok.status).toBe(200);
    const tooLong = await rejected({ message: 'x'.repeat(5001) });
    expect(tooLong.body.fields).toContain('message');
  });

  it('requires consent to be exactly true', async () => {
    expect((await rejected({ consent: false })).body.fields).toContain('consent');
    expect((await rejected({ consent: 'true' })).body.fields).toContain('consent');
    expect((await rejected({ consent: undefined })).body.fields).toContain('consent');
  });

  it('accepts only the two site languages', async () => {
    expect((await rejected({ lang: 'de' })).body.fields).toContain('lang');
    expect((await rejected({ lang: undefined })).body.fields).toContain('lang');
  });

  it('accepts service ids as project types and rejects anything else', async () => {
    expect((await rejected({ projectType: 'Bad Type!' })).body.fields).toContain('projectType');
    expect((await rejected({ budget: '1000000' })).body.fields).toContain('budget');
  });

  it('treats non-string values as missing instead of crashing', async () => {
    const result = await rejected({ name: 42, email: { a: 1 }, message: null });
    expect(result.body.fields).toEqual(expect.arrayContaining(['name', 'email', 'message']));
  });
});

describe('Turnstile', () => {
  it('verifies the token with the secret and the visitor IP', async () => {
    const fake = fakeFetch();
    await submit(validBody, fake);
    const [first] = fake.calls;
    expect(first?.url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(first?.init.method).toBe('POST');
    const form = new URLSearchParams(String(first?.init.body));
    expect(form.get('secret')).toBe('secret');
    expect(form.get('response')).toBe('token-123');
    expect(form.get('remoteip')).toBe('203.0.113.7');
  });

  it('leaves the IP out when it is unknown', async () => {
    const fake = fakeFetch();
    await submit(validBody, fake, { ip: null });
    expect(new URLSearchParams(String(fake.calls[0]?.init.body)).has('remoteip')).toBe(false);
  });

  it('answers 403 and sends no mail when the token is rejected', async () => {
    const fake = fakeFetch({ turnstile: () => json({ success: false }) });
    const result = await submit(validBody, fake);
    expect(result).toEqual({ status: 403, body: { ok: false, error: 'turnstile' } });
    expect(fake.resend()).toHaveLength(0);
  });

  it('answers 502 when the verification service cannot be reached', async () => {
    const failing = (async (url: RequestInfo | URL) => {
      if (String(url).includes('siteverify')) throw new Error('network down');
      return json({ id: 'x' });
    }) as typeof fetch;
    const result = await processContact({
      rawBody: JSON.stringify(validBody),
      ip: null,
      env,
      fetchImpl: failing,
    });
    expect(result).toEqual({ status: 502, body: { ok: false, error: 'turnstile_unavailable' } });
  });

  it('answers 502 when the verification service replies with an error status', async () => {
    const fake = fakeFetch({ turnstile: () => new Response('oops', { status: 500 }) });
    expect((await submit(validBody, fake)).status).toBe(502);
    expect(fake.resend()).toHaveLength(0);
  });
});

describe('sending mail', () => {
  it('sends the notification to the owner, then the auto-reply to the visitor', async () => {
    const fake = fakeFetch();
    const result = await submit(validBody, fake);
    expect(result).toEqual({ status: 200, body: { ok: true } });

    const [owner, reply] = fake.resend();
    expect(owner?.init.method).toBe('POST');
    expect(owner?.init.headers).toMatchObject({
      Authorization: 'Bearer re_test',
      'Content-Type': 'application/json',
    });
    expect(fake.payloadOf(owner!)).toMatchObject({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO,
      reply_to: 'jana@salon.sk',
      subject: 'Nový dopyt: Jana Nováková — landing',
    });
    expect(fake.payloadOf(reply!)).toMatchObject({
      from: env.CONTACT_FROM,
      to: 'jana@salon.sk',
      subject: 'Ďakujem za správu',
    });
  });

  it('writes the auto-reply in the visitor language', async () => {
    const fake = fakeFetch();
    await submit({ ...validBody, lang: 'en' }, fake);
    expect(fake.payloadOf(fake.resend()[1]!).subject).toBe('Thank you for your message');
  });

  it('escapes visitor input in the notification', async () => {
    const fake = fakeFetch();
    await submit({ ...validBody, name: '<b>Jana</b>', message: '<script>x</script> hello' }, fake);
    const html = String(fake.payloadOf(fake.resend()[0]!).html);
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<b>Jana</b>');
  });

  it('answers 500 and skips the auto-reply when the owner mail fails', async () => {
    const fake = fakeFetch({
      resend: () => json({ message: 'domain is not verified' }, 403),
    });
    const result = await submit(validBody, fake);
    expect(result).toEqual({ status: 500, body: { ok: false, error: 'email' } });
    expect(fake.resend()).toHaveLength(1);
    expect(errorLog).toHaveBeenCalled();
  });

  it('still answers 200 when only the auto-reply fails, and logs it', async () => {
    const fake = fakeFetch({
      resend: (callNumber) =>
        callNumber === 1 ? json({ id: 'ok' }) : json({ message: 'bounced' }, 422),
    });
    const result = await submit(validBody, fake);
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(fake.resend()).toHaveLength(2);
    expect(errorLog).toHaveBeenCalledTimes(1);
  });

  it('never logs what the visitor wrote', async () => {
    const fake = fakeFetch({ resend: () => json({ message: 'boom' }, 500) });
    await submit(validBody, fake);
    const logged = errorLog.mock.calls.flat().join(' ');
    expect(logged).not.toContain('jana@salon.sk');
    expect(logged).not.toContain('Potrebujem');
    expect(logged).not.toContain('re_test');
  });

  it('treats a network error from Resend as a failed send', async () => {
    const broken = (async (url: RequestInfo | URL) => {
      if (String(url).includes('siteverify')) return json({ success: true });
      throw new Error('socket hang up');
    }) as typeof fetch;
    const result = await processContact({
      rawBody: JSON.stringify(validBody),
      ip: null,
      env,
      fetchImpl: broken,
    });
    expect(result).toEqual({ status: 500, body: { ok: false, error: 'email' } });
  });
});
