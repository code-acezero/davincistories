import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AppRole = "admin" | "moderator" | "member";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  isAdmin: boolean;
  isModerator: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  roles: [],
  isAdmin: false,
  isModerator: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);

  const loadRoles = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    setRoles(((data ?? []).map((r: any) => r.role)) as AppRole[]);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => loadRoles(session.user.id), 0);
          // Audit log: sign-in events (deduped per session id)
          if (event === "SIGNED_IN") {
            const key = `audit-logged-${session.access_token.slice(-12)}`;
            if (!sessionStorage.getItem(key)) {
              sessionStorage.setItem(key, "1");
              const provider = session.user.app_metadata?.provider || "email";
              const isOAuth = provider !== "email";
              setTimeout(() => {
                supabase.from("audit_log").insert({
                  event_type: isOAuth ? "auth.oauth_success" : "auth.login",
                  actor_id: session.user.id,
                  actor_email: session.user.email,
                  metadata: { provider },
                }).then(() => {});
              }, 100);
            }
          }
        } else {
          setRoles([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRoles(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadRoles]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
  }, []);

  const isAdmin = roles.includes("admin");
  const isModerator = roles.includes("moderator");

  return (
    <AuthContext.Provider value={{ user, session, loading, roles, isAdmin, isModerator, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
