import { useState, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LoadingScreen from "@/components/LoadingScreen";
import MusicPlayer from "@/components/MusicPlayer";
import { lazy, Suspense } from "react";

const AboutSection = lazy(() => import("@/components/AboutSection"));
const CategoriesSection = lazy(() => import("@/components/CategoriesSection"));
const TeamSection = lazy(() => import("@/components/TeamSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const [entered, setEntered] = useState(false);

  const handleEnter = useCallback(() => {
    setEntered(true);
    window.dispatchEvent(new Event("davinci-enter"));
  }, []);

  if (!entered) {
    return <LoadingScreen onEnter={handleEnter} />;
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
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <MusicPlayer />
      <BackToTop />
    </>
  );
};

const BackToTop = () => {
  const [percent, setPercent] = useState(0);
  const [show, setShow] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      const scrollEnd = document.body.scrollHeight - window.innerHeight;
      const p = Math.round((window.scrollY / scrollEnd) * 100);
      setPercent(p);
      setShow(p > 5);
    }, { passive: true });
  }

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 left-5 z-[100] w-12 h-12 rounded-full bg-primary text-primary-foreground grid place-content-center text-xs font-medium btn-glow"
    >
      {percent}%
    </button>
  );
};

export default Index;
