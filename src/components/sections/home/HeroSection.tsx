import { Fragment } from 'react';
import { Link as RouterLink } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Marquee } from '@/components/ui/Marquee';
import { agencies, hero } from '@/content/home';
import { HydrationBoundary } from '@/components/layout/HydrationBoundary';
import { useDemoDialog } from '@/hooks/useDemoDialog';
import { useGsapContext } from '@/hooks/useGsapContext';
import { isCovered, onIntroReady } from '@/lib/intro';
import { AgencyWordmark } from './AgencyWordmark';
import { InboxMock } from './InboxMock';

/**
 * Hero. Motion (full):
 * 1. Intro — when the preloader hands off, headline words rise out of their masks, the brass
 *    marker draws under "answered", supporting copy fades up. Only plays while the page was
 *    covered by the preloader, so already-painted text is never hidden (LCP-safe).
 * 2. Signature — "Step through the door": the inbox mock sits in an arched doorway that opens
 *    to full width as you scroll (clip-path scrub); the last chat replies arrive as it opens.
 * 3. Parallax notification chips and a pointer tilt on the mock (fine pointers only).
 * Reduced motion: no intro travel, no arch (mock shown open), no parallax or tilt.
 */
export function HeroSection() {
  const { openDemo } = useDemoDialog();

  const ref = useGsapContext<HTMLElement>(
    ({ scope, reduced, desktop, finePointer, gsap }) => {
      if (reduced) return;
      const words = scope.querySelectorAll('[data-hero-word]');
      const marker = scope.querySelector('[data-hero-marker]');
      const support = scope.querySelectorAll('[data-hero-support]');
      const stage = scope.querySelector<HTMLElement>('[data-arch-stage]');
      const arch = scope.querySelector<HTMLElement>('[data-arch]');
      const chips = scope.querySelectorAll<HTMLElement>('[data-chip]');
      const lateBubbles = scope.querySelectorAll('.hero-bubble');

      // 1 · Intro — only if a cover (preloader or route curtain) is hiding the page right now.
      let stopIntro: () => void = () => undefined;
      if (isCovered()) {
        gsap.set(words, { yPercent: 110 });
        gsap.set(marker, { scaleX: 0 });
        gsap.set(support, { opacity: 0, y: 24 });
        stopIntro = onIntroReady(() => {
          gsap
            .timeline()
            .to(words, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06 })
            .to(marker, { scaleX: 1, duration: 0.8, ease: 'power4.inOut' }, 0.45)
            .to(
              support,
              { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' },
              0.35,
            );
        });
      }

      // 2 · Signature arch reveal (scrubbed).
      if (stage && arch) {
        const inset = desktop ? 14 : 5;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top 85%',
            end: 'top 15%',
            scrub: 0.6,
            // will-change only while the scrub is active.
            onToggle: (self) => {
              arch.style.willChange = self.isActive ? 'clip-path' : '';
            },
          },
        });
        tl.fromTo(
          arch,
          { clipPath: `inset(0% ${inset}% 0% ${inset}% round 900px 900px 24px 24px)` },
          { clipPath: 'inset(0% 0% 0% 0% round 24px 24px 24px 24px)', ease: 'none' },
        ).from(
          lateBubbles,
          { opacity: 0, y: 16, stagger: 0.25, ease: 'power2.out', duration: 0.4 },
          0.45,
        );
        // 3 · Parallax chips (hidden below 1024px, so desktop only) + pointer tilt.
        if (desktop) {
          chips.forEach((chip, index) => {
            gsap.to(chip, {
              yPercent: index % 2 === 0 ? -60 : -120,
              ease: 'none',
              scrollTrigger: {
                trigger: stage,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            });
          });
        }

        if (finePointer && desktop) {
          gsap.set(stage, { perspective: 1400 });
          const rotX = gsap.quickTo(arch, 'rotationX', { duration: 0.8, ease: 'power3.out' });
          const rotY = gsap.quickTo(arch, 'rotationY', { duration: 0.8, ease: 'power3.out' });
          const onMove = (event: PointerEvent) => {
            const rect = stage.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            rotY(px * 5);
            rotX(py * -4);
          };
          const onLeave = () => {
            rotX(0);
            rotY(0);
          };
          stage.addEventListener('pointermove', onMove);
          stage.addEventListener('pointerleave', onLeave);
          return () => {
            stopIntro();
            stage.removeEventListener('pointermove', onMove);
            stage.removeEventListener('pointerleave', onLeave);
          };
        }
      }
      return stopIntro;
    },
    { eager: true },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative overflow-x-clip pt-10 md:pt-16"
    >
      <Container>
        <p className="eyebrow" data-hero-support>
          {hero.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="mt-6 max-w-[13ch] font-display text-display font-[380] text-ink md:max-w-[15ch]"
        >
          {hero.headline.map((item, index) => {
            const { word } = item;
            const highlight = 'highlight' in item;
            return (
              <Fragment key={word}>
                {index > 0 && ' '}
                <span className="line-mask inline-block align-top">
                  <span data-hero-word className="relative isolate inline-block">
                    {highlight && (
                      <span
                        aria-hidden="true"
                        data-hero-marker
                        className="absolute inset-x-[-0.04em] bottom-[0.1em] -z-10 h-[0.32em] origin-left bg-brass-soft"
                      />
                    )}
                    {highlight ? <em className="not-italic">{word}</em> : word}
                  </span>
                </span>
              </Fragment>
            );
          })}
        </h1>

        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,36rem)_auto] lg:items-end lg:justify-between">
          <p className="text-lg text-pretty text-ink-muted" data-hero-support>
            {hero.lead}
          </p>
          <div className="flex flex-col gap-4" data-hero-support>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={openDemo} data-magnetic>
                {hero.primaryCta}
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                iconEnd={<Icon name="arrow-right" />}
                data-magnetic
              >
                <RouterLink to="/product">{hero.secondaryCta}</RouterLink>
              </Button>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
              {hero.reassurance.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Icon name="check" className="text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div data-arch-stage className="relative mt-14 px-gutter md:mt-20">
        <div
          data-arch
          className="hero-arch mx-auto max-w-page rounded-lg bg-surface-2 p-2 sm:p-3 md:p-5"
        >
          {/* Static mock: hydrates after the shell (no handlers inside). */}
          <HydrationBoundary>
            <InboxMock />
          </HydrationBoundary>
        </div>
        <div
          data-chip
          aria-hidden="true"
          className="absolute top-[18%] left-[max(1rem,calc(50%-44rem))] hidden items-center gap-2 rounded-pill bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-md lg:flex"
        >
          <span className="grid size-6 place-items-center rounded-pill bg-accent text-on-accent">
            <Icon name="calendar" />
          </span>
          Viewing booked · Thu 18:15
        </div>
        <div
          data-chip
          aria-hidden="true"
          className="absolute right-[max(1rem,calc(50%-44rem))] bottom-[22%] hidden items-center gap-2 rounded-pill bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-md lg:flex"
        >
          <span className="grid size-6 place-items-center rounded-pill bg-brass-soft text-ink">
            <Icon name="pound" />
          </span>
          Rent received · £1,450
        </div>
      </div>

      <Container className="py-16 md:py-20">
        <p className="text-center text-sm text-ink-muted">{hero.trustedBy}</p>
        <HydrationBoundary>
          <Marquee label="Agencies using Hallway (fictional)" className="mt-8" duration={36}>
            {agencies.map((agency) => (
              <li key={agency.name} className="px-8 md:px-12">
                <AgencyWordmark agency={agency} />
              </li>
            ))}
          </Marquee>
        </HydrationBoundary>
      </Container>
    </section>
  );
}
