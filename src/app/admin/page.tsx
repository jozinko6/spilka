"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminLayout, type AdminSection } from "@/components/admin/admin-layout";
import { AdminMenu } from "@/components/admin/admin-menu";
import { AdminDailyMenu } from "@/components/admin/admin-daily-menu";
import { AdminEvents } from "@/components/admin/admin-events";
import { AdminGallery } from "@/components/admin/admin-gallery";
import { AdminTables } from "@/components/admin/admin-tables";
import { AdminOrders } from "@/components/admin/admin-orders";

export default function AdminPage() {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const hasHydrated = useAdminStore((s) => s._hasHydrated);
  const token = useAdminStore((s) => s.token);
  const [activeSection, setActiveSection] = useState<AdminSection>("menu");
  const [activeOrderCount, setActiveOrderCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    let cancelled = false;

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/admin/orders?limit=100", {
          headers: { "x-admin-token": token },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (cancelled) return;
        const active = data.filter(
          (o: { status: string }) => ["received", "preparing", "ready"].includes(o.status)
        );
        setActiveOrderCount(active.length);
      } catch {
        // silently fail
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isAuthenticated, token]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-amber-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "menu":
        return <AdminMenu />;
      case "daily-menu":
        return <AdminDailyMenu />;
      case "events":
        return <AdminEvents />;
      case "gallery":
        return <AdminGallery />;
      case "tables":
        return <AdminTables />;
      case "orders":
        return <AdminOrders />;
      default:
        return <AdminMenu />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection} activeOrderCount={activeOrderCount}>
      {renderSection()}
    </AdminLayout>
  );
}
