// Bootstrap the first admin account. Idempotent: safe to call repeatedly.
// Creates auth user (if missing) for codeacezero@gmail.com and assigns admin role.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const ADMIN_EMAIL = Deno.env.get("ADMIN_BOOTSTRAP_EMAIL") || "codeacezero@gmail.com";
const ADMIN_PASSWORD = Deno.env.get("ADMIN_BOOTSTRAP_PASSWORD") || "Mdazimkhan@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Optional regenerate flag (?force=1 or { force: true } body)
    const url = new URL(req.url);
    let force = url.searchParams.get("force") === "1" || url.searchParams.get("force") === "true";
    if (!force && req.method === "POST") {
      try {
        const body = await req.clone().json();
        if (body?.force === true) force = true;
      } catch { /* no body */ }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Find or create the user
    let userId: string | null = null;

    // Try create — if already exists we'll catch and look up
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Admin" },
    });

    if (created?.user) {
      userId = created.user.id;
    } else if (createErr && /registered|exists|duplicate/i.test(createErr.message)) {
      // Look up existing user by listing (paginate up to a few pages)
      let page = 1;
      while (page <= 5 && !userId) {
        const { data: list } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        const found = list?.users?.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
        if (found) userId = found.id;
        if (!list?.users || list.users.length < 200) break;
        page++;
      }
    } else if (createErr) {
      throw createErr;
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ ok: false, error: "Could not resolve admin user id" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2. Ensure admin role exists in user_roles (unique on user_id+role per schema)
    const { data: existingRole } = await admin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    let roleAssigned = false;
    if (!existingRole) {
      const { error: roleErr } = await admin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (roleErr && !/duplicate|unique/i.test(roleErr.message)) throw roleErr;
      roleAssigned = true;
    }

    // 3. If forcing regenerate, reset password + confirm email for existing user
    let passwordReset = false;
    if (force && !created?.user) {
      const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (updErr) throw updErr;
      passwordReset = true;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        email: ADMIN_EMAIL,
        userId,
        created: !!created?.user,
        roleAssigned,
        passwordReset,
        forced: force,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("bootstrap-admin error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
