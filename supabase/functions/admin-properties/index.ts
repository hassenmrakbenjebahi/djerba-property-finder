import { createClient } from "npm:@supabase/supabase-js@2";
import { verifyAdminToken } from "../_shared/adminToken.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const ok = await verifyAdminToken(req.headers.get("x-admin-token"));
  if (!ok) return json({ error: "Non autorisé" }, 401);

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "create") {
      const { data, error } = await admin.from("properties").insert(body.property).select().single();
      if (error) {
        console.error("properties.insert error:", error);
        return json({ error: "Création impossible (données invalides)" }, 400);
      }
      return json({ data });
    }

    if (action === "update") {
      const { id, property } = body;
      if (!id) return json({ error: "id requis" }, 400);
      const { data, error } = await admin.from("properties").update(property).eq("id", id).select().single();
      if (error) {
        console.error("properties.update error:", error);
        return json({ error: "Mise à jour impossible (données invalides)" }, 400);
      }
      return json({ data });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) return json({ error: "id requis" }, 400);
      const { error } = await admin.from("properties").delete().eq("id", id);
      if (error) {
        console.error("properties.delete error:", error);
        return json({ error: "Suppression impossible" }, 400);
      }
      return json({ ok: true });
    }

    return json({ error: "Action inconnue" }, 400);
  } catch (e) {
    console.error("admin-properties error:", e);
    return json({ error: "Erreur serveur" }, 500);
  }
});
