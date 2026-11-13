import { Reveal } from '@/components/motion/Reveal';
import { InitialsAvatar } from '@/components/sections/shared/InitialsAvatar';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { testimonials } from '@/content/home';

export function TestimonialsSection() {
  return (
    <Section labelledBy="testimonials-title" className="defer-render">
      <Container>
        <SectionHeader
          id="testimonials-title"
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
        />
        <Reveal stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.items.map((item, index) => (
            <figure
              key={item.name}
              className={
                index === 0
                  ? 'flex flex-col rounded-lg bg-accent p-8 text-on-accent md:col-span-2 lg:col-span-1'
                  : 'flex flex-col rounded-lg border border-line bg-surface p-8'
              }
            >
              <Badge
                className={index === 0 ? 'self-start bg-on-accent/15 text-on-accent' : 'self-start'}
              >
                {testimonials.badge}
              </Badge>
              <blockquote className="mt-6 font-display text-xl text-pretty">
                <p>“{item.quote}”</p>
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-8">
                <InitialsAvatar name={item.name} />
                <span className="text-sm">
                  <span className="block font-semibold">{item.name}</span>
                  <span className={index === 0 ? 'text-on-accent/80' : 'text-ink-muted'}>
                    {item.role}, {item.agency}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
