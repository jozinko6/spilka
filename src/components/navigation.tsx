"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "#o-nas", label: "O nás" },
  { href: "#jedalny-listok", label: "Jedálny lístok" },
  { href: "#ponuka-dna", label: "Ponuka dňa" },
  { href: "#pivo", label: "Pivo" },
  { href: "#objednat", label: "Objednať" },
  { href: "#eventy", label: "Eventy" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const reserveBtnClass = scrolled
    ? "font-bold shadow-md bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent/20"
    : "font-bold shadow-md bg-white text-foreground hover:bg-white/90 shadow-white/20";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={
        scrolled
          ? "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-primary/95 backdrop-blur-md shadow-lg"
          : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent"
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2"
          >
            <span
              className={
                scrolled
                  ? "text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 text-accent"
                  : "text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 text-white"
              }
            >
              SPILKA
            </span>
            <span
              className={
                scrolled
                  ? "hidden sm:inline text-sm font-light tracking-widest uppercase transition-colors duration-300 text-primary-foreground/70"
                  : "hidden sm:inline text-sm font-light tracking-widest uppercase transition-colors duration-300 text-white/70"
              }
            >
              Terasa
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={
                  scrolled
                    ? "text-sm font-medium tracking-wide transition-colors duration-300 hover:text-accent text-primary-foreground/80"
                    : "text-sm font-medium tracking-wide transition-colors duration-300 hover:text-accent text-white/80"
                }
              >
                {link.label}
              </a>
            ))}
            <Button asChild className={reserveBtnClass}>
              <a
                href="#kontakt"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#kontakt");
                }}
              >
                Rezervácia
              </a>
            </Button>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    scrolled
                      ? "text-primary-foreground hover:bg-primary-foreground/10"
                      : "text-white hover:bg-white/10"
                  }
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-primary text-primary-foreground w-72"
              >
                <SheetTitle className="sr-only">Navigácia</SheetTitle>
                <div className="flex flex-col gap-6 mt-12">
                  <span className="text-2xl font-bold text-accent">
                    SPILKA
                  </span>
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        className="text-lg font-medium text-primary-foreground/80 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                  <Button
                    className="bg-white text-foreground hover:bg-white/90 font-bold mt-4 shadow-md"
                    asChild
                  >
                    <a
                      href="#kontakt"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick("#kontakt");
                      }}
                    >
                      Rezervácia
                    </a>
                  </Button>
                  <div className="mt-8 pt-6 border-t border-primary-foreground/10">
                    <p className="text-sm text-primary-foreground/60">
                      Hollého 1, 920 01 Hlohovec
                    </p>
                    <p className="text-sm text-primary-foreground/60 mt-1">
                      033/322 22 99
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
