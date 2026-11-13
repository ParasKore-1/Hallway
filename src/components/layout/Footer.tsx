import { Link as RouterLink } from 'react-router';
import { Icon } from '@/components/ui/Icon';
import { Link } from '@/components/ui/Link';
import { site } from '@/content/site';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-line defer-render">
      <div className="mx-auto grid max-w-page gap-12 px-gutter py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-20">
        <div className="max-w-xs">
          <RouterLink to="/" className="rounded-xs" aria-label={`${site.name} — home`}>
            <Logo />
          </RouterLink>
          <p className="mt-4 text-sm text-ink-muted">{site.tagline}</p>
        </div>
        {site.footer.columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="eyebrow">{column.title}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.to} variant="draw" className="text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-page flex-col gap-4 border-t border-line px-gutter py-8 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p>{site.footer.legal}</p>
          <p>{site.footer.fictionNotice}</p>
        </div>
        <a
          href="#top"
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-pill px-3 text-ink hover:bg-surface-2 md:self-auto"
        >
          <Icon name="arrow-up" />
          {site.footer.backToTop}
        </a>
      </div>
    </footer>
  );
}
