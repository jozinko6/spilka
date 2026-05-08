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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Pencil, Trash2, Loader2, PartyPopper } from "lucide-react";

interface EventEntry {
  id: string;
  title: string;
  date: string;
  time: string | null;
  description: string | null;
  organizer: string | null;
  type: string;
  active: boolean;
}

const TYPE_OPTIONS = [
  { value: "quiz", label: "Kvíz" },
  { value: "music", label: "Hudba" },
  { value: "valentine", label: "Valentín" },
  { value: "other", label: "Iné" },
];

const TYPE_BADGE_COLORS: Record<string, string> = {
  quiz: "bg-purple-500 text-white",
  music: "bg-sky-500 text-white",
  valentine: "bg-pink-400 text-white",
  other: "bg-slate-400 text-white",
};

const TYPE_LABELS: Record<string, string> = {
  quiz: "Kvíz",
  music: "Hudba",
  valentine: "Valentín",
  other: "Iné",
};

export function AdminEvents() {
  const token = useAdminStore((s) => s.token);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    organizer: "",
    type: "other",
    active: true,
  });

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const headers = {
    "Content-Type": "application/json",
    "x-admin-token": token || "",
  };

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/events", { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEvents(data);
    } catch {
      toast.error("Chyba pri načítavaní udalostí");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openNew = () => {
    setEditId(null);
    setForm({
      title: "",
      date: "",
      time: "",
      description: "",
      organizer: "",
      type: "other",
      active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (event: EventEntry) => {
    setEditId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time || "",
      description: event.description || "",
      organizer: event.organizer || "",
      type: event.type,
      active: event.active,
    });
    setDialogOpen(true);
  };

  const saveEvent = async () => {
    if (!form.title || !form.date || !form.type) {
      toast.error("Názov, dátum a typ sú povinné");
      return;
    }
    try {
      const payload = {
        title: form.title,
        date: form.date,
        time: form.time || null,
        description: form.description || null,
        organizer: form.organizer || null,
        type: form.type,
        active: form.active,
      };

      if (editId) {
        const res = await fetch(`/api/admin/events/${editId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success("Udalosť aktualizovaná");
      } else {
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success("Udalosť vytvorená");
      }
      setDialogOpen(false);
      fetchEvents();
    } catch {
      toast.error("Chyba pri ukladaní udalosti");
    }
  };

  const deleteEvent = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/events/${deleteId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      toast.success("Udalosť odstránená");
      fetchEvents();
    } catch {
      toast.error("Chyba pri odstraňovaní udalosti");
    }
    setDeleteId(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + "T00:00:00");
      return date.toLocaleDateString("sk-SK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
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
          <h1 className="text-2xl font-bold text-warm-dark">Akcie</h1>
          <p className="text-sm text-muted-foreground">Správa udalostí a akcií</p>
        </div>
        <Button onClick={openNew} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
          <Plus className="w-4 h-4 mr-1" /> Pridať udalosť
        </Button>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <PartyPopper className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Žiadne udalosti</p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-[10px] px-1.5 py-0 h-5 ${TYPE_BADGE_COLORS[event.type] || "bg-gray-400"}`}>
                        {TYPE_LABELS[event.type] || event.type}
                      </Badge>
                      {!event.active && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                          Neaktívne
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mt-1.5">{event.title}</h3>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(event)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        setDeleteId(event.id);
                        setDeleteName(event.title);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{formatDate(event.date)}</span>
                  {event.time && <span>{event.time}</span>}
                  {event.organizer && <span>{event.organizer}</span>}
                </div>
                {event.description && (
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop table view */}
      <Card className="hidden md:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Zoznam udalostí</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dátum</TableHead>
                  <TableHead>Názov</TableHead>
                  <TableHead>Čas</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Organizátor</TableHead>
                  <TableHead>Stav</TableHead>
                  <TableHead className="text-right">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      Žiadne udalosti
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatDate(event.date)}
                      </TableCell>
                      <TableCell className="font-medium text-sm max-w-[300px] truncate">
                        {event.title}
                      </TableCell>
                      <TableCell className="text-sm">{event.time || "—"}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] px-1.5 py-0 h-5 ${TYPE_BADGE_COLORS[event.type] || "bg-gray-400"}`}>
                          {TYPE_LABELS[event.type] || event.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {event.organizer || "—"}
                      </TableCell>
                      <TableCell>
                        {event.active ? (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200">
                            Aktívne
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Neaktívne
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(event)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              setDeleteId(event.id);
                              setDeleteName(event.title);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Upraviť udalosť" : "Nová udalosť"}</DialogTitle>
            <DialogDescription>
              {editId ? "Upravte údaje udalosti" : "Vyplňte údaje pre novú udalosť"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Názov *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Názov udalosti"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dátum *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Čas</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="19:00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Popis</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Popis udalosti"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organizátor</Label>
                <Input
                  value={form.organizer}
                  onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                  placeholder="Meno organizátora"
                />
              </div>
              <div className="space-y-2">
                <Label>Typ *</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eventActive"
                checked={form.active}
                onCheckedChange={(c) => setForm({ ...form, active: c === true })}
              />
              <Label htmlFor="eventActive" className="text-sm">
                Aktívna
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={saveEvent} className="bg-amber-gold hover:bg-amber-gold/90 text-white">
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
              Naozaj chcete odstrániť udalosť <strong>{deleteName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteEvent}
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
