import { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import { AnimatePresence } from "framer-motion";

// Lazy loaded pages
const Index = lazy(() => import("@/pages/Index"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Contact = lazy(() => import("@/pages/Contact"));
const Booking = lazy(() => import("@/pages/Booking"));
const Auth = lazy(() => import("@/pages/Auth"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Admin pages
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminTeam = lazy(() => import("@/pages/admin/TeamManager"));
const AdminGallery = lazy(() => import("@/pages/admin/GalleryManager"));
const AdminServices = lazy(() => import("@/pages/admin/ServicesManager"));
const AdminPortfolio = lazy(() => import("@/pages/admin/PortfolioManager"));
const AdminBlog = lazy(() => import("@/pages/admin/BlogManager"));
const AdminBookings = lazy(() => import("@/pages/admin/BookingsManager"));
const AdminMessages = lazy(() => import("@/pages/admin/MessagesManager"));
const AdminSettings = lazy(() => import("@/pages/admin/SettingsManager"));
const AdminUsers = lazy(() => import("@/pages/admin/UsersManager"));
const AdminHero = lazy(() => import("@/pages/admin/HeroManager"));
const AdminCategories = lazy(() => import("@/pages/admin/CategoriesManager"));
const AdminMedia = lazy(() => import("@/pages/admin/MediaManager"));
const AdminMusic = lazy(() => import("@/pages/admin/MusicManager"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />} key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/auth" element={<Auth />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="music" element={<AdminMusic />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  const [hasEntered, setHasEntered] = useState(() => {
    return sessionStorage.getItem("davinci-entered") === "true";
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <CustomCursor />
            {!hasEntered && (
              <LoadingScreen onComplete={() => setHasEntered(true)} />
            )}
            {hasEntered && (
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            )}
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
