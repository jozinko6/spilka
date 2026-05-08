"use client";

import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { href: "#o-nas", label: "O nás" },
  { href: "#menu", label: "Menu" },
  { href: "#pivo", label: "Pivo" },
  { href: "#eventy", label: "Eventy" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-2xl font-bold text-accent">SPILKA</span>
            <span className="text-sm font-light tracking-widest uppercase text-primary-foreground/60 ml-2">
              Terasa
            </span>
            <p className="text-primary-foreground/60 text-sm mt-4 leading-relaxed">
              Tradičná slovenská kuchyňa s moderným duchom v srdci Hlohovca.
              Exkluzívne tankové pivo Svijany 450.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-primary-foreground">
              Navigácia
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-primary-foreground/60 hover:text-accent text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-primary-foreground">
              Kontakt
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/60 text-sm">
                  Hollého 1, 920 01 Hlohovec
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/60 text-sm">
                  033/322 22 99
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-primary-foreground">
              Sledujte nás
            </h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/spilkaterasa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-primary-foreground/70" />
              </a>
              <a
                href="https://instagram.com/spilkaterasa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-primary-foreground/70" />
              </a>
            </div>
            <p className="text-primary-foreground/40 text-xs mt-4">
              Otváracie hodiny: Po – Ne 11:00 – 23:30
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/40 text-xs">
            © {new Date().getFullYear()} SPILKA Terasa. Všetky práva vyhradené.
          </p>
          <p className="text-primary-foreground/30 text-xs">
            Súčasťou reštauračnej siete SPILKA
          </p>
        </div>
      </div>
    </footer>
  );
}
