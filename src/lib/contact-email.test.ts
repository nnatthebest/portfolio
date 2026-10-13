import { describe, expect, it } from 'vitest';
import { site } from '../config';
import {
  buildAutoReply,
  buildOwnerEmail,
  escapeHtml,
  singleLine,
  type ContactSubmission,
} from './contact-email';

const submission: ContactSubmission = {
  name: 'Jana Nováková',
  email: 'jana@salon.sk',
  projectType: 'landing',
  budget: 'lt-300',
  message: 'Potrebujem nový web.\nĎakujem.',
  lang: 'sk',
};

describe('escapeHtml', () => {
  it('escapes the characters that can open a tag or an attribute', () => {
    expect(escapeHtml(`<script>alert("x") & 'y'</script>`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;',
    );
  });

  it('leaves ordinary text, including diacritics, untouched', () => {
    expect(escapeHtml('Ľščťžýáíé — 290 €')).toBe('Ľščťžýáíé — 290 €');
  });
});

describe('singleLine', () => {
  it('removes line breaks so a value cannot inject mail headers', () => {
    expect(singleLine('Jana\r\nBcc: evil@example.com')).toBe('Jana Bcc: evil@example.com');
  });

  it('collapses whitespace, trims and caps the length', () => {
    expect(singleLine('  a   b  ')).toBe('a b');
    expect(singleLine('x'.repeat(500), 20)).toHaveLength(20);
  });
});

describe('buildOwnerEmail', () => {
  it('uses the agreed subject', () => {
    expect(buildOwnerEmail(submission).subject).toBe('Nový dopyt: Jana Nováková — landing');
  });

  it('keeps line breaks out of the subject', () => {
    const { subject } = buildOwnerEmail({ ...submission, name: 'Jana\r\nBcc: evil@example.com' });
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it('lists every field in a plain HTML table', () => {
    const { html } = buildOwnerEmail(submission);
    expect(html).toContain('<table');
    for (const value of ['Jana Nováková', 'jana@salon.sk', 'landing', 'Potrebujem nový web.']) {
      expect(html).toContain(value);
    }
  });

  it('shows the budget with its label and keeps line breaks of the message', () => {
    const { html } = buildOwnerEmail(submission);
    expect(html).toContain('Do 300 €');
    expect(html).toContain('Potrebujem nový web.<br>Ďakujem.');
  });

  it('escapes everything the visitor typed', () => {
    const { html } = buildOwnerEmail({
      ...submission,
      name: '<b>Jana</b>',
      message: '<img src=x onerror=alert(1)>',
    });
    expect(html).not.toContain('<b>Jana</b>');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;b&gt;Jana&lt;/b&gt;');
  });

  it('shows an unknown budget value escaped instead of failing', () => {
    expect(buildOwnerEmail({ ...submission, budget: '<x>' }).html).toContain('&lt;x&gt;');
  });
});

describe('buildAutoReply', () => {
  it('thanks the visitor in Slovak and promises a reply within one business day', () => {
    const { subject, html } = buildAutoReply(submission);
    expect(subject).toBe('Ďakujem za správu');
    expect(html).toContain('Dobrý deň Jana Nováková');
    expect(html).toContain('1 pracovného dňa');
  });

  it('thanks the visitor in English', () => {
    const { subject, html } = buildAutoReply({ ...submission, lang: 'en' });
    expect(subject).toBe('Thank you for your message');
    expect(html).toContain('Hello Jana Nováková');
    expect(html).toContain('1 business day');
  });

  it('links to the consultation booking and signs with the brand line', () => {
    for (const lang of ['sk', 'en'] as const) {
      const { html } = buildAutoReply({ ...submission, lang });
      expect(html).toContain(site.calConsultation);
      expect(html).toContain('Daniil Biiakov — web &amp; automation');
    }
  });

  it('escapes the name in the greeting', () => {
    const { html } = buildAutoReply({ ...submission, name: '<script>x</script>' });
    expect(html).not.toContain('<script>');
  });
});
