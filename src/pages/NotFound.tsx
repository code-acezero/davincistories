import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <Helmet>
        <title>404 — Page Not Found | DaVinci Stories</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to the DaVinci Stories homepage." />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
        <div className="orb w-[300px] h-[300px] bg-primary/20 top-[20%] left-[30%]" />
        <div className="text-center relative z-10">
          <h1 className="font-recoleta text-8xl text-primary mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Oops! This page doesn't exist</p>
          <Link to="/" className="bg-primary text-primary-foreground rounded-xl px-8 py-3 font-medium btn-glow inline-block hover:scale-105 transition-transform">
            Return Home
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
