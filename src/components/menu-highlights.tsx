"use client";

import Image from "next/image";
import {
  UtensilsCrossed,
  Flame,
  Salad,
  Pizza,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper, StaggerContainer, StaggerItem } from "@/components/section-wrapper";

const menuCategories = [
  {
    icon: UtensilsCrossed,
    title: "Hlavné jedlá",
    description:
      "Tradičné slovenské špeciality aj medzinárodné jedlá pripravené z tých najkvalitnejších surovín.",
    image: "/images/spilka-dish.jpg",
  },
  {
    icon: Flame,
    title: "Spilka špeciality",
    description:
      "Naše vlastné originálne recepty, ktoré nájdete len v SPILKA reštauráciách.",
    image: "/images/spilka-food.jpg",
  },
  {
    icon: Pizza,
    title: "Flammkuchen",
    description:
      "Chrumkavý tenký koláč z piecky s rôznymi sladkými i slanými náplňami.",
    image: "/images/spilka-dish.jpg",
  },
  {
    icon: Salad,
    title: "Šaláty & Pizza",
    description:
      "Čerstvé šaláty, vegetariánske a vegánske možnosti, chutné pizza špeciality.",
    image: "/images/spilka-food.jpg",
  },
];

export function MenuHighlights() {
  return (
    <SectionWrapper
      id="menu"
      className="py-16 md:py-24 bg-secondary/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
              Naše menu
            </span>
            <div className="h-px w-8 bg-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Objavte naše{" "}
            <span className="text-accent">špeciality</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Od tradičných slovenských jedál cez flammkuchen až po čerstvé
            šaláty — máme pre každého to pravé.
          </p>
        </div>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuCategories.map((category) => (
            <StaggerItem key={category.title}>
              <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-accent/90 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Dietary badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            🌿 Vegetariánske možnosti
          </span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
            🌱 Vegánske možnosti
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
            🍞 Bezlepkové možnosti
          </span>
        </div>
      </div>
    </SectionWrapper>
  );
}
