"use client";

import Image from "next/image";
import { Beer, UtensilsCrossed, Gem } from "lucide-react";
import { SectionWrapper, FadeIn } from "@/components/section-wrapper";

export function About() {
  return (
    <SectionWrapper
      id="o-nas"
      className="py-16 md:py-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Side */}
          <FadeIn direction="left">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent" />
              <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
                O nás
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Tradičná kuchyňa,{" "}
              <span className="text-accent">moderný duch</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
              SPILKA Terasa prináša do Hlohovca jedinečné spojenie tradičnej
              slovenskej kuchyne a moderných gastronomických trendov. Naše
              jedlá pripravujeme z kvalitných surovín s rešpektom k tradícii a
              zároveň s odvahou experimentovať.
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              Interiér reštaurácie je dielom remeselnej práce — masívne drevo,
              kov, sklo a kameň vytvárajú priestor, v ktorom sa snúbia
              útulnosť s eleganciou. Nádherné pivné tanky a keramické obklady
              dotvárajú atmosféru, ktorú nenájdete nikde inde.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    Kvalitná kuchyňa
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Čerstvé suroviny
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Beer className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    Svijany 450
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Exkluzívne na Slovensku
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Gem className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    Unikátny interiér
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Drevo, kov, kameň
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Image Side */}
          <FadeIn direction="right" delay={0.2}>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/terrace.png"
                  alt="SPILKA Terasa - terasa"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Decorative accent corner */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-accent/30 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 border-2 border-accent/20 rounded-xl -z-10" />
            </div>
          </FadeIn>
        </div>
      </div>
    </SectionWrapper>
  );
}
