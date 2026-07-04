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

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const ok = await verifyAdminToken(req.headers.get("x-admin-token"));
  if (!ok) return json({ error: "Non autorisé" }, 401);

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return json({ error: "Fichier manquant" }, 400);
    if (!file.type.startsWith("image/")) return json({ error: "Type non autorisé" }, 400);
    if (file.size > MAX_BYTES) return json({ error: "Fichier trop volumineux (max 10MB)" }, 400);

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error: upErr } = await admin.storage
      .from("property-images")
      .upload(path, bytes, { contentType: file.type, cacheControl: "3600", upsert: false });
    if (upErr) {
      console.error("storage upload error:", upErr);
      return json({ error: "Téléversement impossible" }, 400);
    }

    const { data } = admin.storage.from("property-images").getPublicUrl(path);
    return json({ url: data.publicUrl, path });
  } catch (e) {
    console.error("admin-upload-image error:", e);
    return json({ error: "Erreur serveur" }, 500);
  }
});
