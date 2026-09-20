import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { TopFloatingNavbar } from '../components/landing/TopFloatingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { StatsBar } from '../components/landing/StatsBar';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { PricingSection } from '../components/landing/PricingSection';
import { FAQSection } from '../components/landing/FAQSection';
import { CtaBand } from '../components/landing/CtaBand';
import { Footer } from '../components/landing/Footer';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onNavigateAuth: () => void;
  onNavigateDemo: () => void;
  onSelectFeature?: (featureId: string) => void;
  isAuthenticated?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateAuth,
  onNavigateDemo,
  onSelectFeature,
  isAuthenticated = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Wire Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F6F3EC] dark:bg-[#0E1615] text-[#14201F] dark:text-[#F6F3EC] selection:bg-[#C6A15B]/30 selection:text-[#0E4F4F] transition-colors duration-300"
    >
      {/* 1. Clean Sticky Top Navbar */}
      <TopFloatingNavbar
        onNavigateAuth={onNavigateAuth}
        onNavigateDemo={onNavigateDemo}
        isAuthenticated={isAuthenticated}
      />

      <main>
        {/* 2. Hero Section with Live Mockup */}
        <HeroSection
          onNavigateAuth={onNavigateAuth}
          onNavigateDemo={onNavigateDemo}
          isAuthenticated={isAuthenticated}
        />

        {/* 3. High Contrast Stats Bar */}
        <StatsBar />

        {/* 4. Imkoniyatlar (6 Premium High-Contrast Cards) */}
        <FeaturesSection onSelectFeature={onSelectFeature} />

        {/* 5. Qanday Ishlaydi (3 Steps Timeline) */}
        <HowItWorksSection />

        {/* 6. Narxlar (SaaS + On-Premise with real pricing) */}
        <PricingSection onNavigateAuth={onNavigateAuth} />

        {/* 7. FAQ Accordion */}
        <FAQSection />

        {/* 8. CTA Band */}
        <CtaBand onNavigateAuth={onNavigateAuth} />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};
