import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Shield } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Booking", href: "/booking" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[40] transition-all duration-500 ${isScrolled ? "py-2" : "py-4"}`}>
        <div className="container">
          <nav className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${isScrolled ? "glass-card-strong shadow-lg" : "glass-card"}`}>
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/images/logo.png" width={36} height={36} alt="DaVinci" className="group-hover:scale-110 transition-transform" />
              <span className="font-recoleta text-lg hidden sm:block">DaVinci</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group ${
                      active ? "text-primary" : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {/* Glass nav slide effect */}
                    <span className="relative z-10">{link.label}</span>
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-primary/10 rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    {/* Hover glow dot */}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />
                  </Link>
                );
              })}
            </div>

            {/* Auth + Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="hidden lg:flex items-center gap-2">
                  {isAdmin && (
                    <Link to="/admin" className="text-xs bg-primary/10 text-primary rounded-lg px-3 py-1.5 flex items-center gap-1 hover:bg-primary/20 transition-colors">
                      <Shield size={12} /> Admin
                    </Link>
                  )}
                  <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors p-2">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="hidden lg:flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors">
                  <User size={16} /> Sign In
                </Link>
              )}
              <button className="lg:hidden p-2" aria-label="menu" onClick={() => setIsMenuOpen(true)}>
                <Menu size={20} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 z-[45]" onClick={() => setIsMenuOpen(false)} />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-screen w-[280px] glass-card-strong z-[50] p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <Link to="/" className="flex items-center gap-2">
                  <img src="/images/logo.png" width={32} height={32} alt="DaVinci" />
                  <span className="font-recoleta">DaVinci</span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="p-1"><X size={20} /></button>
              </div>

              <ul className="space-y-1 mb-8">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={`block px-4 py-3 rounded-xl text-lg transition-all ${
                        location.pathname === link.href ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted/30"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border pt-6 space-y-3">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 text-sm text-primary px-4 py-2">
                        <Shield size={16} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 hover:text-foreground">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" className="flex items-center gap-2 text-sm text-foreground/70 px-4 py-2 hover:text-primary">
                    <User size={16} /> Sign In
                  </Link>
                )}
              </div>

              <div className="mt-8 px-4">
                <p className="text-xs text-muted-foreground">Khoksa, Kushtia, Bangladesh</p>
                <a href="tel:+8801603327099" className="text-primary text-sm hover:underline">+8801603327099</a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
