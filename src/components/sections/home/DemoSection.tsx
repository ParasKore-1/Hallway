import { AnimatePresence, m } from 'motion/react';
import { useState } from 'react';
import { ChatBubble } from '@/components/sections/shared/ChatBubble';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { Tabs } from '@/components/ui/Tabs';
import { demo, type DemoView } from '@/content/home';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { easing } from '@/lib/motion';

const icons = { enquiries: 'chat', viewings: 'calendar', maintenance: 'wrench' } as const;

interface DemoPanelProps {
  view: DemoView;
  active: boolean;
}

function DemoPanel({ view, active }: DemoPanelProps) {
  const reduced = useReducedMotion();
  return (
    <div className="grid gap-4 rounded-lg bg-surface-2 p-3 md:grid-cols-[1.4fr_1fr] md:p-5">
      <div className="rounded-md bg-surface p-5 shadow-sm">
        <p className="text-sm font-semibold">{view.title}</p>
        <p className="mt-1 text-sm text-ink-muted">{view.summary}</p>
        <div className="mt-5 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {active &&
              view.thread.map((message, index) => (
                <m.div
                  key={`${view.id}-${index}`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduced ? 0 : 0.12 + index * 0.18,
                    duration: 0.5,
                    ease: easing.outExpo,
                  }}
                >
                  <ChatBubble message={message} />
                </m.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex flex-col rounded-md bg-accent p-5 text-on-accent">
        <p className="inline-flex items-center gap-2 text-sm font-semibold">
          <Icon name="check" />
          {view.outcome.label}
        </p>
        <dl className="mt-5 grid gap-3">
          {view.outcome.rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4 border-b border-on-accent/20 pb-3"
            >
              <dt className="text-sm text-on-accent/80">{label}</dt>
              <dd className="font-display text-lg">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-auto pt-6 text-xs text-on-accent/80">Synced to your CRM automatically.</p>
      </div>
    </div>
  );
}

/** Interactive product demo: tabs swap between the three most common conversation types. */
export function DemoSection() {
  const [selected, setSelected] = useState<string>('enquiries');
  return (
    <Section
      labelledBy="demo-title"
      tone="muted"
      data-cursor-label="Explore"
      className="defer-render"
    >
      <Container>
        <SectionHeader id="demo-title" eyebrow={demo.eyebrow} title={demo.title} lead={demo.lead} />
        <Tabs
          className="mt-12"
          label="Conversation types"
          value={selected}
          onValueChange={setSelected}
          items={demo.views.map((view) => ({
            id: view.id,
            label: (
              <>
                <Icon name={icons[view.id]} />
                {view.label}
              </>
            ),
            content: <DemoPanel view={view} active={view.id === selected} />,
          }))}
        />
      </Container>
    </Section>
  );
}
