import { useState, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MusicPlayer from "@/components/MusicPlayer";
import { lazy, Suspense } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

const AboutSection = lazy(() => import("@/components/AboutSection"));
const CategoriesSection = lazy(() => import("@/components/CategoriesSection"));
const TeamSection = lazy(() => import("@/components/TeamSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const HomeSectionShowcase = lazy(() => import("@/components/HomeSectionShowcase"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const [percent, setPercent] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useScrollReveal();

  // Scroll listener for back-to-top
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      const scrollEnd = document.body.scrollHeight - window.innerHeight;
      const p = Math.round((window.scrollY / scrollEnd) * 100);
      setPercent(p);
      setShowTop(p > 5);
    }, { passive: true });
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <AboutSection />
          <CategoriesSection />
          <TeamSection />
          <ServicesSection />
          <PortfolioSection />
          <HomeSectionShowcase />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <MusicPlayer />
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 left-5 z-[100] w-12 h-12 rounded-full glass-card-strong grid place-content-center text-xs font-medium text-primary hover:scale-110 transition-transform"
        >
          {percent}%
        </button>
      )}
    </>
  );
};

export default Index;
