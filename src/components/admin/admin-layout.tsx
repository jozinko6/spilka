"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  UtensilsCrossed,
  CalendarDays,
  PartyPopper,
  Image as ImageIcon,
  LogOut,
  Menu,
  Soup,
} from "lucide-react";
import { toast } from "sonner";

export type AdminSection = "menu" | "daily-menu" | "events" | "gallery";

interface AdminLayoutProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: React.ReactNode;
}

const navItems: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: "menu", label: "Jedálny lístok", icon: Soup },
  { id: "daily-menu", label: "Ponuka dňa", icon: CalendarDays },
  { id: "events", label: "Akcie", icon: PartyPopper },
  { id: "gallery", label: "Galéria", icon: ImageIcon },
];

function SidebarContent({
  activeSection,
  onSectionChange,
  onNavigate,
}: {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onNavigate?: () => void;
}) {
  const logout = useAdminStore((s) => s.logout);

  const handleNavClick = (section: AdminSection) => {
    onSectionChange(section);
    onNavigate?.();
  };

  const handleLogout = () => {
    logout();
    toast.success("Boli ste odhlásení");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-gold/10 flex items-center justify-center flex-shrink-0">
          <UtensilsCrossed className="w-5 h-5 text-amber-gold" />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-warm-dark text-sm truncate">SPILKA Terasa</h2>
          <p className="text-xs text-muted-foreground">Administrácia</p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-gold/10 text-amber-gold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Logout */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Odhlásiť sa
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout({ activeSection, onSectionChange, children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-[250px] md:flex-col border-r border-border bg-card">
        <SidebarContent
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              <SheetTitle className="sr-only">Navigácia</SheetTitle>
              <SidebarContent
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-gold/10 flex items-center justify-center">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-gold" />
            </div>
            <span className="font-bold text-sm text-warm-dark">SPILKA Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
