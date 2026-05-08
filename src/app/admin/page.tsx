"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminLayout, type AdminSection } from "@/components/admin/admin-layout";
import { AdminMenu } from "@/components/admin/admin-menu";
import { AdminDailyMenu } from "@/components/admin/admin-daily-menu";
import { AdminEvents } from "@/components/admin/admin-events";
import { AdminGallery } from "@/components/admin/admin-gallery";

export default function AdminPage() {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const hasHydrated = useAdminStore((s) => s._hasHydrated);
  const [activeSection, setActiveSection] = useState<AdminSection>("menu");

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
      default:
        return <AdminMenu />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </AdminLayout>
  );
}
