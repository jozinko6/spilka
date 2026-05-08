"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  label: string | null;
  order: number;
  active: boolean;
}

export function AdminGallery() {
  const token = useAdminStore((s) => s.token);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    src: "",
    alt: "",
    label: "",
    order: 0,
    active: true,
  });

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const headers = {
    "Content-Type": "application/json",
    "x-admin-token": token || "",
  };

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/gallery", { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages(data);
    } catch {
      toast.error("Chyba pri načítavaní galérie");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const openNew = () => {
    setEditId(null);
    setForm({
      src: "",
      alt: "",
      label: "",
      order: images.length,
      active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (image: GalleryImage) => {
    setEditId(image.id);
    setForm({
      src: image.src,
      alt: image.alt,
      label: image.label || "",
      order: image.order,
      active: image.active,
    });
    setDialogOpen(true);
  };

  const saveImage = async () => {
    if (!form.src || !form.alt) {
      toast.error("Zdroj obrázka a alt text sú povinné");
      return;
    }
    try {
      const payload = {
        src: form.src,
        alt: form.alt,
        label: form.label || null,
        order: form.order,
        active: form.active,
      };

      if (editId) {
        const res = await fetch(`/api/admin/gallery/${editId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success("Obrázok aktualizovaný");
      } else {
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success("Obrázok vytvorený");
      }
      setDialogOpen(false);
      fetchImages();
    } catch {
      toast.error("Chyba pri ukladaní obrázka");
    }
  };

  const deleteImage = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/gallery/${deleteId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      toast.success("Obrázok odstránený");
      fetchImages();
    } catch {
      toast.error("Chyba pri odstraňovaní obrázka");
    }
    setDeleteId(null);
  };

  const toggleActive = async (image: GalleryImage) => {
    try {
      const res = await fetch(`/api/admin/gallery/${image.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ active: !image.active }),
      });
      if (!res.ok) throw new Error();
      toast.success(image.active ? "Obrázok deaktivovaný" : "Obrázok aktivovaný");
      fetchImages();
    } catch {
      toast.error("Chyba pri zmene stavu");
    }
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
          <h1 className="text-2xl font-bold text-warm-dark">Galéria</h1>
          <p className="text-sm text-muted-foreground">Správa obrázkov v galérii</p>
        </div>
        <Button onClick={openNew} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
          <Plus className="w-4 h-4 mr-1" /> Pridať obrázok
        </Button>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Žiadne obrázky v galérii</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden group">
              <div className="relative aspect-[4/3] bg-muted">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "";
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {!image.active && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge variant="secondary" className="text-xs">Neaktívne</Badge>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => openEdit(image)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => toggleActive(image)}
                  >
                    {image.active ? "−" : "+"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      setDeleteId(image.id);
                      setDeleteName(image.alt);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    {image.label && (
                      <p className="text-sm font-medium truncate">{image.label}</p>
                    )}
                    <p className="text-xs text-muted-foreground truncate">{image.alt}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] ml-2 flex-shrink-0">
                    #{image.order}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Upraviť obrázok" : "Nový obrázok"}</DialogTitle>
            <DialogDescription>
              {editId ? "Upravte údaje obrázka" : "Vyplňte údaje pre nový obrázok"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Zdroj (URL alebo cesta) *</Label>
              <Input
                value={form.src}
                onChange={(e) => setForm({ ...form, src: e.target.value })}
                placeholder="/images/moj-obrazok.jpg"
              />
            </div>
            {form.src && (
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <img
                  src={form.src}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Alt text *</Label>
              <Input
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="Popis obrázka pre prístupnosť"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Popisok</Label>
                <Input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="napr. Interiér"
                />
              </div>
              <div className="space-y-2">
                <Label>Poradie</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="imageActive"
                checked={form.active}
                onCheckedChange={(c) => setForm({ ...form, active: c === true })}
              />
              <Label htmlFor="imageActive" className="text-sm">
                Aktívny
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={saveImage} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
              Uložiť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdiť odstránenie</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete odstrániť obrázok <strong>{deleteName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteImage}
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
