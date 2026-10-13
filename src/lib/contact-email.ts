import { site } from '../config';
import { contactCopy } from '../i18n/copy';
import type { Lang } from '../i18n/ui';

export interface ContactSubmission {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  lang: Lang;
}

export interface EmailMessage {
  subject: string;
  html: string;
}

const SIGNATURE = `${site.legalName} — web & automation`;

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapes text for use inside HTML element content or a quoted attribute. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character] ?? character);
}

// C0 controls, DEL, and the Unicode line/paragraph separators, built without literal separators.
const CONTROL_CHARACTERS = new RegExp(
  `[\x00-\x1f\x7f${String.fromCharCode(0x2028, 0x2029)}]+`,
  'g',
);

/** One line of plain text: control characters and line breaks become spaces (no header injection). */
export function singleLine(value: string, maxLength = 120): string {
  return value.replace(CONTROL_CHARACTERS, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

const budgetLabel = (value: string): string =>
  (contactCopy.sk.budget as Record<string, string>)[value] ?? value;

/** Notification for the site owner. Always in Slovak; every visitor-supplied value is escaped. */
export function buildOwnerEmail(submission: ContactSubmission): EmailMessage {
  const rows: readonly (readonly [string, string])[] = [
    ['Meno', escapeHtml(submission.name)],
    ['E-mail', escapeHtml(submission.email)],
    ['Typ projektu', escapeHtml(submission.projectType)],
    ['Rozpočet', escapeHtml(budgetLabel(submission.budget))],
    ['Jazyk', escapeHtml(submission.lang)],
    ['Súhlas', 'áno'],
    ['Správa', escapeHtml(submission.message).replace(/\r?\n/g, '<br>')],
  ];

  const body = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top" style="padding:6px 16px 6px 0">${label}</th>` +
        `<td style="padding:6px 0">${value}</td></tr>`,
    )
    .join('');

  return {
    subject: `Nový dopyt: ${singleLine(submission.name)} — ${singleLine(submission.projectType)}`,
    html: `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:15px">${body}</table>`,
  };
}

const AUTO_REPLY: Record<
  Lang,
  { subject: string; greeting: string; thanks: string; booking: string }
> = {
  sk: {
    subject: 'Ďakujem za správu',
    greeting: 'Dobrý deň',
    thanks: 'ďakujem za vašu správu. Ozvem sa vám do 1 pracovného dňa.',
    booking: 'Ak chcete, môžete si rovno vybrať termín bezplatnej konzultácie:',
  },
  en: {
    subject: 'Thank you for your message',
    greeting: 'Hello',
    thanks: 'thank you for your message. I will reply within 1 business day.',
    booking: 'If you like, you can pick a time for a free consultation right away:',
  },
};

/** Confirmation for the visitor, in the language they used on the site. */
export function buildAutoReply(submission: Pick<ContactSubmission, 'name' | 'lang'>): EmailMessage {
  const copy = AUTO_REPLY[submission.lang];
  const booking = escapeHtml(site.calConsultation);

  return {
    subject: copy.subject,
    html:
      `<p>${copy.greeting} ${escapeHtml(submission.name)},</p>` +
      `<p>${copy.thanks}</p>` +
      `<p>${copy.booking} <a href="${booking}">${booking}</a></p>` +
      `<p>${escapeHtml(SIGNATURE)}</p>`,
  };
}
