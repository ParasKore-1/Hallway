import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import { story, type StoryStep } from '@/content/product';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { easing } from '@/lib/motion';
import { StoryMock } from './StoryMock';

/**
 * Sticky scroll-story. ≥1024px: steps scroll on the left while the mock on the right stays
 * pinned (CSS sticky) and swaps state as each step crosses the middle of the viewport
 * (IntersectionObserver — no scroll handlers). Below 1024px each step carries its own mock.
 * Reduced motion: the mock swaps instantly.
 */
export function ProductStorySection() {
  const [active, setActive] = useState<StoryStep['id']>('arrive');
  const reduced = useReducedMotion();
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.step as StoryStep['id'] | undefined;
            if (id) setActive(id);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section aria-labelledby="story-title" className="pb-section" data-cursor-label="Scroll">
      <Container>
        <Heading level={2} size="2xl" id="story-title" className="sr-only">
          {story.title}
        </Heading>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <ol className="flex flex-col gap-16 lg:gap-0">
            {story.steps.map((step, index) => (
              <li
                key={step.id}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                data-step={step.id}
                className="flex flex-col justify-center lg:min-h-[85vh]"
              >
                <p className="eyebrow">{step.eyebrow}</p>
                <Heading
                  level={3}
                  size="2xl"
                  className={cn(
                    'mt-4 transition-opacity duration-(--hw-dur-slow)',
                    active === step.id ? 'lg:opacity-100' : 'lg:opacity-60',
                  )}
                >
                  {step.title}
                </Heading>
                <p className="mt-4 max-w-[48ch] text-pretty text-ink-muted">{step.body}</p>
                <ul className="mt-6 grid gap-2 text-sm">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <Icon name="check" className="text-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
                <StoryMock step={step.id} className="mt-8 lg:hidden" />
              </li>
            ))}
          </ol>
          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-15rem)]">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={active}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: easing.outExpo }}
                >
                  <StoryMock step={active} />
                </m.div>
              </AnimatePresence>
              <ol aria-hidden="true" className="mt-6 flex gap-2">
                {story.steps.map((step) => (
                  <li
                    key={step.id}
                    className={cn(
                      'h-1 flex-1 origin-left rounded-pill transition-colors duration-(--hw-dur-base)',
                      step.id === active ? 'bg-accent' : 'bg-line',
                    )}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
