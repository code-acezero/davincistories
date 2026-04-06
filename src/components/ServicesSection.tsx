import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  { title: "Wedding Photography", subtitle: "Capturing timeless moments", image: "/images/service-1.jpg" },
  { title: "Event Organiser", subtitle: "Making events unforgettable", image: "/images/service-2.jpg" },
  { title: "Product Marketing", subtitle: "Elevating your brand visuals", image: "/images/service-3.jpg" },
  { title: "Videography", subtitle: "Transforming Moments into Cinematic Stories", image: "/images/service-4.jpg" },
];

const ServiceCard = ({ title, subtitle, image }: typeof services[0]) => {
  const ref = useScrollReveal<HTMLLIElement>();

  return (
    <li ref={ref}>
      <div className="container flex items-center gap-6 py-8 border-t border-foreground/10 group cursor-pointer">
        <img
          src={image}
          width={340}
          height={380}
          loading="lazy"
          alt={title}
          className="w-20 h-20 md:w-[100px] md:h-[100px] object-cover rounded-sm flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
        />

        <div className="flex-1">
          <h3 className="font-recoleta text-2xl md:text-4xl font-light group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-foreground/50 font-light">{subtitle}</p>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="20" viewBox="0 0 43 20" fill="none" className="flex-shrink-0 hidden md:block">
          <path d="M0 10H41" stroke="currentColor" strokeWidth="2" />
          <path d="M33 1L41.9 10.2727L33 19" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </li>
  );
};

const ServicesSection = () => {
  const titleRef = useScrollReveal<HTMLParagraphElement>();

  return (
    <section id="services" className="py-16 md:py-24">
      <p ref={titleRef} className="container text-foreground/25 text-xl uppercase tracking-[3.5px] mb-10">
        Our Services
      </p>

      <ul>
        {services.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </ul>
    </section>
  );
};

export default ServicesSection;
