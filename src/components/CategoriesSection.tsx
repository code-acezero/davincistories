import { useScrollReveal } from "@/hooks/useScrollReveal";

const categories = [
  { title: "Nature", image: "/images/category-1.jpg" },
  { title: "Model", image: "/gallery/f4.jpg" },
  { title: "Street", image: "/images/category-3.jpg" },
  { title: "Product", image: "/images/category-4.jpg" },
  { title: "Fashion", image: "/gallery/f3.jpg" },
  { title: "Film", image: "/images/category-5.jpg" },
  { title: "Architecture", image: "/images/category-6.jpg" },
  { title: "Event", image: "/gallery/e2.jpg" },
  { title: "Wedding", image: "/gallery/w3.jpg" },
  { title: "People", image: "/gallery/p4.jpg" },
  { title: "Food", image: "/images/category-10.jpg" },
  { title: "Couple", image: "/gallery/w1.jpg" },
];

const CategoryCard = ({ title, image }: { title: string; image: string }) => {
  const ref = useScrollReveal<HTMLLIElement>();

  return (
    <li ref={ref}>
      <a href="#" className="group block">
        <h3 className="font-recoleta text-2xl font-light mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <figure
          className="img-holder rounded-sm overflow-hidden"
          style={{ "--width": 600, "--height": 690 } as React.CSSProperties}
        >
          <img
            src={image}
            width={600}
            height={690}
            loading="lazy"
            alt={title}
            className="img-cover transition-transform duration-500 group-hover:scale-110"
          />
        </figure>
      </a>
    </li>
  );
};

const CategoriesSection = () => {
  const titleRef = useScrollReveal<HTMLParagraphElement>();

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <p ref={titleRef} className="text-foreground/25 text-xl uppercase tracking-[3.5px] mb-10">
          Categories
        </p>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CategoriesSection;
