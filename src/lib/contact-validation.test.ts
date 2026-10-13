import { describe, expect, it } from 'vitest';
import {
  BUDGET_VALUES,
  LIMITS,
  buildPayload,
  isHoneypotFilled,
  preselectedType,
  validateContact,
  type ContactValues,
} from './contact-validation';

const PROJECT_TYPES = ['landing', 'business-site', 'other'] as const;

const validValues: ContactValues = {
  name: 'Jana Nováková',
  email: 'jana@salon.sk',
  projectType: 'landing',
  budget: 'unsure',
  message: 'Potrebujem nový web pre salón.',
  consent: true,
  website: '',
};

const validate = (overrides: Partial<ContactValues>) =>
  validateContact({ ...validValues, ...overrides }, PROJECT_TYPES);

describe('validateContact', () => {
  it('accepts a complete, valid submission', () => {
    expect(validate({})).toEqual({});
  });

  describe('name', () => {
    it('requires a value, ignoring surrounding whitespace', () => {
      expect(validate({ name: '' }).name).toBe('required');
      expect(validate({ name: '   ' }).name).toBe('required');
    });

    it('rejects names that are too short or too long', () => {
      expect(validate({ name: 'J' }).name).toBe('tooShort');
      expect(validate({ name: 'x'.repeat(LIMITS.nameMax + 1) }).name).toBe('tooLong');
    });
  });

  describe('email', () => {
    it('requires a value', () => {
      expect(validate({ email: '' }).email).toBe('required');
    });

    it('rejects malformed addresses', () => {
      for (const email of ['abc', 'a@b', '@b.sk', 'a@.sk', 'a b@c.sk']) {
        expect(validate({ email }).email, email).toBe('invalid');
      }
    });

    it('accepts ordinary addresses, trimming whitespace', () => {
      expect(validate({ email: ' a@b.sk ' }).email).toBeUndefined();
      expect(validate({ email: 'meno.priezvisko+web@firma.example.com' }).email).toBeUndefined();
    });

    it('rejects addresses longer than the limit', () => {
      const email = `${'a'.repeat(LIMITS.emailMax)}@b.sk`;
      expect(validate({ email }).email).toBe('tooLong');
    });
  });

  describe('projectType and budget', () => {
    it('requires a project type', () => {
      expect(validate({ projectType: '' }).projectType).toBe('required');
    });

    it('rejects a project type that is not offered', () => {
      expect(validate({ projectType: 'hacked' }).projectType).toBe('invalid');
    });

    it('rejects a budget that is not offered and accepts every offered one', () => {
      expect(validate({ budget: '1000000' }).budget).toBe('invalid');
      for (const budget of BUDGET_VALUES) {
        expect(validate({ budget }).budget).toBeUndefined();
      }
    });
  });

  describe('message', () => {
    it('requires a value', () => {
      expect(validate({ message: '  ' }).message).toBe('required');
    });

    it('enforces the length limits', () => {
      expect(validate({ message: 'x'.repeat(LIMITS.messageMin - 1) }).message).toBe('tooShort');
      expect(validate({ message: 'x'.repeat(LIMITS.messageMax + 1) }).message).toBe('tooLong');
      expect(validate({ message: 'x'.repeat(LIMITS.messageMax) }).message).toBeUndefined();
    });
  });

  it('requires consent', () => {
    expect(validate({ consent: false }).consent).toBe('required');
  });

  it('reports every problem at once', () => {
    const errors = validate({ name: '', email: 'x', message: '', consent: false });
    expect(Object.keys(errors).sort()).toEqual(['consent', 'email', 'message', 'name']);
  });
});

describe('preselectedType', () => {
  it('returns the type from the query string when it is offered', () => {
    expect(preselectedType('?type=landing', PROJECT_TYPES)).toBe('landing');
    expect(preselectedType('?foo=1&type=business-site', PROJECT_TYPES)).toBe('business-site');
  });

  it('ignores unknown types, so nothing arbitrary reaches the form', () => {
    expect(preselectedType('?type=hacked', PROJECT_TYPES)).toBeUndefined();
    expect(preselectedType('?type=%3Cscript%3E', PROJECT_TYPES)).toBeUndefined();
  });

  it('returns nothing when the parameter is absent or empty', () => {
    expect(preselectedType('', PROJECT_TYPES)).toBeUndefined();
    expect(preselectedType('?type=', PROJECT_TYPES)).toBeUndefined();
    expect(preselectedType('?other=landing', PROJECT_TYPES)).toBeUndefined();
  });
});

describe('isHoneypotFilled', () => {
  it('is false for an empty or blank trap field', () => {
    expect(isHoneypotFilled({ ...validValues, website: '' })).toBe(false);
    expect(isHoneypotFilled({ ...validValues, website: '   ' })).toBe(false);
  });

  it('is true as soon as the trap field has content', () => {
    expect(isHoneypotFilled({ ...validValues, website: 'http://spam.example' })).toBe(true);
  });
});

describe('buildPayload', () => {
  const context = { lang: 'sk', page: '/kontakt/', turnstileToken: 'token-123' } as const;

  it('maps the values and context onto the webhook contract', () => {
    expect(buildPayload(validValues, context)).toEqual({
      name: 'Jana Nováková',
      email: 'jana@salon.sk',
      projectType: 'landing',
      budget: 'unsure',
      message: 'Potrebujem nový web pre salón.',
      consent: true,
      lang: 'sk',
      page: '/kontakt/',
      turnstileToken: 'token-123',
      website: '',
    });
  });

  it('trims text fields', () => {
    const payload = buildPayload(
      {
        ...validValues,
        name: '  Jana  ',
        email: ' jana@salon.sk ',
        message: ' Ahoj, web prosím. ',
      },
      context,
    );
    expect(payload.name).toBe('Jana');
    expect(payload.email).toBe('jana@salon.sk');
    expect(payload.message).toBe('Ahoj, web prosím.');
  });

  it('does not mutate its input', () => {
    const input = { ...validValues, name: '  Jana  ' };
    buildPayload(input, context);
    expect(input.name).toBe('  Jana  ');
  });
});
