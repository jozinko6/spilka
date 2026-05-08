"use client";

import { useState } from "react";
import {
  Clock,
  Truck,
  UtensilsCrossed,
  CalendarDays,
  ChevronRight,
  Phone,
} from "lucide-react";
import { SectionWrapper, FadeIn } from "@/components/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DailyDish {
  soup: string;
  soupAllergens: string;
  main1: string;
  main1Allergens: string;
  main2: string;
  main2Allergens: string;
  special?: string;
  specialAllergens?: string;
}

interface DayMenu {
  day: string;
  dayShort: string;
  dishes: DailyDish;
}

const weeklyMenu: DayMenu[] = [
  {
    day: "Pondelok",
    dayShort: "Po",
    dishes: {
      soup: "Slepačí vývar s rezancami a mäsom",
      soupAllergens: "1, 3, 9",
      main1: "Bravčový rezeň so zemiakovým šalátom",
      main1Allergens: "1, 3, 7, 10",
      main2: "Kurací steak na bylinkovom masle s opekanými zemiakmi",
      main2Allergens: "7",
      special: "Hovädzí burger s hranolkami a chedar omáčkou",
      specialAllergens: "1, 3, 7, 10, 11",
    },
  },
  {
    day: "Utorok",
    dayShort: "Ut",
    dishes: {
      soup: "Gulášová polievka s chlebom",
      soupAllergens: "1, 3, 7, 9",
      main1: "Francúzske zemiaky so šunkou a syrom",
      main1Allergens: "1, 3, 7, 12",
      main2: "Kuracie obaľované krídla s varenými zemiakmi a tzatziki",
      main2Allergens: "1, 3, 7",
      special: "Flammkuchen slanina, cibuľa",
      specialAllergens: "1, 3, 7, 12",
    },
  },
  {
    day: "Streda",
    dayShort: "St",
    dishes: {
      soup: "Krémová polievka z medvedieho cesnaku",
      soupAllergens: "7, 9",
      main1: "Pečené kuracie stehno so žemľovou plnkou a dusenou ryžou",
      main1Allergens: "1, 3, 7",
      main2: 'Rezňové "stripy" — bravčové s hranolkami',
      main2Allergens: "1, 3",
      special: "Grilovaná bravčová panenka so slivkovou omáčkou",
      specialAllergens: "1, 7",
    },
  },
  {
    day: "Štvrtok",
    dayShort: "Št",
    dishes: {
      soup: "Tradičná Jókai fazuľová polievka s pivným praclíkom",
      soupAllergens: "1, 3, 9",
      main1: "Bravčová panenka s demiglace omáčkou a knedľou",
      main1Allergens: "1, 3, 7",
      main2: "Cézar šalát s grilovaným kuracím mäsom",
      main2Allergens: "1, 3, 7, 12",
      special: "Flammkuchen paradajky, rukola",
      specialAllergens: "1, 3, 7",
    },
  },
  {
    day: "Piatok",
    dayShort: "Pi",
    dishes: {
      soup: "Cesnakový krém so syrovým krutónom",
      soupAllergens: "1, 3, 7, 9",
      main1: "Ryba dňa s varenými zemiakmi a tatárskou omáčkou",
      main1Allergens: "1, 3, 4, 7, 10",
      main2: "Kurací steak s pečenými baby zemiakmi",
      main2Allergens: "7",
      special: "Grilovaný flank steak s chimichurri",
      specialAllergens: "7",
    },
  },
];

function getCurrentDayIndex(): number {
  const day = new Date().getDay();
  // JS: Sunday = 0, Monday = 1, ... Friday = 5, Saturday = 6
  // Our array: 0=Monday, ... 4=Friday
  if (day === 0 || day === 6) return 0; // Weekend -> show Monday
  return day - 1;
}

export function DailyMenu() {
  const [todayIndex] = useState(() => getCurrentDayIndex());
  const [activeDay, setActiveDay] = useState(() => getCurrentDayIndex());

  const currentMenu = weeklyMenu[activeDay];

  return (
    <SectionWrapper id="ponuka-dna" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
              Denné menu
            </span>
            <div className="h-px w-8 bg-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ponuka <span className="text-accent">dňa</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Každý pracovný deň pre vás pripravujeme chutné obedové menu.
            Polievka + hlavné jedlo už od 7,90 €.
          </p>
        </div>

        {/* Info Cards Row */}
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-10">
          <FadeIn delay={0}>
            <Card className="text-center border-accent/20 hover:shadow-lg transition-shadow duration-300 h-full">
              <CardContent className="p-5 md:p-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  11:00 – 14:00
                </h3>
                <p className="text-muted-foreground text-sm">
                  Obedové menu podávame každý pracovný deň
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card className="text-center border-accent/20 hover:shadow-lg transition-shadow duration-300 bg-accent text-accent-foreground h-full">
              <CardContent className="p-5 md:p-6">
                <div className="w-12 h-12 rounded-xl bg-accent-foreground/10 flex items-center justify-center mx-auto mb-3">
                  <UtensilsCrossed className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-1">7,90 €</h3>
                <p className="text-accent-foreground/80 text-sm">
                  Polievka + hlavné jedlo
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Card className="text-center border-accent/20 hover:shadow-lg transition-shadow duration-300 h-full">
              <CardContent className="p-5 md:p-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  Rozvoz jedla
                </h3>
                <p className="text-muted-foreground text-sm">
                  Wolt, Bolt aj vlastný rozvoz
                </p>
                <p className="text-accent text-sm font-semibold mt-1.5 flex items-center justify-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  0914 105 500
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Day Selector */}
        <FadeIn delay={0.2}>
          <div className="flex items-center justify-center gap-2 mb-8">
            <CalendarDays className="w-5 h-5 text-accent mr-2" />
            {weeklyMenu.map((day, idx) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(idx)}
                className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeDay === idx
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
                    : "bg-card text-muted-foreground hover:bg-accent/10 hover:text-accent border border-border/50"
                }`}
              >
                <span className="hidden sm:inline">{day.day}</span>
                <span className="sm:hidden">{day.dayShort}</span>
                {idx === todayIndex && (
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Daily Menu Content */}
        <FadeIn delay={0.3}>
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden">
              {/* Day Header */}
              <div className="bg-accent/10 px-6 py-4 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-accent" />
                    {currentMenu.day}
                    {activeDay === todayIndex && (
                      <Badge className="bg-green-100 text-green-700 text-[10px] px-2 py-0 h-5 border-0 ml-1">
                        Dnes
                      </Badge>
                    )}
                  </h3>
                  <span className="text-accent font-bold text-lg">7,90 €</span>
                </div>
              </div>

              <div className="p-5 md:p-6 space-y-0">
                {/* Soup */}
                <div className="flex items-start gap-3 py-4 border-b border-border/30">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">🍲</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                      Polievka
                    </p>
                    <p className="font-semibold text-foreground">
                      {currentMenu.dishes.soup}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      Alergény: {currentMenu.dishes.soupAllergens}
                    </p>
                  </div>
                </div>

                {/* Main 1 */}
                <div className="flex items-start gap-3 py-4 border-b border-border/30">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">🥩</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                      Hlavné jedlo 1
                    </p>
                    <p className="font-semibold text-foreground">
                      {currentMenu.dishes.main1}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      Alergény: {currentMenu.dishes.main1Allergens}
                    </p>
                  </div>
                </div>

                {/* Main 2 */}
                <div className="flex items-start gap-3 py-4 border-b border-border/30">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">🍗</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                      Hlavné jedlo 2
                    </p>
                    <p className="font-semibold text-foreground">
                      {currentMenu.dishes.main2}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      Alergény: {currentMenu.dishes.main2Allergens}
                    </p>
                  </div>
                </div>

                {/* Weekly Special */}
                {currentMenu.dishes.special && (
                  <div className="flex items-start gap-3 py-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">⭐</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-accent uppercase tracking-wider font-medium">
                          Týždenný špeciál
                        </p>
                        <Badge className="bg-accent/15 text-accent text-[9px] px-1.5 py-0 h-4 border-0">
                          +príplatok
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground">
                        {currentMenu.dishes.special}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">
                        Alergény: {currentMenu.dishes.specialAllergens}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-muted/30 px-6 py-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground/70 text-center">
                  Cena platí pre obedové menu (polievka + hlavné jedlo).
                  Týždenný špeciál s príplatkom. Cez Wolt/Bolt od 9,00 €.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Bottom info */}
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a
              href="https://wolt.com/sk/svk/hlohovec/restaurant/spilka-terasa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Objednať cez Wolt <ChevronRight className="w-4 h-4" />
            </a>
            <span className="hidden sm:inline text-muted-foreground/30">|</span>
            <a
              href="https://food.bolt.eu/sk-SK/delivery/hlohovec/spilka-teras"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Objednať cez Bolt Food <ChevronRight className="w-4 h-4" />
            </a>
            <span className="hidden sm:inline text-muted-foreground/30">|</span>
            <a
              href="tel:+421914105500"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <Phone className="w-4 h-4" />
              Vlastný rozvoz: 0914 105 500
            </a>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
