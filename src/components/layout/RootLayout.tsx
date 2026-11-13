import { domAnimation, LazyMotion } from 'motion/react';
import { RouteTransition } from '@/app/RouteTransition';
import { Cursor } from '@/components/motion/Cursor';
import { Preloader } from '@/components/motion/Preloader';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { site } from '@/content/site';
import { DemoDialogProvider } from './DemoDialogProvider';
import { Footer } from './Footer';
import { HydrationBoundary } from './HydrationBoundary';
import { Navbar } from './Navbar';
import { SkipLink } from './SkipLink';

export const MAIN_ID = 'main';

/*
 * Animation features are bundled, not lazy-loaded: if a route change starts before lazily
 * loaded features arrive, AnimatePresence can never finish the exit and the old page sticks.
 * `m` + LazyMotion still drops the unused feature set (layout/drag) from the bundle.
 */
export function RootLayout() {
  return (
    <LazyMotion features={domAnimation} strict>
      <SmoothScroll>
        <ToastProvider>
          <DemoDialogProvider>
            <div id="top" />
            <SkipLink targetId={MAIN_ID} label={site.skipLinkLabel} />
            <Navbar />
            <main id={MAIN_ID} tabIndex={-1} className="outline-none">
              <RouteTransition mainId={MAIN_ID} />
            </main>
            <HydrationBoundary>
              <Footer />
            </HydrationBoundary>
            <Preloader />
            <Cursor />
          </DemoDialogProvider>
        </ToastProvider>
      </SmoothScroll>
    </LazyMotion>
  );
}
