import { site } from '../config';
import type { Lang } from './ui';

export interface PrivacySection {
  heading: string;
  body: readonly string[];
}

export interface PrivacyCopy {
  title: string;
  description: string;
  draftNote: string;
  intro: string;
  sections: readonly PrivacySection[];
}

/**
 * DRAFT privacy policy. Only facts from docs/brief.md and the way the contact form works are
 * stated; everything else is a [TODO] for the owner. Have it reviewed before the site goes live.
 */
export const privacyCopy: Record<Lang, PrivacyCopy> = {
  sk: {
    title: 'Ochrana údajov',
    description:
      'Ako zaobchádzam s osobnými údajmi, ktoré mi pošlete cez kontaktný formulár: čo zbieram, prečo a aké máte práva.',
    draftNote: '[TODO: pred spustením skontrolovať právne znenie tejto stránky]',
    intro:
      'Tu vysvetľujem, aké údaje získavam cez kontaktný formulár, na čo ich používam a aké máte práva.',
    sections: [
      {
        heading: 'Kto údaje spracúva',
        body: [
          `Prevádzkovateľom je ${site.legalName}, živnostník (SZČO), IČO ${site.ico}, DIČ ${site.dic}.`,
          'Adresa: [TODO: adresa prevádzkovateľa]',
          `Kontakt: ${site.email}`,
        ],
      },
      {
        heading: 'Aké údaje získavam a prečo',
        body: [
          'Cez kontaktný formulár: meno, e-mail, typ projektu, orientačný rozpočet, text správy a záznam o vašom súhlase. Používam ich len na odpoveď na vašu správu a prípravu ponuky.',
          'Technické údaje: jazyk stránky a adresa stránky, z ktorej ste formulár odoslali.',
          'Pred spamom formulár chráni Cloudflare Turnstile. Pri overení môže spoločnosť Cloudflare spracovať vašu IP adresu a údaje o prehliadači.',
        ],
      },
      {
        heading: 'Právny základ',
        body: [
          'Spracovanie vychádza z vášho súhlasu (čl. 6 ods. 1 písm. a) GDPR), ktorý udeľujete označením políčka vo formulári. Súhlas môžete kedykoľvek odvolať e-mailom.',
        ],
      },
      {
        heading: 'Komu údaje ďalej sprístupňujem',
        body: [
          'Správu prijíma serverová funkcia na platforme Cloudflare Pages a e-mailom ju doručuje služba Resend. Údaje nikam inam neukladám, zostanú v mojej e-mailovej schránke. [TODO: doplniť poskytovateľa e-mailovej schránky a overiť podmienky spracovania u Cloudflare a Resend]',
          'Kalendár Cal.com sa načíta až po kliknutí na tlačidlo. Rezerváciu potom spracúva spoločnosť Cal.com podľa vlastných zásad.',
        ],
      },
      {
        heading: 'Ako dlho údaje uchovávam',
        body: ['[TODO: doba uchovávania údajov z formulára]'],
      },
      {
        heading: 'Cookies',
        body: [
          'Stránka sama nepoužíva sledovacie cookies ani reklamné nástroje. Služby tretích strán (Cloudflare Turnstile pri práci s formulárom, kalendár Cal.com po kliknutí) sa načítajú až na vašu akciu.',
        ],
      },
      {
        heading: 'Vaše práva',
        body: [
          'Máte právo na prístup k údajom, ich opravu, vymazanie, obmedzenie spracovania, prenosnosť a právo namietať. Stačí napísať na e-mail vyššie.',
          'Máte tiež právo podať sťažnosť Úradu na ochranu osobných údajov Slovenskej republiky.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy',
    description:
      'How I handle the personal data you send me through the contact form: what I collect, why, and what rights you have.',
    draftNote: '[TODO: have the legal wording of this page reviewed before launch]',
    intro:
      'This page explains what data I collect through the contact form, what I use it for and what rights you have.',
    sections: [
      {
        heading: 'Who processes your data',
        body: [
          `The controller is ${site.legalName}, a sole trader (SZČO), company ID ${site.ico}, tax ID ${site.dic}.`,
          'Address: [TODO: controller address]',
          `Contact: ${site.email}`,
        ],
      },
      {
        heading: 'What data I collect and why',
        body: [
          'Through the contact form: name, email, project type, approximate budget, the text of your message and a record of your consent. I use them only to reply to your message and prepare a proposal.',
          'Technical data: the language of the page and the address of the page you sent the form from.',
          'The form is protected against spam by Cloudflare Turnstile. During the check Cloudflare may process your IP address and browser data.',
        ],
      },
      {
        heading: 'Legal basis',
        body: [
          'Processing is based on your consent (Art. 6(1)(a) GDPR), which you give by ticking the box in the form. You can withdraw it at any time by email.',
        ],
      },
      {
        heading: 'Who else receives your data',
        body: [
          'Your message is received by a server function on Cloudflare Pages and delivered by email through the Resend service. I do not store the data anywhere else; it stays in my mailbox. [TODO: add the mailbox provider and check the processing terms of Cloudflare and Resend]',
          'The Cal.com calendar loads only after you click the button. Cal.com then processes the booking under its own policy.',
        ],
      },
      {
        heading: 'How long I keep your data',
        body: ['[TODO: retention period for contact form data]'],
      },
      {
        heading: 'Cookies',
        body: [
          'The site itself uses no tracking cookies or advertising tools. Third-party services (Cloudflare Turnstile when you work with the form, the Cal.com calendar after a click) load only on your action.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You have the right to access, correct and erase your data, to restrict processing, to data portability and to object. Just write to the email above.',
          'You also have the right to lodge a complaint with the Office for Personal Data Protection of the Slovak Republic.',
        ],
      },
    ],
  },
};
