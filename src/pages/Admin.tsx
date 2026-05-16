import { useState } from "react";
import { useProperties, Property, formatPrice } from "@/context/PropertyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, LogOut, Home, LayoutDashboard, Building, Image, X, Upload, Loader2, KeyRound, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

type PropertyForm = {
  title: string;
  type: string;
  zone: string;
  listing_type: "sale" | "rent";
  price: number;
  surface: number;
  bedrooms?: number;
  description: string;
  features: string[];
  images: string[];
  available_from?: string;
};

const emptyForm: PropertyForm = {
  title: "",
  type: "villa",
  zone: "Midoun",
  listing_type: "sale",
  price: 0,
  surface: 0,
  bedrooms: undefined,
  description: "",
  features: [],
  images: [],
  available_from: "",
};

const DJERBA_ZONES = [
  "El Mey", "Houmt Souk", "Midoun", "Ajim", "Sedouikech", "Cedghiane",
  "Mellita", "Aghir", "Mezraya", "Sidi Mahrez", "Sidi Jmour", "Guellala",
  "Erriadh", "Mahboubine", "Hara Kebira", "Hara Sghira", "Zone Touristique",
];

const ZoneCombobox = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const filtered = DJERBA_ZONES.filter((z) =>
    z.toLowerCase().includes(value.toLowerCase())
  );
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Choisir ou écrire une zone"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-56 overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md">
          {filtered.map((z) => (
            <li
              key={z}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onMouseDown={(e) => { e.preventDefault(); onChange(z); setOpen(false); }}
            >
              {z}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError(false);
    const { data, error: rpcError } = await supabase.rpc("verify_admin_password", { _password: password });
    setLoading(false);
    if (rpcError || !data) {
      setError(true);
      return;
    }
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <img src={logo} alt="El Mey Djerba Immo" className="h-16 w-16 mx-auto mb-2 object-contain" />
          <CardTitle className="font-heading text-xl">Espace Admin</CardTitle>
          <p className="text-sm text-muted-foreground">El Mey Djerba Immo</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Entrez le mot de passe"
                autoComplete="current-password"
              />
              {error && <p className="text-destructive text-xs mt-1">Mot de passe incorrect</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileDialog = () => {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "Mot de passe trop court", description: "Minimum 6 caractères.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.rpc("change_admin_password", {
      _old_password: oldPassword,
      _new_password: newPassword,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Mot de passe mis à jour", description: "Votre nouveau mot de passe est actif." });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <User className="w-4 h-4 mr-1" /> Profil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <KeyRound className="w-4 h-4" /> Changer le mot de passe
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="old-password">Mot de passe actuel</Label>
            <Input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PropertyFormDialog = ({
  initial,
  onSave,
  trigger,
}: {
  initial?: PropertyForm;
  onSave: (form: PropertyForm) => void;
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PropertyForm>(initial || emptyForm);
  const [featuresText, setFeaturesText] = useState((initial?.features || []).join(", "));
  const [uploading, setUploading] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setForm(initial || emptyForm);
      setFeaturesText((initial?.features || []).join(", "));
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = 10 - form.images.length;
    if (remaining <= 0) {
      toast({ title: "Limite atteinte", description: "10 images maximum par bien.", variant: "destructive" });
      return;
    }
    const list = Array.from(files).slice(0, remaining);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of list) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("property-images").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) throw error;
        const { data } = supabase.storage.from("property-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
      toast({ title: "Upload réussi", description: `${uploaded.length} image(s) ajoutée(s).` });
    } catch (e: any) {
      toast({ title: "Erreur upload", description: e.message || "Échec de l'upload.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) => {
    setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.surface) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }
    if (form.listing_type === "rent" && !form.available_from) {
      toast({ title: "Date manquante", description: "Indiquez la date de début de disponibilité pour une location.", variant: "destructive" });
      return;
    }
    onSave({ ...form, features: featuresText.split(",").map((f) => f.trim()).filter(Boolean) });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">{initial ? "Modifier le bien" : "Ajouter un bien"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Titre *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                  <SelectItem value="maison">Maison</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Zone *</Label>
              <ZoneCombobox value={form.zone} onChange={(v) => setForm({ ...form, zone: v })} />
            </div>
          </div>
          <div>
            <Label>Transaction *</Label>
            <Select value={form.listing_type} onValueChange={(v) => setForm({ ...form, listing_type: v as "sale" | "rent" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">À vendre</SelectItem>
                <SelectItem value="rent">À louer (prix / mois)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Prix (TND) *</Label>
              <Input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Surface (m²) *</Label>
              <Input type="number" value={form.surface || ""} onChange={(e) => setForm({ ...form, surface: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Chambres</Label>
              <Input type="number" value={form.bedrooms || ""} onChange={(e) => setForm({ ...form, bedrooms: e.target.value ? Number(e.target.value) : undefined })} />
            </div>
          </div>
          {form.listing_type === "rent" && (
            <div>
              <Label>Date de début de disponibilité *</Label>
              <Input
                type="date"
                value={form.available_from || ""}
                onChange={(e) => setForm({ ...form, available_from: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">À partir de quand le bien est disponible à la location.</p>
            </div>
          )}
          <div>
            <Label>Images (max 10) — la 1ère est l'image de couverture</Label>
            <label className="mt-1 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted/40 transition">
              {uploading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Upload en cours...</>
              ) : (
                <><Upload className="w-4 h-4" /> <span className="text-sm">Choisir des images depuis votre appareil</span></>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading || form.images.length >= 10}
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
              />
            </label>
            {form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {form.images.map((src, i) => (
                  <div key={src + i} className="relative group">
                    <img src={src} alt="" className="w-full h-20 object-cover rounded-lg border border-border" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        Couverture
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">{form.images.length}/10 images</p>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div>
            <Label>Caractéristiques (séparées par des virgules)</Label>
            <Input value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Piscine, Vue mer, Jardin" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit">{initial ? "Enregistrer" : "Ajouter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const { properties, addProperty, updateProperty, deleteProperty } = useProperties();
  const navigate = useNavigate();

  const stats = {
    total: properties.length,
    villas: properties.filter((p) => p.type === "villa").length,
    appartements: properties.filter((p) => p.type === "appartement").length,
    terrains: properties.filter((p) => p.type === "terrain").length,
  };

  const handleAdd = async (form: PropertyForm) => {
    try {
      await addProperty({
        title: form.title,
        type: form.type,
        zone: form.zone,
        listing_type: form.listing_type,
        price: form.price,
        surface: form.surface,
        bedrooms: form.bedrooms || null,
        description: form.description,
        features: form.features,
        images: form.images,
        image_url: form.images[0] || null,
        available_from: form.listing_type === "rent" && form.available_from ? form.available_from : null,
      });
      toast({ title: "Ajouté", description: `"${form.title}" a été ajouté.` });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'ajouter le bien.", variant: "destructive" });
    }
  };

  const handleUpdate = async (id: string, form: PropertyForm) => {
    try {
      await updateProperty(id, {
        title: form.title,
        type: form.type,
        zone: form.zone,
        listing_type: form.listing_type,
        price: form.price,
        surface: form.surface,
        bedrooms: form.bedrooms || null,
        description: form.description,
        features: form.features,
        images: form.images,
        image_url: form.images[0] || null,
        available_from: form.listing_type === "rent" && form.available_from ? form.available_from : null,
      });
      toast({ title: "Modifié", description: `"${form.title}" a été mis à jour.` });
    } catch {
      toast({ title: "Erreur", description: "Impossible de modifier le bien.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Supprimer "${title}" ?`)) {
      try {
        await deleteProperty(id);
        toast({ title: "Supprimé", description: `"${title}" a été supprimé.` });
      } catch {
        toast({ title: "Erreur", description: "Impossible de supprimer.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="El Mey Djerba Immo" className="h-8 w-8 object-contain" />
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="font-heading font-semibold text-foreground">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ProfileDialog />
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-1" /> Voir le site
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total biens", value: stats.total, icon: Building },
            { label: "Villas", value: stats.villas, icon: Home },
            { label: "Appartements", value: stats.appartements, icon: Building },
            { label: "Terrains", value: stats.terrains, icon: Building },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg">Gestion des biens</CardTitle>
            <PropertyFormDialog
              onSave={handleAdd}
              trigger={<Button size="sm"><Plus className="w-4 h-4 mr-1" /> Ajouter un bien</Button>}
            />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Surface</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          {(p.images?.[0] || p.image_url) ? (
                            <img src={p.images?.[0] || p.image_url || ""} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="capitalize">{p.type}</TableCell>
                      <TableCell>{p.zone}</TableCell>
                      <TableCell>{formatPrice(p.price)}</TableCell>
                      <TableCell>{p.surface} m²</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <PropertyFormDialog
                            initial={{
                              title: p.title,
                              type: p.type,
                              zone: p.zone,
                              listing_type: (p.listing_type === "rent" ? "rent" : "sale"),
                              price: p.price,
                              surface: p.surface,
                              bedrooms: p.bedrooms ?? undefined,
                              description: p.description,
                              features: p.features,
                              images: (p.images && p.images.length > 0) ? p.images : (p.image_url ? [p.image_url] : []),
                              available_from: p.available_from ?? "",
                            }}
                            onSave={(form) => handleUpdate(p.id, form)}
                            trigger={<Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-3.5 h-3.5" /></Button>}
                          />
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id, p.title)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {properties.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Aucun bien. Cliquez sur "Ajouter un bien" pour commencer.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("admin-auth") === "true");

  const handleLogin = () => {
    sessionStorage.setItem("admin-auth", "true");
    setAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin-auth");
    setAuthenticated(false);
  };

  if (!authenticated) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
