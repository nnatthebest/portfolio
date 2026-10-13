#!/usr/bin/env node
// Static audit of the built site. Run `npm run build` first, then `npm run audit`.
// Checks metadata, canonical/hreflang, sitemap, robots.txt, JSON-LD, images, links,
// heading order, skip link, colour contrast of the design tokens, focus and reduced motion.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const ORIGIN = 'https://daniilbiiakov.com';
const TITLE_MAX = 60;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_MAX = 160;
const TEXT_CONTRAST = 4.5;
const UI_CONTRAST = 3;

const results = [];
const record = (scope, check, ok, detail = '') => results.push({ scope, check, ok, detail });

const read = (path) => readFileSync(path, 'utf8');
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const decode = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const parseAttributes = (source) =>
  Object.fromEntries(
    [...source.matchAll(/([\w:@.-]+)(?:="([^"]*)")?/g)].map((match) => [
      match[1],
      decode(match[2] ?? ''),
    ]),
  );
const tagsOf = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'g'))].map((match) =>
    parseAttributes(match[1]),
  );

const urlOf = (file) => {
  const relative = file.slice(DIST.length).replace(/\\/g, '/');
  return relative === '/404.html' ? relative : relative.replace(/index\.html$/, '');
};

const pages = walk(DIST)
  .filter((file) => file.endsWith('.html'))
  .map((file) => {
    const html = read(file);
    const meta = tagsOf(html, 'meta');
    const links = tagsOf(html, 'link');
    return {
      url: urlOf(file),
      html,
      title: decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''),
      description: meta.find((tag) => tag.name === 'description')?.content ?? '',
      noindex: /noindex/.test(meta.find((tag) => tag.name === 'robots')?.content ?? ''),
      canonical: links.find((tag) => tag.rel === 'canonical')?.href,
      alternates: Object.fromEntries(
        links
          .filter((tag) => tag.rel === 'alternate' && tag.hreflang)
          .map((tag) => [tag.hreflang, tag.href]),
      ),
      meta,
    };
  });
const indexable = pages.filter((page) => !page.noindex);
const byUrl = new Map(pages.map((page) => [page.url, page]));
const path = (absolute) => absolute.replace(ORIGIN, '');

// ---------- per page ----------
for (const page of pages) {
  const { url, html } = page;
  record(url, 'html lang', /<html lang="(sk|en)"/.test(html));
  record(url, 'one h1', (html.match(/<h1\b/g) ?? []).length === 1);

  const levels = [...html.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
  const skipped = levels.find((level, index) => index > 0 && level - levels[index - 1] > 1);
  record(url, 'heading order', skipped === undefined, skipped ? `jumps to h${skipped}` : '');

  const imagesWithoutAlt = tagsOf(html, 'img').filter((image) => image.alt === undefined);
  record(url, 'img alt', imagesWithoutAlt.length === 0, `${imagesWithoutAlt.length} without alt`);

  const firstLink = tagsOf(html.slice(html.indexOf('<body')), 'a')[0];
  record(url, 'skip link first', firstLink?.href === '#main' && /id="main"/.test(html));

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  record(url, 'unique ids', duplicates.length === 0, duplicates.join(', '));

  const unsafe = tagsOf(html, 'a').filter(
    (anchor) => anchor.target === '_blank' && !/noopener/.test(anchor.rel ?? ''),
  );
  record(url, 'target=_blank has noopener', unsafe.length === 0);

  record(url, 'title and description present', page.title !== '' && page.description !== '');
}

// ---------- indexable pages ----------
const titleCounts = new Map();
const descriptionCounts = new Map();
for (const page of indexable) {
  titleCounts.set(page.title, (titleCounts.get(page.title) ?? 0) + 1);
  descriptionCounts.set(page.description, (descriptionCounts.get(page.description) ?? 0) + 1);
}

for (const page of indexable) {
  const { url } = page;
  record(url, 'title unique', titleCounts.get(page.title) === 1, page.title);
  record(url, 'description unique', descriptionCounts.get(page.description) === 1);
  record(url, `title ≤ ${TITLE_MAX}`, page.title.length <= TITLE_MAX, `${page.title.length}`);
  record(
    url,
    `description ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}`,
    page.description.length >= DESCRIPTION_MIN && page.description.length <= DESCRIPTION_MAX,
    `${page.description.length}`,
  );
  record(
    url,
    'canonical is self',
    page.canonical === `${ORIGIN}${url}`,
    page.canonical ?? 'missing',
  );

  const { sk, en, 'x-default': fallback } = page.alternates;
  record(url, 'hreflang sk/en/x-default', Boolean(sk && en && fallback) && fallback === sk);
  const reciprocal = [sk, en].every((target) => {
    const other = target && byUrl.get(path(target));
    return Boolean(other) && other.alternates.sk === sk && other.alternates.en === en;
  });
  record(url, 'hreflang targets exist and point back', reciprocal);

  const og = (property) => page.meta.find((tag) => tag.property === property)?.content;
  record(
    url,
    'open graph complete',
    Boolean(og('og:title') && og('og:description') && og('og:image') && og('og:url')),
  );
  record(url, 'og:url = canonical', og('og:url') === page.canonical);
}

for (const page of pages.filter((candidate) => candidate.noindex)) {
  record(
    page.url,
    'noindex page has no canonical/hreflang',
    !page.canonical && Object.keys(page.alternates).length === 0,
  );
}

// ---------- sitemap and robots.txt ----------
record('site', 'sitemap-index.xml exists', existsSync(join(DIST, 'sitemap-index.xml')));
const sitemapUrls = existsSync(join(DIST, 'sitemap-0.xml'))
  ? [...read(join(DIST, 'sitemap-0.xml')).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  : [];
record(
  'site',
  'sitemap urls all built',
  sitemapUrls.every((loc) => byUrl.has(path(loc))),
);
record(
  'site',
  'sitemap has no noindex page',
  sitemapUrls.every((loc) => !byUrl.get(path(loc))?.noindex),
);
const missingFromSitemap = indexable.filter(
  (page) => !sitemapUrls.includes(`${ORIGIN}${page.url}`),
);
record(
  'site',
  'every indexable page is in the sitemap',
  missingFromSitemap.length === 0,
  missingFromSitemap.map((page) => page.url).join(', '),
);
const languageGaps = indexable.filter((page) =>
  [page.alternates.sk, page.alternates.en].some(
    (target) => target && !sitemapUrls.includes(target),
  ),
);
record(
  'site',
  'sitemap has both languages of every page',
  languageGaps.length === 0,
  languageGaps.map((page) => page.url).join(', '),
);

const robotsPath = join(DIST, 'robots.txt');
const robots = existsSync(robotsPath) ? read(robotsPath) : '';
record('site', 'robots.txt exists', robots !== '');
record(
  'site',
  'robots.txt allows crawling and lists the sitemap',
  /Allow:\s*\//.test(robots) && robots.includes(`${ORIGIN}/sitemap-index.xml`),
);

// ---------- JSON-LD ----------
for (const page of indexable) {
  const blocks = [
    ...page.html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ].map((match) => match[1]);
  let parsed;
  try {
    parsed = blocks.map((block) => JSON.parse(block));
  } catch {
    record(page.url, 'JSON-LD parses', false);
    continue;
  }
  const types = parsed.flatMap((data) => (data['@graph'] ?? [data]).map((node) => node['@type']));
  record(page.url, 'JSON-LD parses', true, types.join(', ') || 'none');
  if (page.url === '/' || page.url === '/en/') {
    record(
      page.url,
      'JSON-LD Person + ProfessionalService',
      ['Person', 'ProfessionalService'].every((type) => types.includes(type)),
    );
  }
  if (/^\/(projekty|en\/projects)\/[^/]+\/$/.test(page.url)) {
    record(page.url, 'JSON-LD CreativeWork', types.includes('CreativeWork'));
  }
}

// ---------- internal links and assets ----------
const resolves = (target) => {
  if (target.endsWith('/')) return existsSync(join(DIST, target, 'index.html'));
  return existsSync(join(DIST, target)) || existsSync(join(DIST, `${target}.html`));
};
for (const page of pages) {
  const references = [
    ...tagsOf(page.html, 'a').map((tag) => tag.href),
    ...tagsOf(page.html, 'link').map((tag) => tag.href),
    ...tagsOf(page.html, 'img').map((tag) => tag.src),
    ...tagsOf(page.html, 'script').map((tag) => tag.src),
  ].filter(
    (reference) =>
      reference &&
      (reference.startsWith('/') || reference.startsWith('#')) &&
      !reference.startsWith('//'),
  );

  const broken = references.filter((reference) => {
    const [location, hash] = reference.split('#');
    const targetPath = location.split('?')[0];
    const targetPage = targetPath === '' ? page : byUrl.get(targetPath);
    if (targetPath !== '' && !resolves(targetPath)) return true;
    return Boolean(hash) && Boolean(targetPage) && !targetPage.html.includes(`id="${hash}"`);
  });
  record(
    page.url,
    'internal links and anchors resolve',
    broken.length === 0,
    [...new Set(broken)].join(', '),
  );
}

// ---------- colour contrast of the design tokens ----------
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((index) => {
    const channel = parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};
const css = read('src/styles/global.css');
const [lightBlock, darkBlock] = [...css.matchAll(/:root\s*{([^}]*)}/g)].map((match) => match[1]);
const tokens = (block) =>
  Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((match) => [match[1], match[2]]),
  );
const pairs = [
  ['fg on bg', 'fg', 'bg', TEXT_CONTRAST],
  ['muted text on bg', 'muted', 'bg', TEXT_CONTRAST],
  ['accent-text on bg', 'accent-text', 'bg', TEXT_CONTRAST],
  ['on-accent on accent (button)', 'on-accent', 'accent', TEXT_CONTRAST],
  ['form control border (muted) on bg', 'muted', 'bg', UI_CONTRAST],
  ['focus ring (accent-text) on bg', 'accent-text', 'bg', UI_CONTRAST],
];
for (const [theme, block] of [
  ['light', lightBlock],
  ['dark', darkBlock],
]) {
  const palette = tokens(block ?? '');
  for (const [label, foreground, background, minimum] of pairs) {
    const value =
      palette[foreground] && palette[background]
        ? ratio(palette[foreground], palette[background])
        : 0;
    record(`contrast ${theme}`, label, value >= minimum, `${value.toFixed(2)}:1 (min ${minimum})`);
  }
}

// ---------- focus and motion (built CSS) ----------
const builtCss = walk(join(DIST, '_astro'))
  .filter((file) => file.endsWith('.css'))
  .map(read)
  .join('\n');
record(
  'css',
  ':focus-visible outline defined',
  /:focus-visible\{[^}]*outline:/.test(builtCss.replace(/\s+/g, '')),
);
record(
  'css',
  'prefers-reduced-motion: reduce handled',
  /prefers-reduced-motion:\s*reduce/.test(builtCss),
);
record(
  'css',
  'scroll reveal only without reduced motion',
  /prefers-reduced-motion:\s*no-preference/.test(builtCss),
);
record('css', 'no smooth scrolling forced', !/scroll-behavior:\s*smooth/.test(builtCss));

// ---------- report ----------
const failures = results.filter((result) => !result.ok);
const byCheck = new Map();
for (const result of results) {
  const entry = byCheck.get(result.check) ?? { pass: 0, total: 0 };
  byCheck.set(result.check, { pass: entry.pass + (result.ok ? 1 : 0), total: entry.total + 1 });
}

console.log(`Audited ${pages.length} pages (${indexable.length} indexable) in ${DIST}/\n`);
console.log('check'.padEnd(52), 'passed');
for (const [check, { pass, total }] of byCheck) {
  console.log(check.padEnd(52), `${pass}/${total}${pass === total ? '' : '  ✗'}`);
}

if (failures.length > 0) {
  console.log('\nFailures:');
  for (const failure of failures) {
    console.log(
      `  ✗ ${failure.scope} — ${failure.check}${failure.detail ? ` — ${failure.detail}` : ''}`,
    );
  }
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
