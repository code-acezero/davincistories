import { useScrollReveal } from "@/hooks/useScrollReveal";

const Footer = () => {
  const titleRef = useScrollReveal<HTMLParagraphElement>();
  const headingRef = useScrollReveal<HTMLHeadingElement>();

  return (
    <footer>
      <div id="contact" className="py-20 md:py-32 relative overflow-hidden">
        <div className="container text-center relative z-[1]">
          <p ref={titleRef} className="text-foreground/25 text-xl uppercase tracking-[3.5px] mb-6">
            Contact Us
          </p>

          <h2 ref={headingRef} className="font-recoleta text-3xl md:text-5xl font-light max-w-3xl mx-auto mb-8">
            Got a Project? Ready to Hire Us? Drop Us a Message!
          </h2>

          <a
            href="https://wa.me/8801603327099"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-[60px] h-[60px] bg-foreground rounded-full items-center justify-center mx-auto hover:bg-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="20" viewBox="0 0 43 20" fill="none">
              <path d="M0 10H41" stroke="hsl(0 0% 0%)" strokeWidth="2" />
              <path d="M33 1L41.9 10.2727L33 19" stroke="hsl(0 0% 0%)" strokeWidth="2" />
            </svg>
          </a>
        </div>

        {/* Decorative images */}
        <img src="/gallery/p1.jpg" width={159} height={176} loading="lazy" alt="" className="absolute top-10 left-5 w-20 md:w-40 rounded-sm hidden md:block opacity-80" />
        <img src="/gallery/f3.jpg" width={265} height={275} loading="lazy" alt="" className="absolute top-20 right-5 w-24 md:w-64 rounded-sm hidden md:block opacity-80" />
        <img src="/gallery/f2.jpg" width={303} height={272} loading="lazy" alt="" className="absolute bottom-10 left-10 w-28 md:w-72 rounded-sm hidden lg:block opacity-80" />
        <img src="/gallery/f11.jpg" width={175} height={175} loading="lazy" alt="" className="absolute bottom-20 right-20 w-20 md:w-44 rounded-sm hidden lg:block opacity-80" />
      </div>

      <div className="border-t border-foreground/10 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="/">
            <img src="/images/logo-1.png" width={80} height={80} loading="lazy" alt="DaVinci" />
          </a>

          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/davincistories.team"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-primary transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/azimkhan.acezero/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-primary transition-colors"
            >
              Instagram
            </a>
          </div>

          <p className="text-foreground/50 text-sm">
            © {new Date().getFullYear()} DaVinci Stories. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
