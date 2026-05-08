"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SectionWrapper, FadeIn } from "@/components/section-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  label: string | null;
  order: number;
  active: boolean;
}

function GallerySkeleton() {
  return (
    <div className="gallery-scroll overflow-x-auto pb-4">
      <div className="flex gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ minWidth: "max-content" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-72 sm:w-80 md:w-96 h-56 sm:h-64 md:h-72 rounded-xl overflow-hidden"
          >
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data: GalleryImage[]) => {
        setImages(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

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
      {loading ? (
        <GallerySkeleton />
      ) : error || images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {error ? "Nepodarilo sa načítať galériu" : "Momentálne žiadne obrázky"}
          </p>
        </div>
      ) : (
        <FadeIn>
          <div className="gallery-scroll overflow-x-auto pb-4">
            <div className="flex gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ minWidth: "max-content" }}>
              {images.map((image) => (
                <div
                  key={image.id}
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
                    {image.label && (
                      <p className="text-white font-semibold text-sm">
                        {image.label}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </SectionWrapper>
  );
}
