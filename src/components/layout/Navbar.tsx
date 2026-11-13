import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Link } from '@/components/ui/Link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { site } from '@/content/site';
import { useDemoDialog } from '@/hooks/useDemoDialog';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

/**
 * Sticky header that slides away while scrolling down and returns on scroll up
 * (transform only). It never hides while focus is inside it.
 */
export function Navbar() {
  const { openDemo } = useDemoDialog();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Close the menu when the route changes (including back/forward), without an effect.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
      setScrolled(y > 8);
      setHidden(y > 160 && y > lastY && !focusInside);
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onFocusIn = () => {
      setHidden(false);
    };
    const header = headerRef.current;
    window.addEventListener('scroll', onScroll, { passive: true });
    header?.addEventListener('focusin', onFocusIn);
    return () => {
      window.removeEventListener('scroll', onScroll);
      header?.removeEventListener('focusin', onFocusIn);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-(--hw-z-nav) transition-[translate,background-color,border-color] duration-(--hw-dur-base) ease-out-expo',
        'border-b',
        scrolled ? 'border-line/60 bg-bg/85 backdrop-blur-md' : 'border-transparent bg-bg',
        hidden && '-translate-y-full',
      )}
    >
      <div className="mx-auto flex h-16 max-w-page items-center gap-6 px-gutter md:h-20">
        <RouterLink to="/" className="rounded-xs" aria-label={`${site.name} — home`}>
          <Logo />
        </RouterLink>

        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium">
            {site.nav.map((item) => (
              <li key={item.to}>
                <Link href={item.to} variant="draw" className="py-2 text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          <Button size="sm" className="hidden md:inline-flex" onClick={openDemo} data-magnetic>
            {site.cta.demo}
          </Button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setMenuOpen(true);
            }}
            className="grid size-11 place-items-center rounded-pill text-ink hover:bg-surface-2 md:hidden"
          >
            <Icon name="menu" label="Open menu" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
        }}
        onDemo={() => {
          setMenuOpen(false);
          openDemo();
        }}
      />
    </header>
  );
}
