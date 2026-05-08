"use client";

import { Truck, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from "@/components/section-wrapper";

const deliveryOptions = [
  {
    name: "Wolt",
    url: "https://wolt.com/sk/svk/hlohovec/restaurant/spilka-terasa",
    description: "Objednajte si jedlo z celého jedálneho lístka s doručením až k vám domov.",
    color: "#009FE3",
    hoverBg: "hover:bg-[#009FE3]/10",
    borderColor: "border-[#009FE3]/30",
    iconBg: "bg-[#009FE3]/10",
    iconColor: "text-[#009FE3]",
    badge: "Doručenie",
    badgeBg: "bg-[#009FE3]/10 text-[#009FE3]",
  },
  {
    name: "Bolt Food",
    url: "https://food.bolt.eu/sk-SK/delivery/hlohovec/spilka-terasa",
    description: "Rýchle doručenie obľúbených jedál z SPILKA Terasa cez Bolt Food.",
    color: "#34D186",
    hoverBg: "hover:bg-[#34D186]/10",
    borderColor: "border-[#34D186]/30",
    iconBg: "bg-[#34D186]/10",
    iconColor: "text-[#34D186]",
    badge: "Doručenie",
    badgeBg: "bg-[#34D186]/10 text-[#34D186]",
  },
  {
    name: "Vlastný rozvoz",
    url: "tel:+421914105500",
    description: "Objednajte si obedové menu s rozvozom po Hlohovci a Šulekove.",
    color: "#D4A843",
    hoverBg: "hover:bg-accent/10",
    borderColor: "border-accent/30",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    badge: "11:00–13:30",
    badgeBg: "bg-accent/10 text-accent",
    phone: "0914 105 500",
  },
];

export function OrderSection() {
  return (
    <SectionWrapper id="objednat" className="py-16 md:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
              Rozvoz jedla
            </span>
            <div className="h-px w-8 bg-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Objednajte si{" "}
            <span className="text-accent">rozvoz</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Pohodlne si objednajte jedlo z SPILKA Terasa cez obľúbené doručovacie
            aplikácie alebo si zavolajte náš vlastný rozvoz.
          </p>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {deliveryOptions.map((option) => (
            <StaggerItem key={option.name}>
              <Card
                className={`group h-full border ${option.borderColor} ${option.hoverBg} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl ${option.iconBg} flex items-center justify-center`}
                    >
                      <Truck className={`w-7 h-7 ${option.iconColor}`} />
                    </div>
                    <Badge
                      className={`${option.badgeBg} border-0 text-xs font-medium`}
                    >
                      {option.badge}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {option.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {option.description}
                  </p>

                  {option.phone && (
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Phone className={`w-4 h-4 ${option.iconColor}`} />
                      <span className="font-semibold text-foreground">
                        {option.phone}
                      </span>
                    </div>
                  )}

                  <Button
                    asChild
                    className={`w-full font-semibold ${
                      option.name === "Wolt"
                        ? "bg-[#009FE3] hover:bg-[#009FE3]/90 text-white"
                        : option.name === "Bolt Food"
                        ? "bg-[#34D186] hover:bg-[#34D186]/90 text-white"
                        : "bg-accent hover:bg-accent/90 text-accent-foreground"
                    }`}
                    size="lg"
                  >
                    <a
                      href={option.url}
                      target={option.name !== "Vlastný rozvoz" ? "_blank" : undefined}
                      rel={option.name !== "Vlastný rozvoz" ? "noopener noreferrer" : undefined}
                    >
                      {option.name === "Vlastný rozvoz" ? (
                        <>
                          <Phone className="mr-2 h-4 w-4" />
                          Zavolať
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Objednať cez {option.name}
                        </>
                      )}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Info strip */}
        <FadeIn delay={0.4}>
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 p-4 rounded-xl bg-background border border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4 text-accent" />
                <span>Min. objednávka 6,00 €</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-accent" />
                <span>Rozvoz HC &amp; Šulekovo</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-accent font-semibold">11:00</span>
                <span>–</span>
                <span className="text-accent font-semibold">23:30</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
