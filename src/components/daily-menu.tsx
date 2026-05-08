"use client";

import { Clock, Truck, UtensilsCrossed } from "lucide-react";
import { SectionWrapper, FadeIn } from "@/components/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";

export function DailyMenu() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
              Denné menu
            </span>
            <div className="h-px w-8 bg-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Obedné{" "}
            <span className="text-accent">menu</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <Card className="text-center border-accent/20 hover:shadow-lg transition-shadow duration-300 h-full">
              <CardContent className="p-6 md:p-8">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  11:00 – 14:00
                </h3>
                <p className="text-muted-foreground text-sm">
                  Denné menu podávame každý pracovný deň od 11:00 do 14:00.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card className="text-center border-accent/20 hover:shadow-lg transition-shadow duration-300 bg-accent text-accent-foreground h-full">
              <CardContent className="p-6 md:p-8">
                <div className="w-14 h-14 rounded-xl bg-accent-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="text-3xl font-bold mb-2">7,50 €</h3>
                <p className="text-accent-foreground/80 text-sm">
                  Polievka + hlavné jedlo. Domáca kuchyňa za skvelú cenu.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Card className="text-center border-accent/20 hover:shadow-lg transition-shadow duration-300 h-full">
              <CardContent className="p-6 md:p-8">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Rozvoz jedla
                </h3>
                <p className="text-muted-foreground text-sm">
                  Wolt, Bolt aj vlastný rozvoz v Hlohovci a Šulekove.
                </p>
                <p className="text-accent text-sm font-semibold mt-2">
                  0914 105 500
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </SectionWrapper>
  );
}
