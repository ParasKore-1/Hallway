import { Seo } from '@/app/Seo';
import { HydrationBoundary } from '@/components/layout/HydrationBoundary';
import { ClosingCtaSection } from '@/components/sections/home/ClosingCtaSection';
import { DemoSection } from '@/components/sections/home/DemoSection';
import { FeaturesSection } from '@/components/sections/home/FeaturesSection';
import { HeroSection } from '@/components/sections/home/HeroSection';
import { HowItWorksSection } from '@/components/sections/home/HowItWorksSection';
import { IntegrationsSection } from '@/components/sections/home/IntegrationsSection';
import { MetricsSection } from '@/components/sections/home/MetricsSection';
import { PricingFaqSection } from '@/components/sections/home/PricingFaqSection';
import { ProblemSection } from '@/components/sections/home/ProblemSection';
import { TestimonialsSection } from '@/components/sections/home/TestimonialsSection';
import { pageMeta } from '@/content/pages';

export default function Home() {
  return (
    <>
      <Seo meta={pageMeta.home} />
      <HeroSection />
      <HydrationBoundary>
        <ProblemSection />
      </HydrationBoundary>
      <HydrationBoundary>
        <FeaturesSection />
      </HydrationBoundary>
      <HydrationBoundary>
        <HowItWorksSection />
      </HydrationBoundary>
      <HydrationBoundary>
        <DemoSection />
      </HydrationBoundary>
      <HydrationBoundary>
        <MetricsSection />
      </HydrationBoundary>
      <HydrationBoundary>
        <TestimonialsSection />
      </HydrationBoundary>
      <HydrationBoundary>
        <IntegrationsSection />
      </HydrationBoundary>
      <HydrationBoundary>
        <PricingFaqSection />
      </HydrationBoundary>
      <HydrationBoundary>
        <ClosingCtaSection />
      </HydrationBoundary>
    </>
  );
}
