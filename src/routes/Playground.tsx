import { useState, type ReactNode } from 'react';
import { Seo } from '@/app/Seo';
import { Accordion } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Drawer } from '@/components/ui/Drawer';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import { Link } from '@/components/ui/Link';
import { Marquee } from '@/components/ui/Marquee';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Tag } from '@/components/ui/Tag';
import { Text } from '@/components/ui/Text';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Tooltip } from '@/components/ui/Tooltip';
import { pageIntros, pageMeta } from '@/content/pages';
import { useToast } from '@/hooks/useToast';

const swatches = [
  'bg',
  'surface',
  'surface-2',
  'ink',
  'ink-muted',
  'line',
  'accent',
  'brass',
  'brass-soft',
  'focus',
  'danger',
  'success',
] as const;

const swatchClass: Record<(typeof swatches)[number], string> = {
  bg: 'bg-bg',
  surface: 'bg-surface',
  'surface-2': 'bg-surface-2',
  ink: 'bg-ink',
  'ink-muted': 'bg-ink-muted',
  line: 'bg-line',
  accent: 'bg-accent',
  brass: 'bg-brass',
  'brass-soft': 'bg-brass-soft',
  focus: 'bg-focus',
  danger: 'bg-danger',
  success: 'bg-success',
};

const typeScale = [
  ['text-display', 'font-display'],
  ['text-3xl', 'font-display'],
  ['text-2xl', 'font-display'],
  ['text-xl', 'font-display'],
  ['text-lg', ''],
  ['text-base', ''],
  ['text-sm', ''],
  ['text-xs', ''],
] as const;

/** Simulated focus ring for static "focus" state previews. */
const FORCE_FOCUS = 'outline-2 outline-offset-3 outline-focus';

interface DemoBlockProps {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}

function DemoBlock({ id, title, note, children }: DemoBlockProps) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-12">
      <Heading level={2} size="xl" id={id}>
        {title}
      </Heading>
      {note && (
        <Text size="sm" tone="muted" className="mt-2" measure>
          {note}
        </Text>
      )}
      <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line lg:grid-cols-2">
        <div data-theme="light" className="p-6 md:p-8">
          <p className="eyebrow mb-6">Light</p>
          {children}
        </div>
        <div data-theme="dark" className="p-6 md:p-8">
          <p className="eyebrow mb-6">Dark</p>
          {children}
        </div>
      </div>
    </section>
  );
}

function ButtonMatrix() {
  const variants = ['primary', 'secondary', 'ghost', 'link'] as const;
  return (
    <div className="space-y-6">
      {variants.map((variant) => (
        <div key={variant}>
          <p className="mb-3 font-mono text-xs text-ink-muted">{variant}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant={variant}>Default</Button>
            <Button variant={variant} className={FORCE_FOCUS}>
              Focus
            </Button>
            <Button variant={variant} loading>
              Loading
            </Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Button variant={variant} iconEnd={<Icon name="arrow-right" />}>
              With icon
            </Button>
          </div>
        </div>
      ))}
      <div>
        <p className="mb-3 font-mono text-xs text-ink-muted">sizes · asChild</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="secondary" aria-label="Next">
            <Icon name="arrow-right" />
          </Button>
          <Button asChild variant="secondary">
            <a href="#buttons">Anchor via asChild</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function OverlayDemos() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() => {
          setModal(true);
        }}
      >
        Open modal
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          setDrawer(true);
        }}
      >
        Open drawer
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          toast({
            title: 'Viewing confirmed',
            description: 'Thu 14:30 · 12 Elm Row',
            tone: 'success',
          });
        }}
      >
        Show toast
      </Button>
      <Modal
        open={modal}
        onClose={() => {
          setModal(false);
        }}
        title="Reassign enquiry"
        description="Move this conversation to another negotiator."
      >
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setModal(false);
            }}
          >
            Reassign
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setModal(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Drawer
        open={drawer}
        onClose={() => {
          setDrawer(false);
        }}
        title="Conversation details"
      >
        <Text tone="muted">Drawers share the modal’s focus trap, Esc and scroll lock.</Text>
        <Button
          className="mt-6"
          onClick={() => {
            setDrawer(false);
          }}
        >
          Done
        </Button>
      </Drawer>
    </div>
  );
}

const marqueeItems = ['Portal sync', 'CRM', 'Calendar', 'Accounting', 'WhatsApp', 'Email'];

export default function Playground() {
  return (
    <>
      <Seo meta={pageMeta.playground} />
      <Container className="py-section">
        <p className="eyebrow">{pageIntros.playground.eyebrow}</p>
        <Heading level={1} size="3xl" className="mt-4">
          {pageIntros.playground.title}
        </Heading>
        <Text size="lg" tone="muted" className="mt-6" measure>
          {pageIntros.playground.lead}
        </Text>

        <section aria-labelledby="tokens" className="py-12">
          <Heading level={2} size="xl" id="tokens">
            Colour tokens
          </Heading>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line lg:grid-cols-2">
            {(['light', 'dark'] as const).map((theme) => (
              <ul
                key={theme}
                data-theme={theme}
                aria-label={`${theme} theme colours`}
                className="grid grid-cols-3 gap-4 p-6 sm:grid-cols-4"
              >
                {swatches.map((name) => (
                  <li key={name} className="text-xs">
                    <span
                      aria-hidden="true"
                      className={`block h-12 rounded-sm border border-ink-muted/40 ${swatchClass[name]}`}
                    />
                    <span className="mt-2 block font-mono text-ink-muted">{name}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        <section aria-labelledby="type" className="border-t border-line py-12">
          <Heading level={2} size="xl" id="type">
            Type scale
          </Heading>
          <ul className="mt-6 space-y-4">
            {typeScale.map(([size, family]) => (
              <li key={size} className="flex flex-col gap-1 border-b border-line pb-4">
                <span className="font-mono text-xs text-ink-muted">{size}</span>
                <span className={`${size} ${family} truncate`}>Viewing booked for Thursday</span>
              </li>
            ))}
          </ul>
        </section>

        <DemoBlock
          id="buttons"
          title="Button"
          note="Variants × states. Hover and pressed states are live; focus is simulated for the static preview."
        >
          <ButtonMatrix />
        </DemoBlock>

        <DemoBlock id="text" title="Heading, Text, Link, Badge, Tag">
          <Heading level={3} size="2xl">
            Level 3, sized 2xl
          </Heading>
          <Text tone="muted" className="mt-3">
            Body copy with an <Link href="/pricing">internal link</Link>, an{' '}
            <Link href="https://example.com">external link</Link> and a{' '}
            <Link href="/about" variant="draw">
              draw-underline link
            </Link>
            .
          </Text>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="brass">Brass</Badge>
            <Badge tone="success" dot>
              Resolved
            </Badge>
            <Badge tone="danger" dot>
              Urgent
            </Badge>
            <Tag>Viewings</Tag>
            <Tag>HMO</Tag>
          </div>
        </DemoBlock>

        <DemoBlock id="cards" title="Card">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="font-semibold">Surface</p>
              <Text size="sm" tone="muted">
                Default card
              </Text>
            </Card>
            <Card variant="muted">
              <p className="font-semibold">Muted</p>
              <Text size="sm" tone="muted">
                On surface-2
              </Text>
            </Card>
            <Card variant="outline" interactive>
              <p className="font-semibold">Interactive</p>
              <Text size="sm" tone="muted">
                Hover me
              </Text>
            </Card>
          </div>
        </DemoBlock>

        <DemoBlock
          id="accordion"
          title="Accordion"
          note="↑/↓ move between questions, Home/End jump."
        >
          <Accordion
            headingLevel={3}
            defaultOpen={['a']}
            items={[
              {
                id: 'a',
                title: 'Does Hallway replace my negotiators?',
                content:
                  'No — it handles the repetitive first response so they can focus on people.',
              },
              {
                id: 'b',
                title: 'Can I approve messages before they send?',
                content: 'Yes. Approval mode routes every outgoing message to a human first.',
              },
              {
                id: 'c',
                title: 'Where is tenant data stored?',
                content: 'In this fictional world, in UK data centres only.',
              },
            ]}
          />
        </DemoBlock>

        <DemoBlock id="tabs" title="Tabs" note="←/→ move and select, Home/End jump.">
          <Tabs
            label="Inbox views"
            items={[
              {
                id: 'enq',
                label: 'Enquiries',
                content: <Text tone="muted">14 new enquiries since 6pm.</Text>,
              },
              {
                id: 'view',
                label: 'Viewings',
                content: <Text tone="muted">6 viewings booked for tomorrow.</Text>,
              },
              {
                id: 'maint',
                label: 'Maintenance',
                content: <Text tone="muted">2 urgent repairs triaged.</Text>,
              },
            ]}
          />
        </DemoBlock>

        <DemoBlock id="tooltip" title="Tooltip, ThemeToggle">
          <div className="flex items-center gap-6 pt-10">
            <Tooltip content="Replies drafted by Hallway, sent after your approval.">
              <Button variant="secondary" size="sm">
                Approval mode
              </Button>
            </Tooltip>
            <ThemeToggle />
          </div>
        </DemoBlock>

        <DemoBlock
          id="marquee"
          title="Marquee"
          note="Pauses on hover, focus or the Pause button. Static under reduced motion."
        >
          <div className="pt-10">
            <Marquee label="Example channels" duration={20}>
              {marqueeItems.map((item) => (
                <li key={item} className="px-6 font-display text-xl text-ink-muted">
                  {item}
                </li>
              ))}
            </Marquee>
          </div>
        </DemoBlock>

        <section aria-labelledby="overlays" className="border-t border-line py-12">
          <Heading level={2} size="xl" id="overlays">
            Modal, Drawer, Toast
          </Heading>
          <Text size="sm" tone="muted" className="mt-2 mb-8" measure>
            Overlays render in a portal at the page theme. Focus is trapped, Esc closes, scroll is
            locked and focus returns to the trigger.
          </Text>
          <OverlayDemos />
        </section>
      </Container>
    </>
  );
}
