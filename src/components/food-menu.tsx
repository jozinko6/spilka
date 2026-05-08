"use client";

import { useState } from "react";
import {
  Soup,
  UtensilsCrossed,
  Star,
  Flame,
  Salad,
  Utensils,
} from "lucide-react";
import { SectionWrapper, FadeIn } from "@/components/section-wrapper";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  weight?: string;
  allergens?: string;
  badge?: string;
  isNew?: boolean;
}

interface MenuCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    id: "polievky",
    icon: Soup,
    title: "Polievky",
    items: [
      {
        name: "Slepačí vývar s rezancami a mäsom",
        description: "Tradičný vývar s koreňovou zeleninou, domácimi rezancami a kúskami mäsa",
        price: "3,49",
        weight: "0,33 l",
        allergens: "1, 3, 9",
      },
      {
        name: "Tradičná Jókai fazuľová polievka",
        description: "Krémová fazuľová polievka s pivným praclíkom a kyslou smotanou",
        price: "6,40",
        weight: "0,33 l",
        allergens: "1, 3, 9",
        badge: "Obľúbené",
      },
      {
        name: "Krémová polievka z medvedieho cesnaku",
        description: "Sezónna špecialita z čerstvého medvedieho cesnaku s krutónmi",
        price: "5,00",
        weight: "0,33 l",
        allergens: "7, 9",
        badge: "Sezónne",
      },
      {
        name: "Cesnakový krém so syrovým krutónom",
        description: "Krémová cesnaková polievka s chrumkavým syrovým krutónom",
        price: "3,99",
        weight: "0,25 l",
        allergens: "1, 3, 7, 9",
      },
      {
        name: "Gulášová polievka s chlebom",
        description: "Hustá gulášová polievka s kúskami mäsa a čerstvým chlebom",
        price: "3,99",
        weight: "0,25 l",
        allergens: "1, 3, 7, 9",
      },
    ],
  },
  {
    id: "hlavne",
    icon: UtensilsCrossed,
    title: "Hlavné jedlá",
    items: [
      {
        name: 'Rezňové "stripy"',
        description: "Podľa výberu bravčové alebo kuracie mäso, chrumkavé obalené prsia s prílohou",
        price: "8,90",
        weight: "200 g",
        allergens: "1, 3",
      },
      {
        name: "Kurací steak na bylinkovom masle",
        description: "Grilovaný kurací steak s pečenými baby zemiakmi a bylinkovým maslom",
        price: "9,90",
        weight: "120/200 g",
        allergens: "7",
      },
      {
        name: "Kuracie obaľované krídla",
        description: "Chrumkavé kuracie krídla s varenými zemiakmi alebo hranolkami a tzatziki dipom",
        price: "9,50",
        weight: "250 g",
        allergens: "1, 3, 7",
      },
      {
        name: "Francúzske zemiaky",
        description: "Tradičné francúzske zemiaky so šunkou, syrom a kyslou smotanou",
        price: "7,90",
        weight: "300 g",
        allergens: "1, 3, 7, 12",
      },
      {
        name: "Bravčová panenka so slivkovou omáčkou",
        description: "Grilovaná bravčová panenka s domácou slivkovou omáčkou a opekanými zemiakmi",
        price: "11,90",
        weight: "150 g",
        allergens: "1, 7",
        badge: "Tip šéfkuchára",
      },
      {
        name: "Pečené kuracie stehno so žemľovou plnkou",
        description: "Dusené kuracie stehno s tradičnou žemľovou plnkou a dusenou ryžou",
        price: "8,50",
        weight: "250 g",
        allergens: "1, 3, 7",
      },
    ],
  },
  {
    id: "spilka-speciality",
    icon: Star,
    title: "Spilka špeciality",
    items: [
      {
        name: "Hovädzí burger s hranolkami a chedar omáčkou",
        description: "Ručne tvarovaný hovädzí burger s ľadovým šalátom, cibuľkou a horčicovou omáčkou",
        price: "13,90",
        weight: "120/150 g",
        allergens: "1, 3, 7, 10, 11",
        badge: "Bestseller",
      },
      {
        name: "Jemne pikantné kuracie krídla s hranolkami",
        description: "Marinované kuracie krídla v pikantnej omáčke s chrumkavými hranolkami",
        price: "11,90",
        weight: "250/150 g",
        allergens: "1, 3",
        isNew: true,
      },
      {
        name: "Grilovaný flank steak s chimichurri",
        description: "Hovädzí flank steak s domácim chimichurri a opekanými zemiakmi",
        price: "15,90",
        weight: "200 g",
        allergens: "7",
        badge: "Tip šéfkuchára",
      },
      {
        name: "SPILKA rezeň",
        description: "Naša vlastná verzia klasického rezňa — extra tenký, chrumkavý a šťavnatý",
        price: "10,90",
        weight: "200 g",
        allergens: "1, 3",
      },
    ],
  },
  {
    id: "flammkuchen",
    icon: Flame,
    title: "Flammkuchen",
    items: [
      {
        name: "Flammkuchen slanina, cibuľa",
        description: "Tradičný flammkuchen s chrumkavou slaninou a karamelizovanou cibuľou",
        price: "9,90",
        weight: "250 g",
        allergens: "1, 3, 7, 12",
        badge: "Klasika",
      },
      {
        name: "Flammkuchen paradajky, rukola",
        description: "Vegetariánsky flammkuchen so čerstvými paradajkami a rukolou",
        price: "9,90",
        weight: "250 g",
        allergens: "1, 3, 7",
      },
      {
        name: "Flammkuchen s jablkami a škoricou",
        description: "Sladký flammkuchen s jablkami, škoricou a práškovým cukrom",
        price: "8,90",
        weight: "250 g",
        allergens: "1, 3, 7",
        isNew: true,
      },
    ],
  },
  {
    id: "salaty",
    icon: Salad,
    title: "Šaláty",
    items: [
      {
        name: "Cézar šalát s kuracím mäsom",
        description: "Čerstvý ľadový šalát s grilovaným kuracím mäsom, parmazánom a croutonmi",
        price: "9,90",
        weight: "300 g",
        allergens: "1, 3, 7, 12",
      },
      {
        name: "Grécky šalát",
        description: "Klasický grécky šalát s feta syrom, olivami a čerstvou zeleninou",
        price: "7,90",
        weight: "280 g",
        allergens: "7",
      },
      {
        name: "Šalát s grilovaným hermelínom",
        description: "Mix šalátov s grilovaným hermelínom, orechami a brusnicami",
        price: "9,50",
        weight: "280 g",
        allergens: "1, 3, 7, 8",
        badge: "Obľúbené",
      },
    ],
  },
  {
    id: "prilohy",
    icon: Utensils,
    title: "Prílohy & Dezerty",
    items: [
      {
        name: "Hranolky",
        description: "Chrumkavé zemiakové hranolky",
        price: "2,90",
        weight: "200 g",
        allergens: "1",
      },
      {
        name: "Batátové hranolky",
        description: "Sladké batátové hranolky",
        price: "3,50",
        weight: "200 g",
        allergens: "1",
      },
      {
        name: "Cibuľové krúžky s dipom",
        description: "Chrumkavé cibuľové krúžky s dipom podľa výberu",
        price: "3,90",
        weight: "200 g",
        allergens: "1, 3, 10, 12",
      },
      {
        name: "Varené zemiaky na masle",
        description: "Mäkké varené zemiaky s maslom a petržlenovou vňaťou",
        price: "2,50",
        weight: "200 g",
        allergens: "7",
      },
      {
        name: "Opekané zemiaky",
        description: "Opekané zemiaky s cibuľou a slaninou",
        price: "3,50",
        weight: "200 g",
        allergens: "1, 7",
      },
      {
        name: "Domáci čokoládový koláč",
        description: "Belgický čokoládový koláč s vanilkovou zmrzlinou",
        price: "4,90",
        weight: "150 g",
        allergens: "1, 3, 7, 8",
      },
      {
        name: "Palačinky s tvarohom",
        description: "Jemné palačinky plnené sladkým tvarohom a ovocím",
        price: "4,50",
        weight: "200 g",
        allergens: "1, 3, 7",
      },
    ],
  },
];

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="group flex items-start gap-4 py-4 border-b border-border/40 last:border-b-0 hover:bg-accent/5 px-3 -mx-3 rounded-lg transition-colors duration-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold text-foreground text-base">
            {item.name}
          </h4>
          {item.badge && (
            <Badge
              variant="secondary"
              className="bg-accent/15 text-accent text-[10px] px-2 py-0 h-5 border-0"
            >
              {item.badge}
            </Badge>
          )}
          {item.isNew && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 text-[10px] px-2 py-0 h-5 border-0"
            >
              Novinka
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground/70">
          {item.weight && <span>{item.weight}</span>}
          {item.allergens && (
            <span>Alergény: {item.allergens}</span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="text-lg font-bold text-accent">{item.price} €</span>
      </div>
    </div>
  );
}

export function FoodMenu() {
  const [activeCategory, setActiveCategory] = useState("polievky");

  return (
    <SectionWrapper id="jedalny-listok" className="py-16 md:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
              Jedálny lístok
            </span>
            <div className="h-px w-8 bg-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Naša <span className="text-accent">ponuka</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Od domácich polievok cez naše slávne flammkuchen až po Spilka špeciality
            — každé jedlo pripravujeme z čerstvých surovín s láskou.
          </p>
        </div>

        {/* Category Tabs - Desktop */}
        <FadeIn delay={0.1}>
          <div className="hidden md:flex items-center justify-center gap-2 mb-10 flex-wrap">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
                    : "bg-card text-muted-foreground hover:bg-accent/10 hover:text-accent border border-border/50"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.title}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Category Tabs - Mobile */}
        <FadeIn delay={0.1}>
          <div className="md:hidden mb-8">
            <select
              value={activeCategory}
              onChange={(e) => {
                setActiveCategory(e.target.value);
              }}
              className="w-full bg-card border border-border/50 rounded-lg px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {menuCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </FadeIn>

        {/* Menu Content */}
        <FadeIn delay={0.2}>
          <div className="max-w-4xl mx-auto">
            {menuCategories.map((cat) => (
              <div
                key={cat.id}
                className={
                  activeCategory === cat.id ? "block" : "hidden"
                }
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {cat.title}
                  </h3>
                </div>
                <div className="bg-card rounded-xl border border-border/40 p-4 md:p-6 shadow-sm">
                  {cat.items.map((item, idx) => (
                    <MenuItemCard key={idx} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Dietary badges */}
        <FadeIn delay={0.3}>
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
            <span className="px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
              🔥 Sezónne špeciality
            </span>
          </div>
        </FadeIn>

        {/* Note */}
        <FadeIn delay={0.4}>
          <p className="text-center text-muted-foreground/60 text-xs mt-6 max-w-lg mx-auto">
            Ponuka jedál sa môže sezónne meniť. Kompletný jedálny lístok
            s aktuálnymi cenami nájdete aj na Wolt a Bolt Food.
            Pri alergiách sa informujte u obsluhy.
          </p>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
