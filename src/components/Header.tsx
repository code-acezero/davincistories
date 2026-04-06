import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Shield, ChevronDown } from "lucide-react";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[40] transition-all duration-500 ${isScrolled ? "py-2" : "py-3 md:py-4"}`}>
        <div className="container">
          <nav className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-2.5 transition-all duration-500 ${isScrolled ? "glass-card-strong shadow-lg" : "glass-card"}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/images/logo.png" width={32} height={32} alt="DaVinci" className="group-hover:scale-110 transition-transform duration-300" />
              <span className="font-recoleta text-base hidden sm:block group-hover:text-primary transition-colors">DaVinci</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`relative px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 group ${
                      active ? "text-primary" : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-primary/10 rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    {/* Hover underline effect */}
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-primary rounded-full transition-all duration-300 group-hover:w-4" />
                  </Link>
                );
              })}
            </div>

            {/* Right side: Profile / Auth */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card hover:border-primary/30 transition-all duration-300 text-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 glass-card-strong rounded-xl p-2 shadow-xl"
                      >
                        <div className="px-3 py-2 border-b border-border mb-1">
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/10 text-primary transition-colors">
                            <Shield size={14} /> Admin Panel
                          </Link>
                        )}
                        <Link to="/booking" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 text-foreground/70 transition-colors">
                          My Bookings
                        </Link>
                        <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors w-full text-left">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/auth" className="hidden lg:flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors px-3 py-1.5 rounded-xl glass-card hover:border-primary/30">
                  <User size={14} /> Sign In
                </Link>
              )}
              <button className="lg:hidden p-2 rounded-lg hover:bg-muted/30 transition-colors" aria-label="menu" onClick={() => setIsMenuOpen(true)}>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[45]" onClick={() => setIsMenuOpen(false)} />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-screen w-[300px] glass-card-strong z-[50] p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center gap-2">
                  <img src="/images/logo.png" width={28} height={28} alt="DaVinci" />
                  <span className="font-recoleta">DaVinci</span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-muted/30 transition-colors"><X size={18} /></button>
              </div>

              <ul className="space-y-1 mb-6">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      className={`block px-4 py-3 rounded-xl text-lg transition-all ${
                        location.pathname === link.href ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground hover:bg-muted/20"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="border-t border-border pt-4 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <p className="text-sm text-muted-foreground truncate flex-1">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 text-sm text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors">
                        <Shield size={14} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 hover:text-foreground rounded-lg hover:bg-muted/20 transition-colors w-full text-left">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" className="flex items-center gap-2 text-sm text-foreground/60 px-4 py-2 hover:text-primary rounded-lg hover:bg-muted/20 transition-colors">
                    <User size={14} /> Sign In
                  </Link>
                )}
              </div>

              <div className="mt-6 px-4">
                <p className="text-xs text-muted-foreground/60">Khoksa, Kushtia, Bangladesh</p>
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
