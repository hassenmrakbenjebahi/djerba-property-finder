import { supabase } from "@/integrations/supabase/client";

const ADMIN_PWD_KEY = "admin-pwd";

export const adminAuth = {
  setPassword: (pwd: string) => sessionStorage.setItem(ADMIN_PWD_KEY, pwd),
  getPassword: () => sessionStorage.getItem(ADMIN_PWD_KEY) || "",
  clear: () => sessionStorage.removeItem(ADMIN_PWD_KEY),
};

async function invoke<T = any>(fn: string, body: any, isFormData = false): Promise<T> {
  const headers: Record<string, string> = {
    "x-admin-password": adminAuth.getPassword(),
  };
  const { data, error } = await supabase.functions.invoke(fn, {
    body,
    headers,
  });
  if (error) {
    // Try to extract server error message
    const ctx: any = (error as any).context;
    let msg = error.message;
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
  return data as T;
}

export const adminApi = {
  login: (password: string) =>
    supabase.functions.invoke("admin-auth", {
      body: { action: "login", password },
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    supabase.functions.invoke("admin-auth", {
      body: { action: "change_password", old_password: oldPassword, new_password: newPassword },
    }),

  createProperty: (property: any) => invoke("admin-properties", { action: "create", property }),
  updateProperty: (id: string, property: any) => invoke("admin-properties", { action: "update", id, property }),
  deleteProperty: (id: string) => invoke("admin-properties", { action: "delete", id }),

  uploadImage: async (file: File): Promise<{ url: string; path: string }> => {
    const fd = new FormData();
    fd.append("file", file);
    return invoke("admin-upload-image", fd, true);
  },
};
