import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Image, Camera, Briefcase, FileText, CalendarDays, MessageSquare, Settings, Layers, Palette, FolderOpen, LogOut, Menu, X, Music } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Hero Slides", icon: Layers, path: "/admin/hero" },
  { label: "Team", icon: Users, path: "/admin/team" },
  { label: "Gallery", icon: Image, path: "/admin/gallery" },
  { label: "Categories", icon: Palette, path: "/admin/categories" },
  { label: "Services", icon: Briefcase, path: "/admin/services" },
  { label: "Portfolio", icon: Camera, path: "/admin/portfolio" },
  { label: "Blog", icon: FileText, path: "/admin/blog" },
  { label: "Bookings", icon: CalendarDays, path: "/admin/bookings" },
  { label: "Messages", icon: MessageSquare, path: "/admin/messages" },
  { label: "Music", icon: Music, path: "/admin/music" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Media", icon: FolderOpen, path: "/admin/media" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminLayout = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-center"><h1 className="font-recoleta text-2xl mb-2">Access Denied</h1><p className="text-muted-foreground">You need admin privileges.</p><Link to="/" className="text-primary hover:underline mt-4 inline-block">Go Home</Link></div></div>;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 glass-card p-2 rounded-xl">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass-card-strong border-r border-border z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="DaVinci" className="w-8 h-8" />
            <span className="font-recoleta text-lg">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 text-sm transition-all ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={signOut} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-background/80 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:pl-0">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
