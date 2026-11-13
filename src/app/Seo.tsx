import { Helmet } from 'react-helmet-async';
import { site } from '@/content/site';
import type { PageMeta } from '@/content/types';
import { env } from '@/lib/env';

export interface SeoProps {
  meta: PageMeta;
}

/** Per-route head tags. Rendered into static HTML at build time by the prerender step. */
export function Seo({ meta }: SeoProps) {
  const url = `${env.siteUrl}${meta.path === '/' ? '/' : meta.path}`;
  const title = meta.path === '/' ? meta.title : `${meta.title} · ${site.name}`;
  const image = `${env.siteUrl}/og.png`;
  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      {meta.noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Hallway — the calm front door for tenant conversations"
      />
      <meta property="og:locale" content="en_GB" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
