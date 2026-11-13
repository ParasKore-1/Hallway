import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { problem, type Stat } from '@/content/home';
import { cn } from '@/lib/cn';

interface StatListProps {
  stats: readonly Stat[];
  inverse?: boolean;
}

function StatList({ stats, inverse = false }: StatListProps) {
  return (
    <Reveal stagger className="mt-10 grid gap-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn('border-t pt-6', inverse ? 'border-on-accent/30' : 'border-line')}
        >
          <p className="font-display text-3xl">
            {stat.value}
            {stat.footnote && (
              <sup className="ml-0.5 align-super text-base">
                *<span className="sr-only"> illustrative figure</span>
              </sup>
            )}
          </p>
          <p className={cn('mt-2 max-w-[30ch]', inverse ? 'text-on-accent/85' : 'text-ink-muted')}>
            {stat.label}
          </p>
        </div>
      ))}
    </Reveal>
  );
}

export function ProblemSection() {
  return (
    <Section labelledBy="problem-title">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-surface-2 p-8 md:p-12">
            <SectionHeader id="problem-title" eyebrow={problem.eyebrow} title={problem.title} />
            <p className="mt-6 max-w-[52ch] text-pretty text-ink-muted">{problem.lead}</p>
            <StatList stats={problem.stats} />
          </div>
          <div className="relative overflow-hidden rounded-lg bg-accent p-8 text-on-accent md:p-12">
            <span
              aria-hidden="true"
              className="arch pointer-events-none absolute -right-24 -bottom-24 h-96 w-72 border border-on-accent/15"
            />
            <p className="eyebrow text-on-accent/80!">{problem.solution.eyebrow}</p>
            <Heading level={3} size="2xl" className="mt-5 max-w-[18ch] text-on-accent">
              {problem.solution.title}
            </Heading>
            <StatList stats={problem.solution.points} inverse />
          </div>
        </div>
        <p className="mt-6 text-xs text-ink-muted">* {problem.footnote}</p>
      </Container>
    </Section>
  );
}
