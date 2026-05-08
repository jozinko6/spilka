"use client";

import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  Soup,
  UtensilsCrossed,
  Star,
  Flame,
  Salad,
  Utensils,
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  weight?: string | null;
  allergens?: string | null;
  badge?: string | null;
  isNew: boolean;
  order: number;
  active: boolean;
}

interface MenuCategory {
  id: string;
  title: string;
  slug: string;
  icon: string;
  order: number;
  items: MenuItem[];
}

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

function MenuSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-48 h-7 rounded" />
      </div>
      <div className="bg-card rounded-xl border border-border/40 p-4 md:p-6 shadow-sm space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 py-4 border-b border-border/40 last:border-b-0">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FoodMenu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data: MenuCategory[]) => {
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[0].slug);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

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

        {loading ? (
          <>
            {/* Skeleton Tabs */}
            <div className="hidden md:flex items-center justify-center gap-2 mb-10 flex-wrap">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-32 rounded-full" />
              ))}
            </div>
            <MenuSkeleton />
          </>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nepodarilo sa načítať jedálny lístok</p>
          </div>
        ) : (
          <>
            {/* Category Tabs - Desktop */}
            <FadeIn delay={0.1}>
              <div className="hidden md:flex items-center justify-center gap-2 mb-10 flex-wrap">
                {categories.map((cat) => {
                  const IconComponent = iconMap[cat.icon] || Utensils;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.slug);
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeCategory === cat.slug
                          ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
                          : "bg-card text-muted-foreground hover:bg-accent/10 hover:text-accent border border-border/50"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {cat.title}
                    </button>
                  );
                })}
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
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
            </FadeIn>

            {/* Menu Content */}
            <FadeIn delay={0.2}>
              <div className="max-w-4xl mx-auto">
                {categories.map((cat) => {
                  const IconComponent = iconMap[cat.icon] || Utensils;
                  return (
                    <div
                      key={cat.id}
                      className={
                        activeCategory === cat.slug ? "block" : "hidden"
                      }
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {cat.title}
                        </h3>
                      </div>
                      <div className="bg-card rounded-xl border border-border/40 p-4 md:p-6 shadow-sm">
                        {cat.items.map((item) => (
                          <MenuItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  );
                })}
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
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
