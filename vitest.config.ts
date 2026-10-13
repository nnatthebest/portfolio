import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/i18n/ui.ts',
        'src/i18n/copy.ts',
        'src/lib/cal.ts',
        'src/lib/contact-email.ts',
        'src/lib/contact-handler.ts',
        'src/lib/contact-validation.ts',
        'src/lib/content-utils.ts',
        'src/lib/faq-jsonld.ts',
        'src/lib/format.ts',
        'src/lib/jsonld.ts',
        'src/lib/meta.ts',
      ],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
