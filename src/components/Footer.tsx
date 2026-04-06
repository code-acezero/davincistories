import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings", "footer"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").in("key", ["contact_email", "contact_phone", "contact_address"]);
      const map: Record<string, string> = {};
      data?.forEach((s) => { const v = s.value; map[s.key] = typeof v === "string" ? v : JSON.stringify(v).replace(/^"|"$/g, ""); });
      return map;
    },
  });

  return (
    <footer id="contact" className="relative pt-20 pb-8">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-card to-background" />
      <div className="container px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4"><img src="/images/logo.png" alt="DaVinci" className="w-10 h-10" /><span className="font-recoleta text-xl">DaVinci Stories</span></Link>
            <p className="text-foreground/60 text-sm">A creative photography and videography team turning imaginations into reality.</p>
          </div>
          <div>
            <h4 className="font-recoleta text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Gallery", "Services", "Blog", "Booking", "Contact"].map(l => <li key={l}><Link to={`/${l.toLowerCase()}`} className="text-foreground/60 hover:text-primary transition-colors">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-recoleta text-lg mb-4">Contact</h4>
            <address className="not-italic text-foreground/60 text-sm space-y-2">
              <p>{settings?.contact_address || "Khoksa, Kushtia, Khulna, Bangladesh"}</p>
              <p><a href={`tel:${settings?.contact_phone || "+8801603327099"}`} className="hover:text-primary transition-colors">{settings?.contact_phone || "+8801603327099"}</a></p>
              <p><a href={`mailto:${settings?.contact_email || "davincistories@gmail.com"}`} className="hover:text-primary transition-colors">{settings?.contact_email || "davincistories@gmail.com"}</a></p>
            </address>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/40">
          <p className="flex items-center gap-1">Made with <Heart size={12} className="text-primary" /> by DaVinci Stories</p>
          <p>&copy; {new Date().getFullYear()} DaVinci Stories. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
