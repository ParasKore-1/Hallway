import { Counter } from '@/components/motion/Counter';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { metrics } from '@/content/home';

export function MetricsSection() {
  return (
    <Section labelledBy="metrics-title" tone="dark" className="defer-render">
      <Container>
        <SectionHeader id="metrics-title" eyebrow={metrics.eyebrow} title={metrics.title} />
        <dl className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.items.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col-reverse gap-3 border-t border-line pt-6"
            >
              <dt className="max-w-[22ch] text-ink-muted">{metric.label}</dt>
              <dd className="font-display text-metric text-ink">
                <Counter
                  value={metric.value}
                  {...('suffix' in metric ? { suffix: metric.suffix } : {})}
                  {...('decimals' in metric ? { decimals: metric.decimals } : {})}
                />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-12 text-xs text-ink-muted">{metrics.footnote}</p>
      </Container>
    </Section>
  );
}
