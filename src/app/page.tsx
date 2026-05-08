"use client";

import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { MenuHighlights } from "@/components/menu-highlights";
import { BeerSection } from "@/components/beer-section";
import { DailyMenu } from "@/components/daily-menu";
import { OrderSection } from "@/components/order-section";
import { EventsSection } from "@/components/events-section";
import { Gallery } from "@/components/gallery";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <About />
        <MenuHighlights />
        <BeerSection />
        <DailyMenu />
        <OrderSection />
        <EventsSection />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
