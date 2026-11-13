import { Link as RouterLink } from 'react-router';
import { KineticWord } from '@/components/motion/KineticWord';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { closing } from '@/content/home';
import { useDemoDialog } from '@/hooks/useDemoDialog';

const invertedPrimary = 'bg-on-accent text-accent hover:bg-brass-soft hover:text-ink';
const invertedSecondary = 'border-on-accent text-on-accent hover:bg-on-accent hover:text-accent';

/** Closing CTA inside a large arched doorway panel — the last door on the page. */
export function ClosingCtaSection() {
  const { openDemo } = useDemoDialog();
  return (
    <section aria-labelledby="closing-title" className="px-gutter pt-section">
      <div className="mx-auto max-w-page overflow-hidden rounded-t-[min(45vw,36rem)] bg-accent px-6 pt-28 pb-20 text-center text-on-accent md:pt-40 md:pb-28">
        <Container size="narrow" className="flex flex-col items-center">
          <p className="eyebrow text-on-accent/80!">{closing.eyebrow}</p>
          <h2 id="closing-title" className="mt-6 font-display text-display font-[380]">
            {closing.title} <KineticWord text={closing.kinetic} />
          </h2>
          <p className="mt-8 max-w-[52ch] text-lg text-pretty text-on-accent/85">{closing.lead}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" className={invertedPrimary} onClick={openDemo} data-magnetic>
              {closing.primaryCta}
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className={invertedSecondary}
              data-magnetic
            >
              <RouterLink to="/pricing">{closing.secondaryCta}</RouterLink>
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}
