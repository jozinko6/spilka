"use client";

import Image from "next/image";
import { Beer, Award, Droplets } from "lucide-react";
import { SectionWrapper, FadeIn } from "@/components/section-wrapper";
import { Badge } from "@/components/ui/badge";

export function BeerSection() {
  return (
    <SectionWrapper id="pivo" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/spilka-tanks.jpg"
          alt="Pivné tanky Svijany 450 v SPILKA Terasa"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <FadeIn direction="left">
            <div className="flex items-center gap-3 mb-6">
              <Beer className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
                Naše pivo
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Svijany{" "}
              <span className="text-accent">450</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-6">
              Premium ležiak z pivovaru Svijany — <strong className="text-white">exkluzívne na
              Slovensku</strong> len v SPILKA reštauráciách. Tankové,
              nepasterizované pivo, ktoré si zaslúži tento názov.
            </p>
            <p className="text-white/60 text-base leading-relaxed mb-8">
              Číslo 450 nie je náhoda. Je to nadmorská výška mesta Svijany,
              kde sa toto výnimočné pivo varí už stáročia. A teraz ho môžete
              ochutnať v Hlohovci.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2 text-sm">
                <Award className="w-4 h-4 mr-2" />
                Exkluzívne na Slovensku
              </Badge>
              <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2 text-sm">
                <Droplets className="w-4 h-4 mr-2" />
                Tankové pivo
              </Badge>
              <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2 text-sm">
                <Beer className="w-4 h-4 mr-2" />
                Nepasterizované
              </Badge>
            </div>
          </FadeIn>

          {/* Right side - decorative element */}
          <FadeIn direction="right" delay={0.2}>
            <div className="relative flex items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full bg-accent/10 border-2 border-accent/20" />
                <div className="absolute inset-4 rounded-full bg-accent/5 border border-accent/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl md:text-7xl font-bold text-accent">
                      450
                    </span>
                    <p className="text-white/60 text-sm mt-2 tracking-widest uppercase">
                      Nadmorská výška
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      m.n.m. Svijany
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </SectionWrapper>
  );
}
