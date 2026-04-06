import useScrollReveal from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CategoriesSection = () => {
  useScrollReveal();
  const { data: categories } = useQuery({
    queryKey: ["category-items"],
    queryFn: async () => { const { data } = await supabase.from("category_items").select("*").eq("is_visible", true).order("display_order"); return data ?? []; },
  });
  if (!categories || categories.length === 0) return null;
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4">
        <div className="text-center mb-12 reveal-up">
          <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">What We Do</span>
          <h2 className="font-recoleta text-3xl md:text-4xl">Our <span className="text-gradient-warm">Categories</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <div key={cat.id} className="reveal-up group" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="glass-card rounded-2xl overflow-hidden relative aspect-square">
                {cat.image_url && <img src={cat.image_url} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4"><p className="font-recoleta text-lg">{cat.title}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CategoriesSection;
