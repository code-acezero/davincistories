import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Team", href: "/#team" },
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Contact us", href: "/#contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[4] transition-all duration-500 ${
          isScrolled ? "bg-eerie-black py-3 shadow-lg" : "py-[18px]"
        }`}
      >
        <div className="container flex items-center justify-between">
          <Link to="/" className="block">
            <img src="/images/logo.png" width={40} height={40} alt="DaVinci home" />
          </Link>

          <button
            className="block"
            aria-label="open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <img src="/images/menu.svg" width={17} height={17} alt="menu" />
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav
        className={`fixed top-0 right-0 h-screen max-w-[280px] w-full bg-eerie-black p-6 z-[5] overflow-y-auto transition-all duration-500 ${
          isMenuOpen ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <Link to="/">
            <img src="/images/nav-logo.png" width={130} height={40} alt="DaVinci" />
          </Link>
          <button onClick={() => setIsMenuOpen(false)} aria-label="close menu" className="w-6 h-6 flex flex-col justify-center items-center gap-0">
            <span className="block w-6 h-[3px] bg-foreground/80 rounded rotate-45 translate-y-[1.5px] transition-colors hover:bg-primary" />
            <span className="block w-6 h-[3px] bg-foreground/80 rounded -rotate-45 -translate-y-[1.5px] transition-colors hover:bg-primary" />
          </button>
        </div>

        <ul className="text-center space-y-1 pb-10">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.href.startsWith("/#") ? (
                <Link
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block text-xl font-normal py-[2px] capitalize transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  to={link.href}
                  className="block text-xl font-normal py-[2px] capitalize transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <p className="text-lg font-medium mb-4">My Address</p>
        <address className="text-foreground/75 font-light leading-relaxed mb-4">
          Khoksa, Kushtia, Khulna, Bangladesh
        </address>
        <p className="text-foreground/75 font-light leading-relaxed mb-4">
          Urgent issue? call us at{" "}
          <a href="tel:+8801603327099" className="text-primary hover:underline text-[1.375rem]">
            +8801603327099
          </a>
        </p>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-background z-[2] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-75 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Header;
