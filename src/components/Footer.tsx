import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import { Gear, BotanicalCorner, InkDivider, CompassRose } from "@/components/ornaments/Ornaments";

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings", "footer"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .in("key", ["contact_email", "contact_phone", "contact_address"]);
      const map: Record<string, string> = {};
      data?.forEach((s) => {
        const v = s.value;
        map[s.key] = typeof v === "string" ? v : JSON.stringify(v).replace(/^"|"$/g, "");
      });
      return map;
    },
  });

  return (
    <footer id="contact" className="relative pt-24 pb-10 mt-16 overflow-hidden">
      {/* layered paper edge transition */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, hsl(34 30% 76% / 0.65) 30%, hsl(28 28% 60% / 0.85) 100%)",
        }}
      />
      {/* botanical edges */}
      <BotanicalCorner className="absolute top-6 left-2 opacity-50" size={120} color="hsl(145 28% 22%)" />
      <BotanicalCorner className="absolute top-6 right-2 opacity-50" size={120} flip color="hsl(145 28% 22%)" />

      {/* rotating gear watermark */}
      <Gear size={70} teeth={14} spin="slow" className="absolute bottom-10 right-12 opacity-25 hidden md:block" />
      <Gear size={50} teeth={10} spin="slow" reverse className="absolute bottom-24 right-24 opacity-20 hidden md:block" />

      <div className="container px-4 relative z-10">
        <InkDivider className="max-w-2xl mx-auto mb-12" glyph="⚙" />

        <div className="grid md:grid-cols-3 gap-12 mb-14">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="DaVinci" className="w-10 h-10" style={{ filter: "sepia(0.3)" }} />
              <span className="calligraphy text-3xl leading-none">DaVinci Stories</span>
            </Link>
            <p className="text-[hsl(var(--ink-soft))] text-sm italic font-serif leading-relaxed">
              An atelier of photographers & storytellers, capturing fleeting light and lasting memory.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <CompassRose size={36} className="opacity-70" />
              <span className="stamped-label">Khoksa · Kushtia · BD</span>
            </div>
          </div>

          <div>
            <h4 className="section-eyebrow mb-4">— Pages —</h4>
            <ul className="space-y-2 text-base font-serif">
              {["Gallery", "Services", "Blog", "Booking", "Contact"].map((l) => (
                <li key={l}>
                  <Link
                    to={`/${l.toLowerCase()}`}
                    className="text-[hsl(var(--ink-soft))] hover:text-[hsl(var(--burgundy))] transition-colors italic"
                  >
                    ❦ {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="section-eyebrow mb-4">— Correspondence —</h4>
            <address className="not-italic text-[hsl(var(--ink-soft))] text-base space-y-2 font-serif">
              <p>{settings?.contact_address || "Khoksa, Kushtia, Khulna, Bangladesh"}</p>
              <p>
                <a
                  href={`tel:${settings?.contact_phone || "+8801603327099"}`}
                  className="hover:text-[hsl(var(--burgundy))] transition-colors"
                >
                  {settings?.contact_phone || "+8801603327099"}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${settings?.contact_email || "davincistories@gmail.com"}`}
                  className="hover:text-[hsl(var(--burgundy))] transition-colors"
                >
                  {settings?.contact_email || "davincistories@gmail.com"}
                </a>
              </p>
            </address>
          </div>
        </div>

        <InkDivider className="max-w-3xl mx-auto mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[hsl(var(--ink-soft))]/80">
          <p className="flex items-center gap-2 italic font-serif">
            Crafted with <Heart size={12} className="text-[hsl(var(--burgundy))] fill-[hsl(var(--burgundy))]" /> by DaVinci Stories
          </p>
          <p className="stamped-label">© {new Date().getFullYear()} · All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
