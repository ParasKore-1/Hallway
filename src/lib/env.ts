const DEV_FALLBACK_SITE_URL = 'http://localhost:5173';

export interface Env {
  /** Canonical origin without a trailing slash, e.g. https://hallway.example */
  readonly siteUrl: string;
  readonly isProd: boolean;
}

/**
 * Normalises and validates a site URL. Returns the origin + path with no trailing slash.
 * Throws on anything that is not an absolute http(s) URL so misconfiguration fails loudly.
 */
export function parseSiteUrl(raw: string | undefined, isProd: boolean): string {
  const value = raw?.trim();
  if (!value) {
    if (isProd) {
      console.warn(
        `[env] VITE_SITE_URL is not set; canonical and Open Graph URLs will use ${DEV_FALLBACK_SITE_URL}.`,
      );
    }
    return DEV_FALLBACK_SITE_URL;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`[env] VITE_SITE_URL must be an absolute URL, received "${value}".`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`[env] VITE_SITE_URL must use http or https, received "${url.protocol}".`);
  }
  return `${url.origin}${url.pathname}`.replace(/\/+$/, '');
}

export const env: Env = {
  siteUrl: parseSiteUrl(import.meta.env.VITE_SITE_URL, import.meta.env.PROD),
  isProd: import.meta.env.PROD,
};
