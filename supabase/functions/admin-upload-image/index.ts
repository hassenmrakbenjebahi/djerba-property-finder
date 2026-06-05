import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function verifyAdmin(req: Request): Promise<boolean> {
  const password = req.headers.get("x-admin-password");
  if (!password) return false;
  const { data, error } = await admin.rpc("verify_admin_password", { _password: password });
  return !error && data === true;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const ok = await verifyAdmin(req);
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
    if (upErr) return json({ error: upErr.message }, 400);

    const { data } = admin.storage.from("property-images").getPublicUrl(path);
    return json({ url: data.publicUrl, path });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
