"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAdminStore } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  ClipboardList,
  Clock,
  ChefHat,
  CheckCircle2,
  UtensilsCrossed,
  XCircle,
  CreditCard,
  Trash2,
} from "lucide-react";

// Types
interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  note: string | null;
}

interface OrderEntry {
  id: string;
  tableId: string;
  tableNumber: number;
  status: string;
  customerNote: string | null;
  totalItems: number;
  totalPrice: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

type FilterTab = "active" | "today" | "all";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "active", label: "Aktívne" },
  { id: "today", label: "Dnes" },
  { id: "all", label: "Všetky" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  received: { label: "Prijatá", color: "bg-blue-500 text-white", icon: Clock },
  preparing: { label: "Pripravuje sa", color: "bg-amber-500 text-white", icon: ChefHat },
  ready: { label: "Pripravená", color: "bg-emerald-500 text-white", icon: CheckCircle2 },
  served: { label: "Vydaná", color: "bg-slate-400 text-white", icon: UtensilsCrossed },
  paid: { label: "Zaplatená", color: "bg-slate-400 text-white", icon: CreditCard },
  cancelled: { label: "Zrušená", color: "bg-red-500 text-white", icon: XCircle },
};

const STATUS_FLOW: Record<string, string[]> = {
  received: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["served", "cancelled"],
  served: ["paid", "cancelled"],
  paid: [],
  cancelled: [],
};

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60) return "práve teraz";
  if (diffMin < 60) return `pred ${diffMin} min`;
  if (diffHour < 24) return `pred ${diffHour} h`;
  return date.toLocaleDateString("sk-SK", { day: "numeric", month: "short" });
}

function formatOrderTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
}

export function AdminOrders() {
  const token = useAdminStore((s) => s.token);
  const [orders, setOrders] = useState<OrderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("active");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-token": token || "",
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/api/admin/orders?limit=50";
      if (filterTab === "active") {
        // Fetch all active statuses
        url = "/api/admin/orders?limit=50";
      }
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error();
      const data: OrderEntry[] = await res.json();

      if (filterTab === "active") {
        const activeStatuses = ["received", "preparing", "ready"];
        setOrders(data.filter((o) => activeStatuses.includes(o.status)));
      } else if (filterTab === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setOrders(data.filter((o) => new Date(o.createdAt) >= today));
      } else {
        setOrders(data);
      }
    } catch {
      toast.error("Chyba pri načítavaní objednávok");
    } finally {
      setLoading(false);
    }
  }, [token, filterTab]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // WebSocket connection
  useEffect(() => {
    const socket = io("/?XTransformPort=3003", {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-admin");
    });

    socket.on("new-order", (data: { orderId: string; tableNumber: number; totalItems: number; totalPrice: string; timestamp: string }) => {
      toast.success(`Nová objednávka - Stôl ${data.tableNumber}`, {
        description: `${data.totalItems} položiek, ${data.totalPrice} EUR`,
      });
      // Mark as new for pulsing animation
      setNewOrderIds((prev) => new Set(prev).add(data.orderId));
      // Remove pulse after 30 seconds
      setTimeout(() => {
        setNewOrderIds((prev) => {
          const next = new Set(prev);
          next.delete(data.orderId);
          return next;
        });
      }, 30000);
      // Refresh orders
      fetchOrders();
    });

    socket.on("order-status-changed", () => {
      fetchOrders();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();

      // Notify via WebSocket
      socketRef.current?.emit("order-status-update", {
        orderId,
        status,
      });

      toast.success(`Objednávka ${STATUS_CONFIG[status]?.label || status}`);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o)));
    } catch {
      toast.error("Chyba pri aktualizácii objednávky");
    }
  };

  const deleteOrder = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/orders/${deleteId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      toast.success("Objednávka odstránená");
      setOrders((prev) => prev.filter((o) => o.id !== deleteId));
    } catch {
      toast.error("Chyba pri odstraňovaní objednávky");
    }
    setDeleteId(null);
  };

  // Count active orders for badge
  const activeOrderCount = orders.filter(
    (o) => ["received", "preparing", "ready"].includes(o.status)
  ).length;

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
          <h1 className="text-2xl font-bold text-warm-dark">Objednávky</h1>
          <p className="text-sm text-muted-foreground">
            Správa objednávok v reálnom čase
            {activeOrderCount > 0 && (
              <Badge className="ml-2 bg-amber-gold text-white text-[10px] px-1.5 py-0 h-5">
                {activeOrderCount} aktívnych
              </Badge>
            )}
          </p>
        </div>
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

      {/* Orders list */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {filterTab === "active" ? "Žiadne aktívne objednávky" : "Žiadne objednávky"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
          {orders.map((order) => {
            const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.received;
            const StatusIcon = statusConf.icon;
            const nextStatuses = STATUS_FLOW[order.status] || [];
            const isNew = newOrderIds.has(order.id);

            return (
              <Card
                key={order.id}
                className={`overflow-hidden transition-all ${isNew ? "ring-2 ring-amber-gold animate-pulse" : ""}`}
              >
                <CardContent className="p-4">
                  {/* Order header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-warm-dark">
                          Stôl {order.tableNumber}
                        </span>
                        <Badge className={`text-[10px] px-1.5 py-0 h-5 ${statusConf.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConf.label}
                        </Badge>
                        {isNew && (
                          <Badge className="text-[10px] px-1.5 py-0 h-5 bg-amber-gold text-white">
                            NOVÁ
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{formatOrderTime(order.createdAt)}</span>
                        <span>{getRelativeTime(order.createdAt)}</span>
                        <span>{order.totalItems} položiek</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive flex-shrink-0"
                      onClick={() => setDeleteId(order.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Items */}
                  <div className="mt-3 space-y-1.5">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-xs bg-muted rounded px-1.5 py-0.5">
                            {item.quantity}x
                          </span>
                          <span className="truncate">{item.name}</span>
                          {item.note && (
                            <span className="text-xs text-muted-foreground italic truncate">
                              ({item.note})
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-amber-gold ml-2 flex-shrink-0">
                          {item.price} EUR
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Note */}
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <div>
                      {order.customerNote && (
                        <p className="text-xs text-muted-foreground italic mb-1">
                          Poznámka: {order.customerNote}
                        </p>
                      )}
                      <span className="font-bold text-amber-gold">
                        {order.totalPrice} EUR
                      </span>
                    </div>
                  </div>

                  {/* Status action buttons */}
                  {nextStatuses.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {nextStatuses.map((nextStatus) => {
                        const nextConf = STATUS_CONFIG[nextStatus];
                        if (!nextConf) return null;
                        const NextIcon = nextConf.icon;
                        const isCancel = nextStatus === "cancelled";
                        return (
                          <Button
                            key={nextStatus}
                            size="sm"
                            variant={isCancel ? "outline" : "default"}
                            onClick={() => updateStatus(order.id, nextStatus)}
                            className={
                              isCancel
                                ? "text-destructive border-destructive/30 hover:bg-destructive/10"
                                : "bg-amber-gold hover:bg-amber-gold/90 text-white"
                            }
                          >
                            <NextIcon className="w-3.5 h-3.5 mr-1" />
                            {nextConf.label}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdiť odstránenie</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete odstrániť túto objednávku? Táto akcia sa nedá vrátiť.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteOrder}
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
