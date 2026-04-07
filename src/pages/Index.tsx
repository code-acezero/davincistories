import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MusicPlayer from "@/components/MusicPlayer";
import PageTransition from "@/components/PageTransition";
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollEnd = document.body.scrollHeight - window.innerHeight;
      const p = scrollEnd > 0 ? Math.round((window.scrollY / scrollEnd) * 100) : 0;
      setPercent(p);
      setShowTop(p > 5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>DaVinci Stories — Creative Photography & Videography</title>
        <meta name="description" content="DaVinci Stories is a creative photography and videography studio in Bangladesh. We turn your imagination into reality through stunning visuals and cinematic storytelling." />
        <link rel="canonical" href="https://davincistories.lovable.app/" />
        <meta property="og:title" content="DaVinci Stories — Creative Photography & Videography" />
        <meta property="og:description" content="Turn your imagination into reality with DaVinci Stories. Professional photography, videography, and creative storytelling." />
        <meta property="og:url" content="https://davincistories.lovable.app/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "DaVinci Stories",
          "description": "Creative photography and videography studio",
          "address": { "@type": "PostalAddress", "addressLocality": "Khoksa, Kushtia", "addressRegion": "Khulna", "addressCountry": "BD" },
          "telephone": "+8801603327099",
          "email": "davincistories@gmail.com",
          "url": "https://davincistories.lovable.app"
        })}</script>
      </Helmet>
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
    </PageTransition>
  );
};

export default Index;
