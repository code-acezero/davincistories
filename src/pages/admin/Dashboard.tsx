import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Users, Image, FileText, CalendarDays, MessageSquare, Camera, Layers, Palette, Briefcase, FolderOpen, Settings, Music, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const StatCard = ({ icon: Icon, label, value, to }: { icon: any; label: string; value: number; to: string }) => (
  <Link to={to} className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="w-6 h-6 text-primary" /></div>
      <div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div>
    </div>
  </Link>
);

const QuickAction = ({ icon: Icon, label, description, to }: { icon: any; label: string; description: string; to: string }) => (
  <Link to={to} className="glass-card rounded-2xl p-5 group hover:bg-primary/5 transition-all border border-transparent hover:border-primary/30">
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">{label}</p>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();

  const bootstrap = (() => {
    try {
      const raw = sessionStorage.getItem("admin-bootstrap-result");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [team, gallery, services, portfolio, posts, bookings, messages, hero, media] = await Promise.all([
        supabase.from("team_members").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("portfolio_items").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("hero_slides").select("id", { count: "exact", head: true }),
        supabase.from("category_items").select("id", { count: "exact", head: true }),
      ]);
      return {
        team: team.count ?? 0, gallery: gallery.count ?? 0, services: services.count ?? 0,
        portfolio: portfolio.count ?? 0, posts: posts.count ?? 0, bookings: bookings.count ?? 0,
        messages: messages.count ?? 0, hero: hero.count ?? 0, media: media.count ?? 0,
      };
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-recoleta text-3xl">Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}</h1>
        <p className="text-muted-foreground mt-1">Manage every part of DaVinci Stories from one place.</p>
      </div>

      {/* Setup status */}
      <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center gap-4 border border-primary/20">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-[220px]">
          <p className="font-medium flex items-center gap-2">
            Admin account
            {bootstrap?.ok && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {bootstrap?.ok
              ? <>Provisioned for <span className="text-foreground">{bootstrap.email}</span>{bootstrap.created ? " (newly created)" : " (already existed)"}.</>
              : "Auto-provisioning admin on startup…"}
          </p>
        </div>
        <Link
          to="/master/setup"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          Open setup &amp; OAuth wizard →
        </Link>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-recoleta text-xl mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction icon={Layers} label="Pages & Hero" description="Edit landing hero slides and headlines." to="/master/hero" />
          <QuickAction icon={Image} label="Galleries" description="Upload, organize and reorder gallery images." to="/master/gallery" />
          <QuickAction icon={FileText} label="Blog Posts" description="Write, publish and manage blog articles." to="/master/blog" />
          <QuickAction icon={FolderOpen} label="Media Library" description="Manage uploaded photos, videos and assets." to="/master/media" />
          <QuickAction icon={Briefcase} label="Services & Pricing" description="Update service offerings and packages." to="/master/services" />
          <QuickAction icon={Settings} label="Site Settings" description="Brand, SEO, contact and global settings." to="/master/settings" />
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="font-recoleta text-xl mb-4">Overview</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Layers} label="Hero Slides" value={counts?.hero ?? 0} to="/master/hero" />
          <StatCard icon={Image} label="Gallery Images" value={counts?.gallery ?? 0} to="/master/gallery" />
          <StatCard icon={Palette} label="Categories" value={counts?.media ?? 0} to="/master/categories" />
          <StatCard icon={Camera} label="Portfolio Items" value={counts?.portfolio ?? 0} to="/master/portfolio" />
          <StatCard icon={Users} label="Team Members" value={counts?.team ?? 0} to="/master/team" />
          <StatCard icon={Briefcase} label="Services" value={counts?.services ?? 0} to="/master/services" />
          <StatCard icon={FileText} label="Blog Posts" value={counts?.posts ?? 0} to="/master/blog" />
          <StatCard icon={CalendarDays} label="Bookings" value={counts?.bookings ?? 0} to="/master/bookings" />
          <StatCard icon={MessageSquare} label="Messages" value={counts?.messages ?? 0} to="/master/messages" />
          <StatCard icon={Music} label="Music Tracks" value={0} to="/master/music" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
