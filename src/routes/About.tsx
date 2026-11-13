import { Seo } from '@/app/Seo';
import { Reveal } from '@/components/motion/Reveal';
import { InitialsAvatar } from '@/components/sections/shared/InitialsAvatar';
import { PageHero } from '@/components/sections/shared/PageHero';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { aboutIntro, team, timeline, values } from '@/content/about';
import { pageMeta } from '@/content/pages';

export default function About() {
  return (
    <>
      <Seo meta={pageMeta.about} />
      <PageHero {...aboutIntro} />

      <Section labelledBy="timeline-title" tone="muted">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeader id="timeline-title" eyebrow={timeline.eyebrow} title={timeline.title} />
          <Reveal stagger className="relative border-l border-ink-muted/40">
            {timeline.items.map((item) => (
              <div key={item.year} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
                <span
                  aria-hidden="true"
                  className="arch absolute top-1 -left-[0.45rem] h-5 w-3.5 bg-accent"
                />
                <p className="font-display text-3xl text-accent">{item.year}</p>
                <Heading level={3} size="lg" className="mt-2">
                  {item.title}
                </Heading>
                <p className="mt-2 max-w-[52ch] text-pretty text-ink-muted">{item.body}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section labelledBy="values-title" id="values">
        <Container>
          <SectionHeader id="values-title" eyebrow={values.eyebrow} title={values.title} />
          <Reveal stagger className="mt-12 grid gap-4 md:grid-cols-2">
            {values.items.map((value, index) => (
              <div key={value.title} className="flex gap-6 rounded-lg border border-line p-8">
                <span aria-hidden="true" className="font-display text-2xl text-brass">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <Heading level={3} size="xl">
                    {value.title}
                  </Heading>
                  <p className="mt-3 text-pretty text-ink-muted">{value.body}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section labelledBy="team-title" tone="muted" id="team">
        <Container>
          <SectionHeader
            id="team-title"
            eyebrow={team.eyebrow}
            title={team.title}
            lead={team.note}
          />
          <Reveal stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.members.map((member) => (
              <article key={member.name} className="rounded-lg bg-bg p-6">
                <div className="arch grid aspect-[4/5] place-items-center bg-surface-2">
                  <InitialsAvatar name={member.name} size="lg" className="size-20 text-xl" />
                </div>
                <Heading level={3} size="lg" className="mt-6">
                  {member.name}
                </Heading>
                <p className="text-sm font-semibold text-accent">{member.role}</p>
                <p className="mt-2 text-sm text-ink-muted">{member.bio}</p>
              </article>
            ))}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
