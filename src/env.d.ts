/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Cloudflare Turnstile site key (public). The secret key lives only in the Pages Function. */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
