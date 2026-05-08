"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  PartyPopper,
  Briefcase,
  Music,
  Target,
  Users,
  CalendarDays,
  Clock,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SectionWrapper,
  StaggerContainer,
  StaggerItem,
  FadeIn,
} from "@/components/section-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string | null;
  description: string | null;
  organizer: string | null;
  type: string;
  active: boolean;
}

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

const eventTypeConfig: Record<
  string,
  { label: string; bgClass: string; textClass: string }
> = {
  quiz: {
    label: "Kvíz",
    bgClass: "bg-purple-100",
    textClass: "text-purple-700",
  },
  music: {
    label: "Hudba",
    bgClass: "bg-blue-100",
    textClass: "text-blue-700",
  },
  valentine: {
    label: "Valentín",
    bgClass: "bg-pink-100",
    textClass: "text-pink-700",
  },
  other: {
    label: "Ostatné",
    bgClass: "bg-gray-100",
    textClass: "text-gray-700",
  },
};

const skMonths = [
  "januára",
  "februára",
  "marca",
  "apríla",
  "mája",
  "júna",
  "júla",
  "augusta",
  "septembra",
  "októbra",
  "novembra",
  "decembra",
];

function formatDateSk(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDate();
  const month = skMonths[date.getMonth()];
  return `${day}. ${month}`;
}

export function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data: EventItem[]) => {
        // Filter future events and sort by date ascending
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const future = data
          .filter((e) => new Date(e.date + "T00:00:00") >= today)
          .sort((a, b) => a.date.localeCompare(b.date));
        setEvents(future);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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

        {/* Upcoming Events Section */}
        <FadeIn delay={0.3}>
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-accent" />
              <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
                Nadchádzajúce akcie
              </span>
              <div className="h-px flex-1 bg-border/30" />
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-3/4 rounded" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-4 w-20 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-lg">
                  Momentálne žiadne naplánované akcie
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => {
                  const typeConf =
                    eventTypeConfig[event.type] || eventTypeConfig.other;
                  return (
                    <Card
                      key={event.id}
                      className="group border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            className={`${typeConf.bgClass} ${typeConf.textClass} text-[10px] px-2 py-0 h-5 border-0`}
                          >
                            {typeConf.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground/70">
                            {formatDateSk(event.date)}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          {event.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {event.time}
                            </span>
                          )}
                          {event.organizer && (
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {event.organizer}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
