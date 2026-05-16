import { useState } from "react";
import { useProperties, Property, formatPrice } from "@/context/PropertyContext";
import type { TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, LogOut, Home, LayoutDashboard, Building, Image, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const ADMIN_PASSWORD = "admin123";

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

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
    }
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
              <Input id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} placeholder="Entrez le mot de passe" />
              {error && <p className="text-destructive text-xs mt-1">Mot de passe incorrect</p>}
            </div>
            <Button type="submit" className="w-full">Se connecter</Button>
          </form>
        </CardContent>
      </Card>
    </div>
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
  const [newImage, setNewImage] = useState("");

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setForm(initial || emptyForm);
      setFeaturesText((initial?.features || []).join(", "));
      setNewImage("");
    }
  };

  const addImage = () => {
    const url = newImage.trim();
    if (!url) return;
    if (form.images.length >= 10) {
      toast({ title: "Limite atteinte", description: "10 images maximum par bien.", variant: "destructive" });
      return;
    }
    setForm({ ...form, images: [...form.images, url] });
    setNewImage("");
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
              <Select value={form.zone} onValueChange={(v) => setForm({ ...form, zone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Midoun">Midoun</SelectItem>
                  <SelectItem value="Houmt Souk">Houmt Souk</SelectItem>
                  <SelectItem value="Ajim">Ajim</SelectItem>
                </SelectContent>
              </Select>
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
          <div>
            <Label>Images (max 10) — la 1ère est l'image de couverture</Label>
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                placeholder="https://..."
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addImage} disabled={form.images.length >= 10}>
                <Plus className="w-4 h-4 mr-1" /> Ajouter
              </Button>
            </div>
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
