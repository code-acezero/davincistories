import { useScrollReveal } from "@/hooks/useScrollReveal";
import BeforeAfterSlider from "./BeforeAfterSlider";

const examples = [
  {
    before: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=60&auto=format",
    after: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=90&auto=format&sat=-100",
    beforeLabel: "Edited",
    afterLabel: "Original",
  },
];

const BeforeAfterShowcase = () => {
  useScrollReveal();

  return (
    <section className="py-20 md:py-28">
      <div className="container px-4">
        <div className="text-center mb-12 reveal-up">
          <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">Editing</span>
          <h2 className="font-recoleta text-3xl md:text-4xl">Before & <span className="text-gradient-warm">After</span></h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Drag the slider to see the transformation — our editing brings out the magic in every frame</p>
        </div>
        <div className="max-w-3xl mx-auto reveal-up">
          {examples.map((ex, i) => (
            <BeforeAfterSlider
              key={i}
              before={ex.before}
              after={ex.after}
              beforeLabel={ex.beforeLabel}
              afterLabel={ex.afterLabel}
              className="aspect-[16/9]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterShowcase;
