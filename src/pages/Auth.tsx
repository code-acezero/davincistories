import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { safeRedirect, safeOAuthRedirectURL } from "@/lib/safeRedirect";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/master";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!" });
        navigate(redirectTo);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "Check your email to verify your account." });
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirectTo}` },
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{isLogin ? "Sign In" : "Sign Up"} — DaVinci Stories</title>
        <meta name="description" content="Sign in or create an account at DaVinci Stories to book sessions and manage your profile." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="orb w-[300px] h-[300px] bg-primary/20 top-[10%] left-[20%]" />
        <div className="orb w-[200px] h-[200px] bg-secondary/30 bottom-[20%] right-[20%]" style={{ animationDelay: "-5s" }} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card-strong rounded-3xl p-8 md:p-10 w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <img src="/images/logo.svg" alt="DaVinci Stories" className="w-12 h-12 mx-auto mb-4" />
            <h1 className="font-recoleta text-2xl">{isLogin ? "Welcome Back" : "Join DaVinci"}</h1>
            <p className="text-muted-foreground text-sm mt-1">{isLogin ? "Sign in to your account" : "Create your account"}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none" required />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-10 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none" required minLength={6} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium btn-glow disabled:opacity-50">
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>
          <button onClick={handleGoogleLogin} className="w-full glass-card rounded-lg py-3 font-medium flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">{isLogin ? "Sign Up" : "Sign In"}</button>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Auth;
