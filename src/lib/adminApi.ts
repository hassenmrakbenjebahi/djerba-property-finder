import { supabase } from "@/integrations/supabase/client";

const ADMIN_TOKEN_KEY = "admin-token";

export const adminAuth = {
  setToken: (token: string) => sessionStorage.setItem(ADMIN_TOKEN_KEY, token),
  getToken: () => sessionStorage.getItem(ADMIN_TOKEN_KEY) || "",
  clear: () => sessionStorage.removeItem(ADMIN_TOKEN_KEY),
  isAuthenticated: () => !!sessionStorage.getItem(ADMIN_TOKEN_KEY),
};

async function invoke<T = any>(fn: string, body: any): Promise<T> {
  const headers: Record<string, string> = {
    "x-admin-token": adminAuth.getToken(),
  };
  const { data, error } = await supabase.functions.invoke(fn, { body, headers });
  if (error) {
    const ctx: any = (error as any).context;
    let msg = "Erreur";
    try {
      const text = await ctx?.text?.();
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed?.error) msg = parsed.error;
      }
    } catch { /* ignore */ }
    // If token invalid/expired, clear it so UI reverts to login
    if (ctx?.status === 401) adminAuth.clear();
    throw new Error(msg);
  }
  if ((data as any)?.error) throw new Error((data as any).error);
  return data as T;
}

export const adminApi = {
  login: async (password: string): Promise<{ ok: boolean; token?: string; error?: string }> => {
    const { data, error } = await supabase.functions.invoke("admin-auth", {
      body: { action: "login", password },
    });
    if (error) {
      const ctx: any = (error as any).context;
      let msg = "Mot de passe incorrect";
      try {
        const text = await ctx?.text?.();
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed?.error) msg = parsed.error;
        }
      } catch { /* ignore */ }
      return { ok: false, error: msg };
    }
    const payload = data as any;
    if (payload?.ok && payload?.token) {
      adminAuth.setToken(payload.token);
      return { ok: true, token: payload.token };
    }
    return { ok: false, error: payload?.error || "Mot de passe incorrect" };
  },

  changePassword: async (
    oldPassword: string,
    newPassword: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.functions.invoke("admin-auth", {
      body: { action: "change_password", old_password: oldPassword, new_password: newPassword },
    });
    if (error) {
      const ctx: any = (error as any).context;
      let msg = "Échec";
      try {
        const text = await ctx?.text?.();
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed?.error) msg = parsed.error;
        }
      } catch { /* ignore */ }
      return { ok: false, error: msg };
    }
    const payload = data as any;
    if (payload?.ok) {
      if (payload.token) adminAuth.setToken(payload.token);
      return { ok: true };
    }
    return { ok: false, error: payload?.error || "Échec" };
  },

  createProperty: (property: any) => invoke("admin-properties", { action: "create", property }),
  updateProperty: (id: string, property: any) => invoke("admin-properties", { action: "update", id, property }),
  deleteProperty: (id: string) => invoke("admin-properties", { action: "delete", id }),

  uploadImage: async (file: File): Promise<{ url: string; path: string }> => {
    const fd = new FormData();
    fd.append("file", file);
    const { data, error } = await supabase.functions.invoke("admin-upload-image", {
      body: fd,
      headers: { "x-admin-token": adminAuth.getToken() },
    });
    if (error) {
      const ctx: any = (error as any).context;
      if (ctx?.status === 401) adminAuth.clear();
      let msg = "Téléversement impossible";
      try {
        const text = await ctx?.text?.();
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed?.error) msg = parsed.error;
        }
      } catch { /* ignore */ }
      throw new Error(msg);
    }
    if ((data as any)?.error) throw new Error((data as any).error);
    return data as { url: string; path: string };
  },
};
