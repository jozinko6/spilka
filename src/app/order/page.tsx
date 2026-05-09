"use client";

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  Check,
  ChefHat,
  UtensilsCrossed,
  ArrowLeft,
  Soup,
  Star,
  Flame,
  Salad,
  Utensils,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  weight?: string | null;
  allergens?: string | null;
  badge?: string | null;
  isNew: boolean;
  order: number;
  active: boolean;
}

interface MenuCategory {
  id: string;
  title: string;
  slug: string;
  icon: string;
  order: number;
  items: MenuItem[];
}

interface TableData {
  id: string;
  number: number;
  name: string | null;
  seats: number;
  area: string | null;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note: string;
}

interface OrderData {
  id: string;
  tableId: string;
  tableNumber: number;
  status: string;
  customerNote: string | null;
  totalItems: number;
  totalPrice: string;
  items: { id: string; orderId: string; menuItemId: string | null; name: string; price: string; quantity: number; note: string | null }[];
  createdAt: string;
}

// ─── Icon Map ─────────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  Soup,
  UtensilsCrossed,
  Star,
  Flame,
  Salad,
  Utensils,
};

// ─── Status Config ────────────────────────────────────────────

const statusSteps = [
  { key: "received", label: "Prijaté", icon: Check },
  { key: "preparing", label: "Pripravuje sa", icon: ChefHat },
  { key: "ready", label: "Pripravené", icon: UtensilsCrossed },
  { key: "served", label: "Podané", icon: Check },
] as const;

// ─── Helpers ──────────────────────────────────────────────────

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(",", "."));
}

function formatPrice(num: number): string {
  return num.toFixed(2).replace(".", ",");
}

// ─── Main Component ───────────────────────────────────────────

function OrderPageContent() {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get("table");

  // State
  const [table, setTable] = useState<TableData | null>(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerNote, setCustomerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const categoryTabsRef = useRef<HTMLDivElement>(null);

  // ─── Validate table ───────────────────────────────────────

  useEffect(() => {
    if (!tableParam) {
      setTableLoading(false);
      setTableError(true);
      return;
    }
    fetch("/api/tables")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((tables: TableData[]) => {
        const found = tables.find(
          (t) => t.number === parseInt(tableParam, 10)
        );
        if (found) {
          setTable(found);
        } else {
          setTableError(true);
        }
        setTableLoading(false);
      })
      .catch(() => {
        setTableError(true);
        setTableLoading(false);
      });
  }, [tableParam]);

  // ─── Fetch menu ───────────────────────────────────────────

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data: MenuCategory[]) => {
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[0].slug);
        }
        setMenuLoading(false);
      })
      .catch(() => {
        setMenuLoading(false);
      });
  }, []);

  // ─── Cart helpers ─────────────────────────────────────────

  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + parsePrice(item.menuItem.price) * item.quantity,
        0
      ),
    [cart]
  );

  const addToCart = useCallback(
    (menuItem: MenuItem) => {
      setCart((prev) => {
        const existing = prev.find((c) => c.menuItem.id === menuItem.id);
        if (existing) {
          return prev.map((c) =>
            c.menuItem.id === menuItem.id
              ? { ...c, quantity: c.quantity + 1 }
              : c
          );
        }
        return [...prev, { menuItem, quantity: 1, note: "" }];
      });
      toast.success(`${menuItem.name} pridané do košíka`);
    },
    []
  );

  const updateQuantity = useCallback(
    (menuItemId: string, delta: number) => {
      setCart((prev) =>
        prev
          .map((c) =>
            c.menuItem.id === menuItemId
              ? { ...c, quantity: Math.max(0, c.quantity + delta) }
              : c
          )
          .filter((c) => c.quantity > 0)
      );
    },
    []
  );

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== menuItemId));
  }, []);

  const updateItemNote = useCallback(
    (menuItemId: string, note: string) => {
      setCart((prev) =>
        prev.map((c) =>
          c.menuItem.id === menuItemId ? { ...c, note } : c
        )
      );
    },
    []
  );

  // ─── Submit order ─────────────────────────────────────────

  const handleSubmitOrder = useCallback(async () => {
    if (cart.length === 0 || !table || submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: table.number,
          items: cart.map((c) => ({
            menuItemId: c.menuItem.id,
            quantity: c.quantity,
            note: c.note || undefined,
          })),
          customerNote: customerNote || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Order failed");
      }

      const orderData: OrderData = await response.json();
      setOrder(orderData);
      setOrderStatus(orderData.status);
      setCartOpen(false);
      setCart([]);
      setCustomerNote("");

      // Connect to WebSocket for order tracking
      const socket = io("/?XTransformPort=3003", {
        transports: ["websocket", "polling"],
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join-order", { orderId: orderData.id });
        // Also notify admin about new order
        socket.emit("new-order", {
          orderId: orderData.id,
          tableNumber: orderData.tableNumber,
          totalItems: orderData.totalItems,
          totalPrice: orderData.totalPrice,
          customerNote: orderData.customerNote,
        });
      });

      socket.on("order-status-changed", (data: { orderId: string; status: string; timestamp: string }) => {
        if (data.orderId === orderData.id) {
          setOrderStatus(data.status);
          toast.success(`Stav objednávky: ${statusSteps.find(s => s.key === data.status)?.label || data.status}`);
        }
      });

      toast.success("Objednávka odoslaná!");
    } catch {
      toast.error("Chyba pri odosielaní objednávky");
    } finally {
      setSubmitting(false);
    }
  }, [cart, table, submitting, customerNote]);

  // ─── Cleanup socket ───────────────────────────────────────

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // ─── Scroll category tabs ─────────────────────────────────

  const scrollToCategory = useCallback(
    (slug: string) => {
      setActiveCategory(slug);
      const el = document.getElementById(`cat-${slug}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  // ─── Loading State ────────────────────────────────────────

  if (tableLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Načítavanie...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────

  if (tableError || !table) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Stôl nenájdený
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Nepodarilo sa nájsť stôl s týmto číslom. Skontrolujte QR kód a
            skúste to znova.
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            Na hlavnú stránku
          </Button>
        </div>
      </div>
    );
  }

  // ─── Order Status Overlay ─────────────────────────────────

  if (order && orderStatus) {
    const currentStepIndex = statusSteps.findIndex(
      (s) => s.key === orderStatus
    );

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-accent">SPILKA</span>
              <Separator orientation="vertical" className="h-5" />
              <span className="text-sm text-muted-foreground">
                Stôl {table.number}
              </span>
            </div>
          </div>
        </header>

        {/* Status Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm text-center"
          >
            {/* Current status icon */}
            <motion.div
              key={orderStatus}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6"
            >
              {(() => {
                const step = statusSteps.find((s) => s.key === orderStatus);
                if (step) {
                  const Icon = step.icon;
                  return <Icon className="w-10 h-10 text-accent" />;
                }
                return <Check className="w-10 h-10 text-accent" />;
              })()}
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {statusSteps.find((s) => s.key === orderStatus)?.label ||
                "Objednávka"}
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Vaša objednávka je na ceste. Budeme vás informovať o zmene stavu.
            </p>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-0 mb-8">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                      }}
                      className={`flex flex-col items-center gap-1.5 ${
                        isCompleted ? "text-accent" : "text-muted-foreground/40"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                          isCompleted
                            ? "bg-accent/15 border-2 border-accent"
                            : "bg-muted border-2 border-muted-foreground/20"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-medium leading-tight max-w-[60px] text-center">
                        {step.label}
                      </span>
                    </motion.div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-1 mb-5 transition-colors duration-500 ${
                          index < currentStepIndex
                            ? "bg-accent"
                            : "bg-muted-foreground/20"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="bg-card rounded-xl border border-border/50 p-4 text-left mb-6">
              <p className="text-xs text-muted-foreground mb-2">
                Objednávka {order.id.slice(-6).toUpperCase()}
              </p>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-1"
                >
                  <span className="text-foreground">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-muted-foreground">
                    {formatPrice(parsePrice(item.price) * item.quantity)} &euro;
                  </span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Spolu</span>
                <span className="text-accent">
                  {order.totalPrice} &euro;
                </span>
              </div>
            </div>

            {/* Back to menu button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setOrder(null);
                setOrderStatus(null);
                if (socketRef.current) {
                  socketRef.current.disconnect();
                  socketRef.current = null;
                }
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Späť na menu
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Main Ordering View ───────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-accent">SPILKA</span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-muted-foreground">
              Stôl {table.number}
              {table.name && (
                <span className="text-muted-foreground/70">
                  {" "}
                  - {table.name}
                </span>
              )}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-lg hover:bg-accent/10 transition-colors"
            aria-label="Otvoriť košík"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartItemCount > 0 && (
              <motion.span
                key={cartItemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center px-1"
              >
                {cartItemCount}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      {/* Category Tabs */}
      {!menuLoading && categories.length > 0 && (
        <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-sm border-b border-border/30">
          <div
            ref={categoryTabsRef}
            className="flex overflow-x-auto gap-1 px-3 py-2 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Utensils;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.slug)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                      : "bg-secondary/60 text-muted-foreground hover:bg-accent/10 hover:text-accent"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu Content */}
      <main className="flex-1">
        {menuLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border/30 p-4 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-1/3 bg-muted rounded" />
                  </div>
                  <div className="h-7 w-16 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Utensils;
              return (
                <div key={cat.id} id={`cat-${cat.slug}`}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-accent" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">
                      {cat.title}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      ({cat.items.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        cartQuantity={
                          cart.find((c) => c.menuItem.id === item.id)
                            ?.quantity || 0
                        }
                        onAdd={() => addToCart(item)}
                        onIncrement={() => updateQuantity(item.id, 1)}
                        onDecrement={() => updateQuantity(item.id, -1)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky Bottom Cart Bar */}
      <AnimatePresence>
        {cartItemCount > 0 && !cartOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-3"
          >
            <button
              onClick={() => setCartOpen(true)}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-5 py-3.5 flex items-center justify-between shadow-lg shadow-accent/25 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] rounded-full bg-accent-foreground text-accent text-[9px] font-bold flex items-center justify-center px-0.5">
                    {cartItemCount}
                  </span>
                </div>
                <span className="font-semibold text-sm">
                  Zobraziť košík
                </span>
              </div>
              <span className="font-bold">
                {formatPrice(cartTotal)} &euro;
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] rounded-t-2xl px-0 pt-0 pb-0 flex flex-col"
        >
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-lg">Váš košík</SheetTitle>
                <SheetDescription className="text-sm">
                  {cartItemCount}{" "}
                  {cartItemCount === 1
                    ? "položka"
                    : cartItemCount < 5
                    ? "položky"
                    : "položiek"}{" "}
                  - Stôl {table.number}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">
                Váš košík je prázdny
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Pridajte položky z jedálneho lístka
              </p>
            </div>
          ) : (
            <>
              {/* Cart items list */}
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                <AnimatePresence mode="popLayout">
                  {cart.map((cartItem) => (
                    <motion.div
                      key={cartItem.menuItem.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-card rounded-lg border border-border/30 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground truncate">
                            {cartItem.menuItem.name}
                          </h4>
                          <p className="text-accent font-bold text-sm mt-0.5">
                            {formatPrice(
                              parsePrice(cartItem.menuItem.price) *
                                cartItem.quantity
                            )}{" "}
                            &euro;
                            {cartItem.quantity > 1 && (
                              <span className="text-muted-foreground font-normal text-xs ml-1">
                                ({cartItem.menuItem.price} &euro; / ks)
                              </span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartItem.menuItem.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Odstrániť"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-secondary/60 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(cartItem.menuItem.id, -1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-l-lg hover:bg-accent/10 transition-colors"
                            aria-label="Znížiť množstvo"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(cartItem.menuItem.id, 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-r-lg hover:bg-accent/10 transition-colors"
                            aria-label="Zvýšiť množstvo"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Note per item */}
                      <div className="mt-2">
                        <Input
                          placeholder="Poznámka (napr. bez cibuľe)"
                          value={cartItem.note}
                          onChange={(e) =>
                            updateItemNote(cartItem.menuItem.id, e.target.value)
                          }
                          className="text-xs h-8 bg-secondary/30 border-border/30"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer with total and submit */}
              <div className="border-t border-border/30 bg-background px-5 pt-3 pb-5 space-y-3">
                {/* Customer note */}
                <Textarea
                  placeholder="Poznámka k objednávke (voliteľné)"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="text-sm min-h-[60px] bg-secondary/30 border-border/30 resize-none"
                  rows={2}
                />

                <Separator className="opacity-50" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Spolu</span>
                  <span className="text-xl font-bold text-accent">
                    {formatPrice(cartTotal)} &euro;
                  </span>
                </div>

                <Button
                  onClick={handleSubmitOrder}
                  disabled={submitting || cart.length === 0}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base rounded-xl shadow-md shadow-accent/20"
                  size="lg"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Objednať
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Načítavanie...</p>
          </div>
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}

// ─── Menu Item Card ───────────────────────────────────────────

function MenuItemCard({
  item,
  cartQuantity,
  onAdd,
  onIncrement,
  onDecrement,
}: {
  item: MenuItem;
  cartQuantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <motion.div
      layout
      className="bg-card rounded-xl border border-border/30 p-3.5 hover:border-accent/20 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-sm text-foreground leading-tight">
              {item.name}
            </h3>
            {item.badge && (
              <Badge
                variant="secondary"
                className="bg-accent/15 text-accent text-[9px] px-1.5 py-0 h-4 border-0 font-semibold"
              >
                {item.badge}
              </Badge>
            )}
            {item.isNew && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0 h-4 border-0 font-semibold"
              >
                Novinka
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2">
            {item.description}
          </p>

          {/* Weight & allergens */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground/60">
            {item.weight && <span>{item.weight}</span>}
            {item.allergens && (
              <span>Alergény: {item.allergens}</span>
            )}
          </div>
        </div>

        {/* Price + add button */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-base font-bold text-accent whitespace-nowrap">
            {item.price} &euro;
          </span>

          {cartQuantity === 0 ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onAdd}
              className="w-8 h-8 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent flex items-center justify-center transition-colors"
              aria-label={`Pridať ${item.name}`}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-accent/10 rounded-lg"
            >
              <button
                onClick={onDecrement}
                className="w-7 h-7 flex items-center justify-center rounded-l-lg hover:bg-accent/20 text-accent transition-colors"
                aria-label="Znížiť"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-accent">
                {cartQuantity}
              </span>
              <button
                onClick={onIncrement}
                className="w-7 h-7 flex items-center justify-center rounded-r-lg hover:bg-accent/20 text-accent transition-colors"
                aria-label="Zvýšiť"
              >
                <Plus className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
