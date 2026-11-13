import { m } from 'motion/react';
import { NavLink } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { site } from '@/content/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration, easing, stagger } from '@/lib/motion';

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onDemo: () => void;
}

const links = [{ label: 'Home', to: '/' }, ...site.nav];

/** Full-screen menu for < md. Large serif links stagger in; reduced motion = fade only. */
export function MobileMenu({ open, onClose, onDemo }: MobileMenuProps) {
  const reduced = useReducedMotion();
  return (
    <Drawer
      id="mobile-menu"
      open={open}
      onClose={onClose}
      title="Menu"
      hideTitle
      side="right"
      closeLabel="Close menu"
      panelClassName="max-w-none"
    >
      <nav aria-label="Mobile" className="flex h-full flex-col">
        <ul className="mt-8 flex flex-col gap-2">
          {links.map((item, index) => (
            <m.li
              key={item.to}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduced ? 0 : 0.15 + index * stagger,
                duration: duration.slow,
                ease: easing.outExpo,
              }}
            >
              <NavLink
                to={item.to}
                end
                onClick={onClose}
                className="block rounded-xs py-2 font-display text-3xl text-ink aria-[current=page]:text-accent"
              >
                {item.label}
              </NavLink>
            </m.li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-6">
          <ThemeToggle />
          <Button size="lg" onClick={onDemo}>
            {site.cta.demo}
          </Button>
        </div>
      </nav>
    </Drawer>
  );
}
