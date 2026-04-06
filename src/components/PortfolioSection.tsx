import { useScrollReveal } from "@/hooks/useScrollReveal";

const portfolioItems = [
  { title: "With Nature", tag: "Outdoor", image: "/gallery/l8.jpg", width: 700, height: 605 },
  { title: "Wedding Shot", tag: "Wedding", image: "/gallery/w1.jpg", width: 700, height: 1091 },
  { title: "Fashion Model", tag: "Fashion, Model", image: "/gallery/f1.jpg", width: 700, height: 1000 },
  { title: "Father & Son", tag: "Event", image: "/gallery/e1.jpg", width: 700, height: 850 },
];

const PortfolioSection = () => {
  const titleRef = useScrollReveal<HTMLHeadingElement>();

  return (
    <section id="portfolio" className="py-16 md:py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 ref={titleRef} className="font-recoleta text-4xl md:text-5xl font-light mb-8">
              Our Recent Work.
            </h2>

            {portfolioItems.slice(0, 2).map((item) => (
              <PortfolioCard key={item.title} {...item} />
            ))}
          </div>

          <div className="md:pt-20">
            {portfolioItems.slice(2).map((item) => (
              <PortfolioCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PortfolioCard = ({ title, tag, image, width, height }: typeof portfolioItems[0]) => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="relative group mb-8">
      <figure
        className="img-holder rounded-sm overflow-hidden relative"
        style={{ "--width": width, "--height": height } as React.CSSProperties}
      >
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent z-[1]" />
        <img
          src={image}
          width={width}
          height={height}
          loading="lazy"
          alt={title}
          className="img-cover transition-transform duration-500 group-hover:scale-105"
        />
      </figure>

      <div className="absolute bottom-0 left-0 p-6 z-[1]">
        <h3 className="font-recoleta text-2xl font-normal">
          <a href="#" className="hover:underline">{title}</a>
        </h3>
        <p className="text-foreground/70 text-sm">{tag}</p>
      </div>

      <a href="#" className="absolute top-0 right-0 w-[50px] h-[50px] bg-foreground rounded-bl-[25px] grid place-content-center z-[1]">
        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="20" viewBox="0 0 43 20" fill="none" className="-rotate-45">
          <path d="M0 10H41" stroke="hsl(0 0% 0%)" strokeWidth="2" />
          <path d="M33 1L41.9 10.2727L33 19" stroke="hsl(0 0% 0%)" strokeWidth="2" />
        </svg>
      </a>
    </div>
  );
};

export default PortfolioSection;
