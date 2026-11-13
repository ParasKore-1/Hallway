import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { howItWorks } from '@/content/home';
import { useGsapContext } from '@/hooks/useGsapContext';
import { hasPassedRevealLine, isDesktopViewport } from '@/lib/gsap';

/**
 * Four steps. ≥1024px with motion allowed: the section pins and the steps travel
 * horizontally as you scroll — a walk down the corridor (gsap.matchMedia handles the switch).
 * Smaller screens, reduced motion and no-JS: a normal stacked/grid layout.
 */
export function HowItWorksSection() {
  const ref = useGsapContext<HTMLElement>(
    ({ scope, reduced, desktop, gsap }) => {
      const track = scope.querySelector<HTMLElement>('[data-track]');
      const progress = scope.querySelector<HTMLElement>('[data-progress]');
      if (!track) return;

      if (!desktop || reduced) {
        if (hasPassedRevealLine(track, 0.85)) return;
        gsap.from(track.children, {
          opacity: 0,
          y: reduced ? 0 : 32,
          stagger: 0.1,
          duration: reduced ? 0.25 : 0.8,
          scrollTrigger: { trigger: track, start: 'top 85%', once: true },
        });
        return;
      }

      scope.dataset.pinned = 'true';
      const distance = () => track.scrollWidth - track.clientWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progress) progress.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        delete scope.dataset.pinned;
      };
    },
    // Eager only where the pin exists (≥1024px): its spacer shifts every later trigger.
    { eager: isDesktopViewport() },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="how-title"
      className="group/how relative overflow-x-clip py-section lg:data-[pinned=true]:flex lg:data-[pinned=true]:min-h-dvh lg:data-[pinned=true]:flex-col lg:data-[pinned=true]:justify-center lg:data-[pinned=true]:py-16"
    >
      <Container>
        <SectionHeader id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} />
      </Container>
      <Container className="mt-12 overflow-x-clip lg:overflow-visible">
        <ol
          data-track
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:group-data-[pinned=true]/how:flex lg:group-data-[pinned=true]/how:w-full lg:group-data-[pinned=true]/how:gap-6"
        >
          {howItWorks.steps.map((step) => (
            <li
              key={step.number}
              className="relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface p-6 md:p-8 lg:group-data-[pinned=true]/how:min-h-[26rem] lg:group-data-[pinned=true]/how:w-[min(38rem,55vw)] lg:group-data-[pinned=true]/how:shrink-0"
            >
              <span
                aria-hidden="true"
                className="arch absolute -top-10 right-6 grid h-28 w-20 place-items-center bg-surface-2 pt-6 font-display text-2xl text-ink-muted"
              >
                {step.number}
              </span>
              <p className="eyebrow">Step {step.number}</p>
              <Heading level={3} size="2xl" className="mt-10">
                {step.title}
              </Heading>
              <p className="mt-4 max-w-[44ch] text-pretty text-ink-muted">{step.body}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                {step.detail.map((detail) => (
                  <li
                    key={detail}
                    className="rounded-pill border border-ink-muted/50 px-3 py-1 text-xs text-ink-muted"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div
          aria-hidden="true"
          className="mt-10 hidden h-px bg-line lg:group-data-[pinned=true]/how:block"
        >
          <div data-progress className="h-px origin-left scale-x-0 bg-accent" />
        </div>
      </Container>
    </section>
  );
}
