"use client";

import Image from "next/image";
import { SectionWrapper, FadeIn } from "@/components/section-wrapper";

const galleryImages = [
  {
    src: "/images/food1.png",
    alt: "Tradičné slovenské jedlo",
    label: "Tradičné jedlá",
  },
  {
    src: "/images/food2.png",
    alt: "Flammkuchen z piecky",
    label: "Flammkuchen",
  },
  {
    src: "/images/beer.png",
    alt: "Čapované pivo Svijany 450",
    label: "Svijany 450",
  },
  {
    src: "/images/terrace.png",
    alt: "Terasa reštaurácie",
    label: "Terasa",
  },
  {
    src: "/images/hero.png",
    alt: "Interiér reštaurácie",
    label: "Interiér",
  },
  {
    src: "/images/events.png",
    alt: "Spoločenská miestnosť",
    label: "Eventy",
  },
];

export function Gallery() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
              Galéria
            </span>
            <div className="h-px w-8 bg-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nahliadnite{" "}
            <span className="text-accent">dovnútra</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Atmosféra, jedlo a prostredie — to je SPILKA Terasa.
          </p>
        </div>
      </div>

      {/* Horizontal scrollable gallery */}
      <FadeIn>
        <div className="gallery-scroll overflow-x-auto pb-4">
          <div className="flex gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ minWidth: "max-content" }}>
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-72 sm:w-80 md:w-96 h-56 sm:h-64 md:h-72 rounded-xl overflow-hidden group"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-semibold text-sm">
                    {image.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}
