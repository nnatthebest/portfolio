/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** n8n webhook that receives the contact form. Public: it ends up in the page. */
  readonly PUBLIC_N8N_WEBHOOK_URL?: string;
  /** Cloudflare Turnstile site key (public). The secret key lives only in n8n. */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
