"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Loader2, Soup, UtensilsCrossed, Sparkles } from "lucide-react";

interface DailyMenuEntry {
  id: string;
  dayOfWeek: number;
  soup: string;
  soupAllergens: string | null;
  main1: string;
  main1Allergens: string | null;
  main2: string;
  main2Allergens: string | null;
  special: string | null;
  specialAllergens: string | null;
  active: boolean;
}

const DAY_NAMES: Record<number, string> = {
  1: "Pondelok",
  2: "Utorok",
  3: "Streda",
  4: "Štvrtok",
  5: "Piatok",
};

const DAY_COLORS: Record<number, string> = {
  1: "from-amber-500/10 to-amber-600/5",
  2: "from-emerald-500/10 to-emerald-600/5",
  3: "from-sky-500/10 to-sky-600/5",
  4: "from-violet-500/10 to-violet-600/5",
  5: "from-rose-500/10 to-rose-600/5",
};

export function AdminDailyMenu() {
  const token = useAdminStore((s) => s.token);
  const [dailyMenus, setDailyMenus] = useState<DailyMenuEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDay, setEditDay] = useState<number>(1);
  const [form, setForm] = useState({
    soup: "",
    soupAllergens: "",
    main1: "",
    main1Allergens: "",
    main2: "",
    main2Allergens: "",
    special: "",
    specialAllergens: "",
  });

  const headers = {
    "Content-Type": "application/json",
    "x-admin-token": token || "",
  };

  const fetchDailyMenus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/daily-menu", { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDailyMenus(data);
    } catch {
      toast.error("Chyba pri načítavaní denného menu");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDailyMenus();
  }, [fetchDailyMenus]);

  const openEdit = (menu: DailyMenuEntry) => {
    setEditId(menu.id);
    setEditDay(menu.dayOfWeek);
    setForm({
      soup: menu.soup,
      soupAllergens: menu.soupAllergens || "",
      main1: menu.main1,
      main1Allergens: menu.main1Allergens || "",
      main2: menu.main2,
      main2Allergens: menu.main2Allergens || "",
      special: menu.special || "",
      specialAllergens: menu.specialAllergens || "",
    });
    setEditDialogOpen(true);
  };

  const openCreate = (dayOfWeek: number) => {
    setEditId(null);
    setEditDay(dayOfWeek);
    setForm({
      soup: "",
      soupAllergens: "",
      main1: "",
      main1Allergens: "",
      main2: "",
      main2Allergens: "",
      special: "",
      specialAllergens: "",
    });
    setEditDialogOpen(true);
  };

  const saveDailyMenu = async () => {
    if (!form.soup || !form.main1 || !form.main2) {
      toast.error("Polievka a hlavné jedlá sú povinné");
      return;
    }
    try {
      const payload = {
        dayOfWeek: editDay,
        soup: form.soup,
        soupAllergens: form.soupAllergens || null,
        main1: form.main1,
        main1Allergens: form.main1Allergens || null,
        main2: form.main2,
        main2Allergens: form.main2Allergens || null,
        special: form.special || null,
        specialAllergens: form.specialAllergens || null,
      };

      if (editId) {
        const res = await fetch(`/api/admin/daily-menu/${editId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success("Denné menu aktualizované");
      } else {
        const res = await fetch("/api/admin/daily-menu", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success("Denné menu vytvorené");
      }
      setEditDialogOpen(false);
      fetchDailyMenus();
    } catch {
      toast.error("Chyba pri ukladaní denného menu");
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
      <div>
        <h1 className="text-2xl font-bold text-warm-dark">Ponuka dňa</h1>
        <p className="text-sm text-muted-foreground">Správa denného menu podľa dní</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((day) => {
          const menu = dailyMenus.find((m) => m.dayOfWeek === day);
          const gradientClass = DAY_COLORS[day] || "";

          return (
            <Card
              key={day}
              className={`relative overflow-hidden border-0 shadow-sm`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
              <div className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold">
                      {DAY_NAMES[day]}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => (menu ? openEdit(menu) : openCreate(day))}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  {menu ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex items-center gap-1.5 text-amber-gold font-semibold text-xs mb-0.5">
                          <Soup className="w-3 h-3" /> Polievka
                        </div>
                        <p className="text-xs leading-snug">{menu.soup}</p>
                        {menu.soupAllergens && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Alergény: {menu.soupAllergens}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs mb-0.5">
                          <UtensilsCrossed className="w-3 h-3" /> Hlavné 1
                        </div>
                        <p className="text-xs leading-snug">{menu.main1}</p>
                        {menu.main1Allergens && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Alergény: {menu.main1Allergens}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-sky-600 font-semibold text-xs mb-0.5">
                          <UtensilsCrossed className="w-3 h-3" /> Hlavné 2
                        </div>
                        <p className="text-xs leading-snug">{menu.main2}</p>
                        {menu.main2Allergens && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Alergény: {menu.main2Allergens}
                          </p>
                        )}
                      </div>
                      {menu.special && (
                        <div>
                          <div className="flex items-center gap-1.5 text-rose-500 font-semibold text-xs mb-0.5">
                            <Sparkles className="w-3 h-3" /> Špeciál
                          </div>
                          <p className="text-xs leading-snug">{menu.special}</p>
                          {menu.specialAllergens && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Alergény: {menu.specialAllergens}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground mb-2">Nenastavené</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => openCreate(day)}
                      >
                        Nastaviť menu
                      </Button>
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Denné menu — {DAY_NAMES[editDay]}</DialogTitle>
            <DialogDescription>Upravte jednotlivé chody denného menu</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            {/* Soup */}
            <div className="space-y-3 p-3 rounded-lg bg-amber-50/50">
              <div className="flex items-center gap-2 text-amber-gold font-semibold text-sm">
                <Soup className="w-4 h-4" /> Polievka
              </div>
              <div className="space-y-2">
                <Input
                  value={form.soup}
                  onChange={(e) => setForm({ ...form, soup: e.target.value })}
                  placeholder="Názov polievky *"
                />
                <Input
                  value={form.soupAllergens}
                  onChange={(e) => setForm({ ...form, soupAllergens: e.target.value })}
                  placeholder="Alergény (napr. 1, 3, 7)"
                />
              </div>
            </div>

            {/* Main 1 */}
            <div className="space-y-3 p-3 rounded-lg bg-emerald-50/50">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                <UtensilsCrossed className="w-4 h-4" /> Hlavné jedlo 1
              </div>
              <div className="space-y-2">
                <Input
                  value={form.main1}
                  onChange={(e) => setForm({ ...form, main1: e.target.value })}
                  placeholder="Názov hlavného jedla *"
                />
                <Input
                  value={form.main1Allergens}
                  onChange={(e) => setForm({ ...form, main1Allergens: e.target.value })}
                  placeholder="Alergény (napr. 1, 3, 7)"
                />
              </div>
            </div>

            {/* Main 2 */}
            <div className="space-y-3 p-3 rounded-lg bg-sky-50/50">
              <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                <UtensilsCrossed className="w-4 h-4" /> Hlavné jedlo 2
              </div>
              <div className="space-y-2">
                <Input
                  value={form.main2}
                  onChange={(e) => setForm({ ...form, main2: e.target.value })}
                  placeholder="Názov hlavného jedla *"
                />
                <Input
                  value={form.main2Allergens}
                  onChange={(e) => setForm({ ...form, main2Allergens: e.target.value })}
                  placeholder="Alergény (napr. 1, 3, 7)"
                />
              </div>
            </div>

            {/* Special */}
            <div className="space-y-3 p-3 rounded-lg bg-rose-50/50">
              <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
                <Sparkles className="w-4 h-4" /> Špeciál (voliteľné)
              </div>
              <div className="space-y-2">
                <Input
                  value={form.special}
                  onChange={(e) => setForm({ ...form, special: e.target.value })}
                  placeholder="Názov špeciálneho jedla"
                />
                <Input
                  value={form.specialAllergens}
                  onChange={(e) => setForm({ ...form, specialAllergens: e.target.value })}
                  placeholder="Alergény (napr. 1, 3, 7)"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={saveDailyMenu} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
              Uložiť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
