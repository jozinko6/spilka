"use client";

import Image from "next/image";
import { PartyPopper, Briefcase, Music, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper, StaggerContainer, StaggerItem, FadeIn } from "@/components/section-wrapper";

const eventTypes = [
  {
    icon: PartyPopper,
    title: "Oslavy & Svatby",
    description:
      "Rodinné oslavy, narodeniny, svadobné hostiny v krásnom prostredí s výborným jedlom.",
  },
  {
    icon: Briefcase,
    title: "Firemné večierky",
    description:
      "Corporate eventy, teambuildingy, firemné večere pre Vašu firmu či kolektív.",
  },
  {
    icon: Music,
    title: "Kultúrne podujatia",
    description:
      "Koncerty, hudobné večery a kultúrne programy v unikátnom prostredí SPILKA.",
  },
  {
    icon: Target,
    title: "Šípkarske turnaje",
    description:
      "Organizujeme šípkarske súťaže a turnaje pre začiatočníkov aj pokročilých.",
  },
];

const capacities = [
  { label: "Reštaurácia", value: "100", unit: "miest" },
  { label: "Terasa", value: "80", unit: "miest" },
  { label: "Spoločenská miestnosť", value: "100", unit: "miest" },
];

export function EventsSection() {
  return (
    <SectionWrapper
      id="eventy"
      className="py-16 md:py-24 bg-secondary/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Event Cards */}
          <div>
            <FadeIn>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-accent" />
                <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
                  Eventy
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Priestor pre Vaše{" "}
                <span className="text-accent">udalosti</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mb-8">
                Od intímnych osláv po veľké spoločenské udalosti — v SPILKA
                Terasa nájdete ideálne prostredie pre každú príležitosť.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 gap-4">
              {eventTypes.map((event) => (
                <StaggerItem key={event.title}>
                  <Card className="group border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                        <event.icon className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-bold text-foreground mb-1.5">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Right - Image & Capacities */}
          <FadeIn direction="right" delay={0.2}>
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
                <Image
                  src="/images/spilka-event-room.jpg"
                  alt="SPILKA Terasa - spoločenská miestnosť"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg font-semibold">
                    Spoločenská miestnosť
                  </p>
                  <p className="text-white/70 text-sm">
                    Ideálna pre firemné aj súkromné udalosti
                  </p>
                </div>
              </div>

              {/* Capacities */}
              <div className="grid grid-cols-3 gap-4">
                {capacities.map((cap) => (
                  <div
                    key={cap.label}
                    className="text-center p-4 rounded-xl bg-card border border-border/50"
                  >
                    <Users className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">
                      {cap.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{cap.unit}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cap.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </SectionWrapper>
  );
}
