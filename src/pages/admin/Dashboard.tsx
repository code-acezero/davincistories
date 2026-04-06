import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Image, FileText, CalendarDays, MessageSquare, Camera } from "lucide-react";

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => (
  <div className="glass-card rounded-2xl p-6">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="w-6 h-6 text-primary" /></div>
      <div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [team, gallery, services, portfolio, posts, bookings, messages] = await Promise.all([
        supabase.from("team_members").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("portfolio_items").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      ]);
      return { team: team.count ?? 0, gallery: gallery.count ?? 0, services: services.count ?? 0, portfolio: portfolio.count ?? 0, posts: posts.count ?? 0, bookings: bookings.count ?? 0, messages: messages.count ?? 0 };
    },
  });

  return (
    <div>
      <h1 className="font-recoleta text-3xl mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Team Members" value={counts?.team ?? 0} />
        <StatCard icon={Image} label="Gallery Images" value={counts?.gallery ?? 0} />
        <StatCard icon={Camera} label="Portfolio Items" value={counts?.portfolio ?? 0} />
        <StatCard icon={FileText} label="Blog Posts" value={counts?.posts ?? 0} />
        <StatCard icon={CalendarDays} label="Bookings" value={counts?.bookings ?? 0} />
        <StatCard icon={MessageSquare} label="Messages" value={counts?.messages ?? 0} />
      </div>
    </div>
  );
};

export default Dashboard;
