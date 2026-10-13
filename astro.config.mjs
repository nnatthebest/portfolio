// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://daniilbiiakov.com',
  trailingSlash: 'always',
  // Translated slugs (/projekty/ vs /en/projects/) are mapped by the route table in src/i18n/ui.ts.
  i18n: {
    defaultLocale: 'sk',
    locales: ['sk', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/styleguide') })],
});
