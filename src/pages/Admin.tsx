import { useState } from "react";
import { useProperties } from "@/context/PropertyContext";
import { Property } from "@/data/properties";
import { formatPrice } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, LogOut, Home, LayoutDashboard, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const ADMIN_PASSWORD = "admin123";

type PropertyForm = Omit<Property, "id">;

const emptyForm: PropertyForm = {
  title: "",
  type: "villa",
  zone: "Midoun",
  price: 0,
  surface: 0,
  bedrooms: undefined,
  description: "",
  features: [],
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
          <img src={logo} alt="Immo Rêve Djerba" className="h-16 w-16 mx-auto mb-2 object-contain" />
          <CardTitle className="font-heading text-xl">Espace Admin</CardTitle>
          <p className="text-sm text-muted-foreground">Immo Rêve Djerba</p>
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
              />
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

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setForm(initial || emptyForm);
      setFeaturesText((initial?.features || []).join(", "));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.surface) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
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
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Property["type"] })}>
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
              <Select value={form.zone} onValueChange={(v) => setForm({ ...form, zone: v as Property["zone"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Midoun">Midoun</SelectItem>
                  <SelectItem value="Houmt Souk">Houmt Souk</SelectItem>
                  <SelectItem value="Ajim">Ajim</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Supprimer "${title}" ?`)) {
      deleteProperty(id);
      toast({ title: "Supprimé", description: `"${title}" a été supprimé.` });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Immo Rêve Djerba" className="h-8 w-8 object-contain" />
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
        {/* Stats */}
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

        {/* Properties Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg">Gestion des biens</CardTitle>
            <PropertyFormDialog
              onSave={(form) => {
                addProperty(form);
                toast({ title: "Ajouté", description: `"${form.title}" a été ajouté.` });
              }}
              trigger={
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Ajouter un bien
                </Button>
              }
            />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="capitalize">{p.type}</TableCell>
                      <TableCell>{p.zone}</TableCell>
                      <TableCell>{formatPrice(p.price)}</TableCell>
                      <TableCell>{p.surface} m²</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <PropertyFormDialog
                            initial={{ title: p.title, type: p.type, zone: p.zone, price: p.price, surface: p.surface, bedrooms: p.bedrooms, description: p.description, features: p.features }}
                            onSave={(form) => {
                              updateProperty(p.id, form);
                              toast({ title: "Modifié", description: `"${form.title}" a été mis à jour.` });
                            }}
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            }
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
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
