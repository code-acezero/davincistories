import { useScrollReveal } from "@/hooks/useScrollReveal";

const AboutSection = () => {
  const titleRef = useScrollReveal<HTMLParagraphElement>();
  const contentRef = useScrollReveal<HTMLDivElement>();
  const quoteRef = useScrollReveal<HTMLDivElement>("right");

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container">
        <p ref={titleRef} className="text-foreground/25 text-xl uppercase tracking-[3.5px] mb-8">
          About
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div ref={contentRef}>
            <h2 className="font-recoleta text-4xl md:text-5xl font-light mb-6">
              DaVinci Stories — Where Imagination Meets Reality
            </h2>
            <p className="text-foreground/70 font-light leading-relaxed">
              We are a passionate team of creatives specializing in cinematography, photography, and event coverage.
              Based in Bangladesh, we bring stories to life through our lens — capturing moments that last forever.
              From weddings to fashion shoots, from outdoor adventures to product launches, we transform your
              vision into stunning visual narratives.
            </p>
          </div>

          <div ref={quoteRef} className="relative">
            <img src="/images/about-quote.svg" width={40} height={40} alt="" className="mb-4 opacity-50" />
            <blockquote className="font-recoleta text-2xl md:text-3xl font-light italic text-foreground/75">
              "Every picture tells a story, but we make yours unforgettable."
            </blockquote>
            <div className="mt-6">
              <img src="/images/signature.png" width={150} height={60} alt="signature" className="opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
