import { Link as RouterLink } from 'react-router';
import { Seo } from '@/app/Seo';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import { notFound } from '@/content/about';
import { pageMeta } from '@/content/pages';

/** A doorway that opens onto nothing — and a few doors that do go somewhere. */
export default function NotFound() {
  return (
    <>
      <Seo meta={pageMeta.notFound} />
      <section aria-labelledby="page-title" className="py-section">
        <Container className="grid items-center gap-16 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">{notFound.eyebrow}</p>
            <Heading level={1} size="display" id="page-title" className="mt-6 max-w-[14ch]">
              {notFound.title}
            </Heading>
            <p className="mt-8 max-w-[52ch] text-lg text-ink-muted">{notFound.lead}</p>
            <nav aria-label="Suggested pages" className="mt-10">
              <ul className="flex flex-wrap gap-3">
                {notFound.links.map((link) => (
                  <li key={link.to}>
                    <RouterLink
                      to={link.to}
                      data-magnetic
                      className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-ink px-5 text-sm font-semibold transition-colors hover:bg-ink hover:text-bg"
                    >
                      {link.label}
                      <Icon name="arrow-right" />
                    </RouterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <svg
            viewBox="0 0 240 320"
            aria-hidden="true"
            className="mx-auto w-48 text-ink md:w-64 lg:w-72"
          >
            <path d="M20 310V120a100 100 0 0 1 200 0v190z" className="fill-surface-2" />
            <path
              d="M20 310V120a100 100 0 0 1 200 0v190"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M48 310V128a72 72 0 0 1 144 0v182z" className="fill-bg" />
            <text
              x="120"
              y="215"
              textAnchor="middle"
              className="fill-ink-muted font-display"
              fontSize="64"
            >
              404
            </text>
            <circle cx="172" cy="236" r="5" className="fill-brass-soft" />
            <path d="M0 310h240" stroke="currentColor" strokeWidth="2" />
          </svg>
        </Container>
      </section>
    </>
  );
}
