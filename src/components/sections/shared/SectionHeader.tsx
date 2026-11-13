import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { Heading, type HeadingLevel } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

export interface SectionHeaderProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  level?: HeadingLevel;
  align?: 'start' | 'center';
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
  level = 2,
  align = 'start',
  className,
  children,
}: SectionHeaderProps) {
  return (
    <Reveal
      stagger
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <p className="eyebrow">{eyebrow}</p>
      <Heading level={level} size={level === 1 ? '3xl' : '2xl'} id={id} className="max-w-[22ch]">
        {title}
      </Heading>
      {lead && (
        <Text size="lg" tone="muted" className="max-w-[60ch]">
          {lead}
        </Text>
      )}
      {children}
    </Reveal>
  );
}
