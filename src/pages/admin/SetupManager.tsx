import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  Mail,
  Lock,
  KeyRound,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface BootstrapResult {
  ok: boolean;
  email?: string;
  userId?: string;
  created?: boolean;
  roleAssigned?: boolean;
  passwordReset?: boolean;
  forced?: boolean;
  error?: string;
}

interface CredsResult {
  ok: boolean;
  email?: string;
  password?: string;
  hasPassword?: boolean;
  error?: string;
}

const PROJECT_REF = "qmeoblfqighimfrcybcl";
const REDIRECT_URL = `${window.location.origin}/master`;

const Step = ({
  index,
  title,
  children,
  done,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
  done?: boolean;
}) => (
  <div className="glass-card rounded-2xl p-5 flex gap-4">
    <div
      className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
        done ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      }`}
    >
      {done ? <CheckCircle2 size={16} /> : index}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium mb-1">{title}</h3>
      <div className="text-sm text-muted-foreground space-y-2">{children}</div>
    </div>
  </div>
);

const CopyButton = ({ value, label }: { value: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast({ title: `${label || "Value"} copied` });
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 hover:bg-muted text-xs transition-colors"
      title="Copy"
    >
      <Copy size={12} /> {copied ? "Copied" : "Copy"}
    </button>
  );
};

const SetupManager = () => {
  const qc = useQueryClient();
  const [showPw, setShowPw] = useState(false);

  // Read cached bootstrap result, also re-run on mount to get fresh status
  const cached: BootstrapResult | null = (() => {
    try {
      const raw = sessionStorage.getItem("admin-bootstrap-result");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const { data: status, refetch: refetchStatus, isFetching: statusFetching } = useQuery({
    queryKey: ["bootstrap-status"],
    queryFn: async (): Promise<BootstrapResult> => {
      const { data, error } = await supabase.functions.invoke("bootstrap-admin");
      if (error) throw error;
      return data as BootstrapResult;
    },
    initialData: cached ?? undefined,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (status) sessionStorage.setItem("admin-bootstrap-result", JSON.stringify(status));
  }, [status]);

  const regenerate = useMutation({
    mutationFn: async (): Promise<BootstrapResult> => {
      const { data, error } = await supabase.functions.invoke("bootstrap-admin", {
        body: { force: true },
      });
      if (error) throw error;
      return data as BootstrapResult;
    },
    onSuccess: (data) => {
      sessionStorage.setItem("admin-bootstrap-result", JSON.stringify(data));
      qc.setQueryData(["bootstrap-status"], data);
      toast({
        title: "Bootstrap regenerated",
        description: data.passwordReset
          ? "Password was reset for the existing admin user."
          : data.created
            ? "Admin user was created."
            : "Admin already provisioned. Role re-checked.",
      });
    },
    onError: (e: Error) => toast({ title: "Regenerate failed", description: e.message, variant: "destructive" }),
  });

  const credsQuery = useMutation({
    mutationFn: async (): Promise<CredsResult> => {
      const { data, error } = await supabase.functions.invoke("admin-credentials");
      if (error) throw error;
      return data as CredsResult;
    },
    onError: (e: Error) => toast({ title: "Could not load credentials", description: e.message, variant: "destructive" }),
  });

  const creds = credsQuery.data;
  const hasRevealed = !!creds;

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-recoleta text-3xl">Setup &amp; OAuth</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Provision the bootstrap admin, configure Google OAuth, and securely access login credentials.
        </p>
      </header>

      {/* Status card */}
      <div className="glass-card-strong rounded-2xl p-5 flex flex-wrap items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
          {status?.ok ? (
            <CheckCircle2 className="w-5 h-5 text-primary" />
          ) : (
            <AlertCircle className="w-5 h-5 text-destructive" />
          )}
        </div>
        <div className="flex-1 min-w-[220px]">
          <p className="font-medium">
            {status?.ok ? "Admin account provisioned" : "Admin not yet provisioned"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {status?.ok ? (
              <>
                Email: <span className="text-foreground">{status.email}</span>
                {" · "}
                {status.created ? "newly created" : "already existed"}
                {status.passwordReset ? " · password reset" : ""}
              </>
            ) : (
              status?.error || "Click 'Regenerate bootstrap' to provision now."
            )}
          </p>
        </div>
        <button
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          className="liquid-btn-ghost text-sm px-4 py-2 rounded-xl inline-flex items-center gap-2"
        >
          {regenerate.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Regenerate bootstrap
        </button>
        <button
          onClick={() => refetchStatus()}
          disabled={statusFetching}
          className="text-xs text-muted-foreground hover:text-foreground"
          title="Re-check status"
        >
          {statusFetching ? "Checking…" : "Re-check"}
        </button>
      </div>

      {/* Credentials card */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-copper/15 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5 text-copper" />
          </div>
          <div>
            <h2 className="font-medium">Admin login credentials</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Stored as Supabase secrets. Visible only to admins. Treat the password like a vault key.
            </p>
          </div>
        </div>

        {!hasRevealed ? (
          <button
            onClick={() => credsQuery.mutate()}
            disabled={credsQuery.isPending}
            className="liquid-btn text-primary-foreground text-sm px-4 py-2 rounded-xl inline-flex items-center gap-2"
          >
            {credsQuery.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Reveal credentials
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <code className="text-sm flex-1 break-all">{creds?.email}</code>
              <CopyButton value={creds?.email || ""} label="Email" />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
              <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
              <code className="text-sm flex-1 break-all font-mono">
                {creds?.hasPassword
                  ? showPw
                    ? creds.password
                    : "•".repeat(Math.min(16, (creds.password || "").length || 12))
                  : <span className="italic text-muted-foreground">No password configured</span>}
              </code>
              {creds?.hasPassword && (
                <>
                  <button
                    onClick={() => setShowPw(!showPw)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title={showPw ? "Hide" : "Show"}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <CopyButton value={creds.password || ""} label="Password" />
                </>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground/70 flex items-start gap-1.5">
              <AlertCircle size={12} className="mt-0.5 shrink-0" />
              The password is fetched on demand and never stored in the page after refresh. Reload to re-mask.
            </p>
          </div>
        )}
      </div>

      {/* Google OAuth setup steps */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-recoleta text-xl">Google OAuth setup</h2>
          <a
            href={`https://supabase.com/dashboard/project/${PROJECT_REF}/auth/providers`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Open Supabase providers <ExternalLink size={12} />
          </a>
        </div>

        <Step index={1} title="Create OAuth client in Google Cloud Console">
          <p>
            Go to <a className="text-primary hover:underline" target="_blank" rel="noreferrer" href="https://console.cloud.google.com/apis/credentials">Google Cloud Console → Credentials</a>, click <strong>Create credentials → OAuth client ID</strong>, choose <strong>Web application</strong>.
          </p>
        </Step>

        <Step index={2} title="Add authorized JavaScript origins">
          <p>Add your site origins so Google trusts the sign-in button.</p>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
            <code className="text-xs flex-1 break-all">{window.location.origin}</code>
            <CopyButton value={window.location.origin} label="Origin" />
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
            <code className="text-xs flex-1 break-all">https://davincistories.lovable.app</code>
            <CopyButton value="https://davincistories.lovable.app" label="Production origin" />
          </div>
        </Step>

        <Step index={3} title="Add authorized redirect URI (Supabase callback)">
          <p>Use the Supabase callback URL — not your /master path. Supabase handles the round-trip.</p>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
            <code className="text-xs flex-1 break-all">https://{PROJECT_REF}.supabase.co/auth/v1/callback</code>
            <CopyButton value={`https://${PROJECT_REF}.supabase.co/auth/v1/callback`} label="Callback URL" />
          </div>
        </Step>

        <Step index={4} title="Paste Client ID + Secret into Supabase">
          <p>
            Open <a className="text-primary hover:underline" target="_blank" rel="noreferrer" href={`https://supabase.com/dashboard/project/${PROJECT_REF}/auth/providers`}>Supabase → Auth → Providers → Google</a>, toggle it on, paste the Client ID and Client Secret, save.
          </p>
        </Step>

        <Step index={5} title="Configure Site URL & Redirect URLs in Supabase">
          <p>
            In <a className="text-primary hover:underline" target="_blank" rel="noreferrer" href={`https://supabase.com/dashboard/project/${PROJECT_REF}/auth/url-configuration`}>Auth → URL Configuration</a> add the post-login redirect target:
          </p>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
            <code className="text-xs flex-1 break-all">{REDIRECT_URL}</code>
            <CopyButton value={REDIRECT_URL} label="Redirect URL" />
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
            <code className="text-xs flex-1 break-all">https://davincistories.lovable.app/master</code>
            <CopyButton value="https://davincistories.lovable.app/master" label="Production redirect" />
          </div>
        </Step>

        <Step index={6} title="Test the sign-in" done={false}>
          <p>Sign out, then sign in via Google. You should land on /master with admin access.</p>
          <a
            href="/auth?redirect=%2Fmaster"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-1"
          >
            Open sign-in page <ChevronRight size={14} />
          </a>
        </Step>
      </section>

      {/* Helpful links */}
      <div className="grid sm:grid-cols-2 gap-3">
        <a
          href={`https://supabase.com/dashboard/project/${PROJECT_REF}/functions/bootstrap-admin/logs`}
          target="_blank" rel="noreferrer"
          className="glass-card rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
        >
          <div>
            <p className="text-sm font-medium">bootstrap-admin logs</p>
            <p className="text-xs text-muted-foreground">Debug provisioning issues</p>
          </div>
          <ExternalLink size={14} className="text-muted-foreground" />
        </a>
        <a
          href={`https://supabase.com/dashboard/project/${PROJECT_REF}/auth/users`}
          target="_blank" rel="noreferrer"
          className="glass-card rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
        >
          <div>
            <p className="text-sm font-medium">Auth users</p>
            <p className="text-xs text-muted-foreground">Verify the admin account exists</p>
          </div>
          <ExternalLink size={14} className="text-muted-foreground" />
        </a>
      </div>
    </div>
  );
};

export default SetupManager;
