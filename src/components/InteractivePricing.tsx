import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Sparkles, Camera, Video, Image, Palette } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LiquidButton from "@/components/ui/LiquidButton";

interface AddOn {
  id: string;
  name: string;
  price: number;
  icon: React.ElementType;
  description: string;
}

const packages = [
  {
    id: "essential",
    name: "Essential",
    description: "Perfect for personal shoots & portraits",
    basePrice: 5000,
    features: ["2 Hour Session", "50 Edited Photos", "Online Gallery", "1 Location"],
    color: "ocean-teal",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Ideal for events & celebrations",
    basePrice: 15000,
    features: ["Full Day Coverage", "200+ Edited Photos", "Highlight Reel", "3 Locations", "Drone Coverage"],
    color: "primary",
    popular: true,
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "The ultimate storytelling experience",
    basePrice: 35000,
    features: ["Multi-Day Coverage", "500+ Edited Photos", "Full Film Edit", "Unlimited Locations", "Drone + Crane", "Same-Day Edit"],
    color: "copper",
  },
];

const addOns: AddOn[] = [
  { id: "extra-hour", name: "Extra Hour", price: 2000, icon: Plus, description: "Add more shooting time" },
  { id: "album", name: "Photo Album", price: 5000, icon: Image, description: "Premium printed album" },
  { id: "raw", name: "RAW Files", price: 3000, icon: Camera, description: "Unedited original files" },
  { id: "teaser", name: "Teaser Video", price: 4000, icon: Video, description: "30s social media teaser" },
  { id: "retouch", name: "Pro Retouching", price: 3500, icon: Palette, description: "Advanced skin & color work" },
];

const InteractivePricing = () => {
  useScrollReveal();
  const [selectedPackage, setSelectedPackage] = useState("premium");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const total = useMemo(() => {
    const pkg = packages.find(p => p.id === selectedPackage);
    const addOnTotal = selectedAddOns.reduce((sum, id) => {
      const addon = addOns.find(a => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
    return (pkg?.basePrice || 0) + addOnTotal;
  }, [selectedPackage, selectedAddOns]);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-fantasy)" }} />
      <div className="container px-4 relative z-10">
        <div className="text-center mb-14 reveal-up">
          <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">Pricing</span>
          <h2 className="font-recoleta text-3xl md:text-5xl mb-3">Build Your <span className="text-gradient-primary">Package</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Choose a base package and customize with add-ons to create your perfect photography experience</p>
        </div>

        {/* Package Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-14">
          {packages.map((pkg, i) => {
            const isActive = selectedPackage === pkg.id;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative glass-card rounded-2xl p-6 cursor-pointer transition-all duration-500 float-organic ${
                  isActive
                    ? "border-primary/50 shadow-[0_20px_60px_hsl(346_85%_55%/0.25)] scale-[1.03]"
                    : "hover:border-foreground/10 hover:shadow-[0_20px_50px_hsl(193_75%_7%/0.5)]"
                }`}
                style={{ animationDelay: `${i * 1.5}s` }}
              >
                <div className="glass-surface rounded-2xl" aria-hidden />
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="relative inline-flex items-center gap-1 bg-gradient-to-r from-primary to-copper text-primary-foreground text-[10px] px-4 py-1 rounded-full font-medium uppercase tracking-wider shadow-[0_0_24px_hsl(346_85%_55%/0.6)]">
                      <Sparkles size={10} className="animate-pulse" /> Most Popular
                      <span className="absolute inset-0 rounded-full bg-primary/30 blur-md -z-10 animate-pulse" />
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-recoleta text-xl mb-1">{pkg.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="font-recoleta text-3xl">
                    ৳{pkg.basePrice.toLocaleString()}
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/70">
                      <Check size={14} className="text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className={`mt-6 text-center py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-primary text-primary-foreground" : "border border-foreground/10 text-foreground/60"
                }`}>
                  {isActive ? "Selected" : "Select Package"}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="max-w-3xl mx-auto reveal-up">
          <h3 className="font-recoleta text-xl text-center mb-6">Customize with Add-ons</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {addOns.map(addon => {
              const isSelected = selectedAddOns.includes(addon.id);
              const Icon = addon.icon;
              return (
                <motion.button
                  key={addon.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleAddOn(addon.id)}
                  className={`glass-card rounded-xl p-4 flex items-center gap-4 text-left transition-all duration-300 ${
                    isSelected ? "border-primary/40 bg-primary/5" : "hover:border-foreground/10"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{addon.name}</p>
                    <p className="text-xs text-muted-foreground">{addon.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">৳{addon.price.toLocaleString()}</p>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ml-auto transition-all ${
                      isSelected ? "border-primary bg-primary" : "border-foreground/20"
                    }`}>
                      {isSelected && <Check size={12} className="text-primary-foreground" />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Total & CTA */}
        <motion.div
          layout
          className="max-w-md mx-auto mt-10 glass-card-strong rounded-2xl p-6 text-center reveal-up"
        >
          <p className="text-sm text-muted-foreground mb-1">Your Custom Package</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={total}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="font-recoleta text-4xl text-gradient-primary mb-4"
            >
              ৳{total.toLocaleString()}
            </motion.div>
          </AnimatePresence>
          <LiquidButton to="/booking" variant="primary" size="lg" className="w-full">
            Book This Package
          </LiquidButton>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractivePricing;
