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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Armchair,
  QrCode,
  Copy,
  Users,
} from "lucide-react";

// Types
interface TableEntry {
  id: string;
  number: number;
  name: string | null;
  seats: number;
  area: string | null;
  active: boolean;
  _count: {
    orders: number;
  };
}

const AREA_OPTIONS = [
  { value: "interior", label: "Interiér" },
  { value: "terrace", label: "Terasa" },
  { value: "vip", label: "VIP" },
];

const AREA_BADGE_COLORS: Record<string, string> = {
  interior: "bg-blue-500 text-white",
  terrace: "bg-emerald-500 text-white",
  vip: "bg-amber-500 text-white",
};

const AREA_LABELS: Record<string, string> = {
  interior: "Interiér",
  terrace: "Terasa",
  vip: "VIP",
};

type FilterTab = "all" | "interior" | "terrace" | "vip";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Všetky" },
  { id: "interior", label: "Interiér" },
  { id: "terrace", label: "Terasa" },
  { id: "vip", label: "VIP" },
];

export function AdminTables() {
  const token = useAdminStore((s) => s.token);
  const [tables, setTables] = useState<TableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    number: "",
    name: "",
    seats: "4",
    area: "",
    active: true,
  });

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  // QR code dialog
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrTable, setQrTable] = useState<TableEntry | null>(null);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-token": token || "",
  };

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/tables", { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTables(data);
    } catch {
      toast.error("Chyba pri načítavaní stolov");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const filteredTables = tables.filter((t) => {
    if (filterTab === "all") return true;
    return t.area === filterTab;
  });

  const openNew = () => {
    setEditId(null);
    setForm({
      number: "",
      name: "",
      seats: "4",
      area: "",
      active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (table: TableEntry) => {
    setEditId(table.id);
    setForm({
      number: String(table.number),
      name: table.name || "",
      seats: String(table.seats),
      area: table.area || "",
      active: table.active,
    });
    setDialogOpen(true);
  };

  const saveTable = async () => {
    if (!form.number || !form.seats) {
      toast.error("Číslo stola a počet miest sú povinné");
      return;
    }
    try {
      const payload = {
        number: parseInt(form.number),
        name: form.name || null,
        seats: parseInt(form.seats),
        area: form.area || null,
        active: form.active,
      };

      if (editId) {
        const res = await fetch(`/api/admin/tables/${editId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success("Stôl aktualizovaný");
      } else {
        const res = await fetch("/api/admin/tables", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success("Stôl vytvorený");
      }
      setDialogOpen(false);
      fetchTables();
    } catch {
      toast.error("Chyba pri ukladaní stola");
    }
  };

  const deleteTable = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/tables/${deleteId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      toast.success("Stôl odstránený");
      fetchTables();
    } catch {
      toast.error("Chyba pri odstraňovaní stola");
    }
    setDeleteId(null);
  };

  const openQr = (table: TableEntry) => {
    setQrTable(table);
    setQrDialogOpen(true);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Odkaz skopírovaný");
    });
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
          <h1 className="text-2xl font-bold text-warm-dark">Stoly</h1>
          <p className="text-sm text-muted-foreground">Správa stolov a QR kódov</p>
        </div>
        <Button onClick={openNew} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
          <Plus className="w-4 h-4 mr-1" /> Pridať stôl
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={filterTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab(tab.id)}
            className={filterTab === tab.id ? "bg-amber-gold hover:bg-amber-gold/90 text-white" : ""}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tables grid */}
      {filteredTables.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Armchair className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Žiadne stoly</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map((table) => {
            return (
              <Card key={table.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg text-warm-dark">
                          Stôl {table.number}
                        </span>
                        {table.area && (
                          <Badge className={`text-[10px] px-1.5 py-0 h-5 ${AREA_BADGE_COLORS[table.area] || "bg-gray-400"}`}>
                            {AREA_LABELS[table.area] || table.area}
                          </Badge>
                        )}
                        {!table.active && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                            Neaktívny
                          </Badge>
                        )}
                      </div>
                      {table.name && (
                        <p className="text-sm text-muted-foreground mt-0.5">{table.name}</p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openQr(table)}>
                        <QrCode className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(table)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => {
                          setDeleteId(table.id);
                          setDeleteName(`Stôl ${table.number}`);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{table.seats} miest</span>
                    </div>
                    {table._count.orders > 0 && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 text-amber-gold border-amber-200">
                        {table._count.orders} obj.
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Upraviť stôl" : "Nový stôl"}</DialogTitle>
            <DialogDescription>
              {editId ? "Upravte údaje stola" : "Vyplňte údaje pre nový stôl"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Číslo *</Label>
                <Input
                  type="number"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Počet miest *</Label>
                <Input
                  type="number"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
                  placeholder="4"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Názov</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Napr. Pri okne"
              />
            </div>
            <div className="space-y-2">
              <Label>Oblasť</Label>
              <Select
                value={form.area}
                onValueChange={(v) => setForm({ ...form, area: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte oblasť" />
                </SelectTrigger>
                <SelectContent>
                  {AREA_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tableActive"
                checked={form.active}
                onCheckedChange={(c) => setForm({ ...form, active: c === true })}
              />
              <Label htmlFor="tableActive" className="text-sm">
                Aktívny
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={saveTable} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
              Uložiť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR kód - Stôl {qrTable?.number}</DialogTitle>
            <DialogDescription>
              Naskenujte QR kód pre objednávku
            </DialogDescription>
          </DialogHeader>
          {qrTable && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={`https://spilkaterasa.sk/order?table=${qrTable.number}`}
                  size={256}
                  level="M"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center break-all">
                {`https://spilkaterasa.sk/order?table=${qrTable.number}`}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyLink(`https://spilkaterasa.sk/order?table=${qrTable.number}`)}
                className="gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Kopírovať odkaz
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdiť odstránenie</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete odstrániť <strong>{deleteName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTable}
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
