/** `https://cal.com/daniil-biiakov/30min` → `daniil-biiakov/30min`, the form the embed expects. */
export function calLinkFromUrl(url: string): string {
  return new URL(url).pathname.replace(/^\/+|\/+$/g, '');
}

/** The event slug doubles as the embed namespace, so several embeds could coexist. */
export function calNamespaceFromLink(calLink: string): string {
  return calLink.split('/').filter(Boolean).at(-1) ?? calLink;
}
