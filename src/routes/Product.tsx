import { Seo } from '@/app/Seo';
import { HydrationBoundary } from '@/components/layout/HydrationBoundary';
import { Reveal } from '@/components/motion/Reveal';
import { ClosingCtaSection } from '@/components/sections/home/ClosingCtaSection';
import { ProductStorySection } from '@/components/sections/product/ProductStorySection';
import { PageHero } from '@/components/sections/shared/PageHero';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { pageMeta } from '@/content/pages';
import { productIntro, productPillars } from '@/content/product';

export default function Product() {
  return (
    <>
      <Seo meta={pageMeta.product} />
      <PageHero {...productIntro} />
      <HydrationBoundary>
        <ProductStorySection />
      </HydrationBoundary>
      <Section labelledBy="pillars-title" tone="muted">
        <Container>
          <SectionHeader
            id="pillars-title"
            eyebrow={productPillars.eyebrow}
            title={productPillars.title}
          />
          <Reveal stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {productPillars.items.map((pillar, index) => (
              <div key={pillar.title} className="rounded-lg bg-bg p-8">
                <span aria-hidden="true" className="font-display text-xl text-brass">
                  0{index + 1}
                </span>
                <Heading level={3} size="xl" className="mt-6">
                  {pillar.title}
                </Heading>
                <p className="mt-3 text-pretty text-ink-muted">{pillar.body}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>
      <HydrationBoundary>
        <ClosingCtaSection />
      </HydrationBoundary>
    </>
  );
}
