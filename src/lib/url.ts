const ABSOLUTE = /^(https?:)?\/\//;

/** http(s), protocol-relative, mailto: and tel: links are treated as external. */
export function isExternalHref(href: string): boolean {
  return ABSOLUTE.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

/** True for links that leave the site in a new browser context. */
export function opensNewTab(href: string): boolean {
  return ABSOLUTE.test(href);
}
