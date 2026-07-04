import { createClient } from "npm:@supabase/supabase-js@2";
import { issueAdminToken } from "../_shared/adminToken.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const MIN_PWD_LEN = 12;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "login") {
      const password = String(body.password ?? "");
      if (!password) return json({ ok: false, error: "Mot de passe requis" }, 400);

      const { data, error } = await admin.rpc("verify_admin_password", { _password: password });
      if (error) {
        console.error("verify_admin_password RPC error:", error);
        return json({ ok: false, error: "Mot de passe incorrect" }, 401);
      }
      if (!data) return json({ ok: false, error: "Mot de passe incorrect" }, 401);

      const token = await issueAdminToken();
      return json({ ok: true, token });
    }

    if (action === "change_password") {
      const oldPassword = String(body.old_password ?? "");
      const newPassword = String(body.new_password ?? "");
      if (newPassword.length < MIN_PWD_LEN) {
        return json({ ok: false, error: `Minimum ${MIN_PWD_LEN} caractères` }, 400);
      }
      const { data, error } = await admin.rpc("change_admin_password", {
        _old_password: oldPassword,
        _new_password: newPassword,
      });
      if (error || !data) {
        console.error("change_admin_password error:", error);
        // Only surface known-safe message for wrong current password
        const msg = error?.message?.includes("actuel") ? "Mot de passe actuel incorrect" : "Échec du changement";
        return json({ ok: false, error: msg }, 400);
      }
      const token = await issueAdminToken();
      return json({ ok: true, token });
    }

    return json({ ok: false, error: "Action inconnue" }, 400);
  } catch (e) {
    console.error("admin-auth error:", e);
    return json({ ok: false, error: "Erreur serveur" }, 500);
  }
});
