"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const handleScrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/spilka-hero.jpg"
          alt="SPILKA Terasa – reštaurácia v Hlohovci"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Parallax-like subtle overlay pattern */}
      <div className="absolute inset-0 z-[1] opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.72 0.14 75 / 0.3), transparent 50%), radial-gradient(circle at 80% 50%, oklch(0.72 0.14 75 / 0.2), transparent 50%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent font-medium tracking-[0.3em] text-sm uppercase">
              Hlohovec
            </span>
            <div className="h-px w-12 bg-accent" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          SPILKA{" "}
          <span className="text-accent">Terasa</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg sm:text-xl md:text-2xl text-white/80 font-light mb-4 max-w-2xl mx-auto"
        >
          Tradičná kuchyňa s moderným duchom
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex items-center justify-center gap-2 text-white/60 text-sm mb-10"
        >
          <MapPin className="w-4 h-4" />
          <span>OC Viktória, Hollého 1, Hlohovec</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-8 h-13 shadow-lg shadow-accent/25"
            onClick={() => handleScrollTo("#menu")}
          >
            Zobraziť menu
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            className="bg-white text-foreground hover:bg-white/90 font-bold text-base px-8 h-13 shadow-lg"
            onClick={() => handleScrollTo("#kontakt")}
          >
            Rezervovať stôl
          </Button>
          <Button
            size="lg"
            className="bg-[#009FE3] text-white hover:bg-[#008aca] font-bold text-base px-8 h-13 shadow-lg shadow-[#009FE3]/25"
            onClick={() => handleScrollTo("#objednat")}
          >
            <Truck className="mr-2 h-5 w-5" />
            Objednať rozvoz
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
