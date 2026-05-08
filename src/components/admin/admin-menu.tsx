"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Soup,
  UtensilsCrossed,
  Star,
  Flame,
  Salad,
  Utensils,
  Loader2,
} from "lucide-react";

// Types
interface MenuCategory {
  id: string;
  title: string;
  slug: string;
  icon: string;
  order: number;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  weight: string | null;
  allergens: string | null;
  badge: string | null;
  isNew: boolean;
  order: number;
  active: boolean;
}

const ICON_OPTIONS = [
  { value: "Soup", label: "Soup", Icon: Soup },
  { value: "UtensilsCrossed", label: "UtensilsCrossed", Icon: UtensilsCrossed },
  { value: "Star", label: "Star", Icon: Star },
  { value: "Flame", label: "Flame", Icon: Flame },
  { value: "Salad", label: "Salad", Icon: Salad },
  { value: "Utensils", label: "Utensils", Icon: Utensils },
];

const BADGE_OPTIONS = [
  { value: "", label: "Žiadny" },
  { value: "Bestseller", label: "Bestseller" },
  { value: "Tip šéfkuchára", label: "Tip šéfkuchára" },
  { value: "Obľúbené", label: "Obľúbené" },
  { value: "Klasika", label: "Klasika" },
  { value: "Sezónne", label: "Sezónne" },
];

const BADGE_COLORS: Record<string, string> = {
  Bestseller: "bg-amber-gold text-white",
  "Tip šéfkuchára": "bg-emerald-600 text-white",
  "Obľúbené": "bg-rose-500 text-white",
  Klasika: "bg-slate-600 text-white",
  Sezónne: "bg-teal-500 text-white",
};

function getIconComponent(iconName: string) {
  const found = ICON_OPTIONS.find((o) => o.value === iconName);
  return found ? found.Icon : Utensils;
}

export function AdminMenu() {
  const token = useAdminStore((s) => s.token);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Category dialog state
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [catEditId, setCatEditId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ title: "", slug: "", icon: "Utensils", order: 0 });

  // Item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemEditId, setItemEditId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    allergens: "",
    badge: "",
    isNew: false,
    order: 0,
    active: true,
  });

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "category" | "item";
    id: string;
    name: string;
  }>({ open: false, type: "category", id: "", name: "" });

  const headers = {
    "Content-Type": "application/json",
    "x-admin-token": token || "",
  };

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/menu-categories", { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data);
      if (data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
    } catch {
      toast.error("Chyba pri načítavaní kategórií");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Category CRUD
  const openNewCategory = () => {
    setCatEditId(null);
    setCatForm({ title: "", slug: "", icon: "Utensils", order: categories.length });
    setCatDialogOpen(true);
  };

  const openEditCategory = (cat: MenuCategory) => {
    setCatEditId(cat.id);
    setCatForm({ title: cat.title, slug: cat.slug, icon: cat.icon, order: cat.order });
    setCatDialogOpen(true);
  };

  const saveCategory = async () => {
    if (!catForm.title || !catForm.slug) {
      toast.error("Názov a slug sú povinné");
      return;
    }
    try {
      const url = catEditId
        ? `/api/admin/menu-categories/${catEditId}`
        : "/api/admin/menu-categories";
      const method = catEditId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(catForm),
      });
      if (!res.ok) throw new Error();
      toast.success(catEditId ? "Kategória aktualizovaná" : "Kategória vytvorená");
      setCatDialogOpen(false);
      fetchCategories();
    } catch {
      toast.error("Chyba pri ukladaní kategórie");
    }
  };

  const deleteCategory = async () => {
    try {
      const res = await fetch(`/api/admin/menu-categories/${deleteDialog.id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      toast.success("Kategória odstránená");
      if (selectedCategoryId === deleteDialog.id) {
        setSelectedCategoryId(categories.find((c) => c.id !== deleteDialog.id)?.id || null);
      }
      fetchCategories();
    } catch {
      toast.error("Chyba pri odstraňovaní kategórie");
    }
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  // Item CRUD
  const openNewItem = () => {
    if (!selectedCategoryId) return;
    setItemEditId(null);
    const items = selectedCategory?.items || [];
    setItemForm({
      name: "",
      description: "",
      price: "",
      weight: "",
      allergens: "",
      badge: "",
      isNew: false,
      order: items.length,
      active: true,
    });
    setItemDialogOpen(true);
  };

  const openEditItem = (item: MenuItem) => {
    setItemEditId(item.id);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
      weight: item.weight || "",
      allergens: item.allergens || "",
      badge: item.badge || "",
      isNew: item.isNew,
      order: item.order,
      active: item.active,
    });
    setItemDialogOpen(true);
  };

  const saveItem = async () => {
    if (!selectedCategoryId || !itemForm.name || !itemForm.description || !itemForm.price) {
      toast.error("Názov, popis a cena sú povinné");
      return;
    }
    try {
      const payload = {
        ...itemForm,
        categoryId: selectedCategoryId,
        weight: itemForm.weight || null,
        allergens: itemForm.allergens || null,
        badge: itemForm.badge || null,
      };
      const url = itemEditId
        ? `/api/admin/menu-items/${itemEditId}`
        : "/api/admin/menu-items";
      const method = itemEditId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(itemEditId ? "Položka aktualizovaná" : "Položka vytvorená");
      setItemDialogOpen(false);
      fetchCategories();
    } catch {
      toast.error("Chyba pri ukladaní položky");
    }
  };

  const deleteItem = async () => {
    try {
      const res = await fetch(`/api/admin/menu-items/${deleteDialog.id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      toast.success("Položka odstránená");
      fetchCategories();
    } catch {
      toast.error("Chyba pri odstraňovaní položky");
    }
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-amber-gold" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warm-dark">Jedálny lístok</h1>
          <p className="text-sm text-muted-foreground">Správa kategórií a položiek menu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left panel - Categories */}
        <div className="lg:col-span-4 xl:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Kategórie</CardTitle>
                <Button size="sm" onClick={openNewCategory} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
                  <Plus className="w-4 h-4 mr-1" /> Pridať
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-3 text-center">Žiadne kategórie</p>
                ) : (
                  categories.map((cat) => {
                    const Icon = getIconComponent(cat.icon);
                    const isActive = selectedCategoryId === cat.id;
                    return (
                      <div
                        key={cat.id}
                        className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer group transition-colors ${
                          isActive
                            ? "bg-amber-gold/10 text-amber-gold"
                            : "hover:bg-muted text-foreground"
                        }`}
                        onClick={() => setSelectedCategoryId(cat.id)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium flex-1 truncate">{cat.title}</span>
                        <span className="text-xs text-muted-foreground mr-1">{cat.items.length}</span>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditCategory(cat);
                            }}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({
                                open: true,
                                type: "category",
                                id: cat.id,
                                name: cat.title,
                              });
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel - Items */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {selectedCategory ? selectedCategory.title : "Vyberte kategóriu"}
                </CardTitle>
                {selectedCategoryId && (
                  <Button size="sm" onClick={openNewItem} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
                    <Plus className="w-4 h-4 mr-1" /> Pridať položku
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedCategoryId ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Vyberte kategóriu zľava pre zobrazenie položiek
                </p>
              ) : !selectedCategory?.items.length ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Žiadne položky v tejto kategórii
                </p>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {selectedCategory.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{item.name}</span>
                          {item.badge && (
                            <Badge className={`text-[10px] px-1.5 py-0 h-5 ${BADGE_COLORS[item.badge] || "bg-gray-500"}`}>
                              {item.badge}
                            </Badge>
                          )}
                          {item.isNew && (
                            <Badge className="text-[10px] px-1.5 py-0 h-5 bg-green-500 text-white">
                              NOVÉ
                            </Badge>
                          )}
                          {!item.active && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                              Neaktívne
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="font-bold text-amber-gold">{item.price} €</span>
                          {item.weight && <span>{item.weight}</span>}
                          {item.allergens && <span>Alergény: {item.allergens}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditItem(item)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              type: "item",
                              id: item.id,
                              name: item.name,
                            })
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Dialog */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{catEditId ? "Upraviť kategóriu" : "Nová kategória"}</DialogTitle>
            <DialogDescription>
              {catEditId
                ? "Upravte údaje kategórie"
                : "Vyplňte údaje pre novú kategóriu"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Názov</Label>
              <Input
                value={catForm.title}
                onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                placeholder="Napr. Polievky"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={catForm.slug}
                onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                placeholder="napr. polievky"
              />
            </div>
            <div className="space-y-2">
              <Label>Ikona</Label>
              <Select
                value={catForm.icon}
                onValueChange={(v) => setCatForm({ ...catForm, icon: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => {
                    const Icon = opt.Icon;
                    return (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {opt.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Poradie</Label>
              <Input
                type="number"
                value={catForm.order}
                onChange={(e) => setCatForm({ ...catForm, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={saveCategory} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
              Uložiť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{itemEditId ? "Upraviť položku" : "Nová položka"}</DialogTitle>
            <DialogDescription>
              {itemEditId ? "Upravte údaje položky menu" : "Vyplňte údaje pre novú položku"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Názov *</Label>
              <Input
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                placeholder="Názov jedla"
              />
            </div>
            <div className="space-y-2">
              <Label>Popis *</Label>
              <Textarea
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Popis jedla"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cena *</Label>
                <Input
                  value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                  placeholder="9,90"
                />
              </div>
              <div className="space-y-2">
                <Label>Váha</Label>
                <Input
                  value={itemForm.weight}
                  onChange={(e) => setItemForm({ ...itemForm, weight: e.target.value })}
                  placeholder="200 g"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alergény</Label>
                <Input
                  value={itemForm.allergens}
                  onChange={(e) => setItemForm({ ...itemForm, allergens: e.target.value })}
                  placeholder="1, 3, 7"
                />
              </div>
              <div className="space-y-2">
                <Label>Odznak</Label>
                <Select
                  value={itemForm.badge}
                  onValueChange={(v) => setItemForm({ ...itemForm, badge: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte" />
                  </SelectTrigger>
                  <SelectContent>
                    {BADGE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value || "none"}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Poradie</Label>
                <Input
                  type="number"
                  value={itemForm.order}
                  onChange={(e) => setItemForm({ ...itemForm, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-3 pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNew"
                    checked={itemForm.isNew}
                    onCheckedChange={(c) => setItemForm({ ...itemForm, isNew: c === true })}
                  />
                  <Label htmlFor="isNew" className="text-sm">
                    Novinka
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={itemForm.active}
                    onCheckedChange={(c) => setItemForm({ ...itemForm, active: c === true })}
                  />
                  <Label htmlFor="active" className="text-sm">
                    Aktívne
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={saveItem} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
              Uložiť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdiť odstránenie</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete odstrániť{" "}
              {deleteDialog.type === "category" ? "kategóriu" : "položku"}{" "}
              <strong>{deleteDialog.name}</strong>?
              {deleteDialog.type === "category" &&
                " Táto akcia odstráni aj všetky položky v tejto kategórii."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteDialog.type === "category" ? deleteCategory : deleteItem}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Odstrániť
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
