"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionWrapper, FadeIn } from "@/components/section-wrapper";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper
      id="kontakt"
      className="py-16 md:py-24 bg-secondary/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent font-medium tracking-[0.2em] text-sm uppercase">
              Kontakt
            </span>
            <div className="h-px w-8 bg-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Napíšte nám alebo{" "}
            <span className="text-accent">zavolajte</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Radi Vám pomôžeme s rezerváciou, objednávkou alebo akoukoľvek
            otázkou.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <FadeIn direction="left">
            <Card className="border-border/50">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Napíšte nám
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Meno a priezvisko *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      placeholder="Ján Novák"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        E-mail *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="jan@email.sk"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Telefón
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+421 9XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Správa *
                    </label>
                    <Textarea
                      id="message"
                      required
                      placeholder="Napíšte nám Vašu správu, rezerváciu alebo otázku..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      className="bg-background resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold h-11"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Odosiela sa...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Odoslať správu
                      </>
                    )}
                  </Button>
                  {submitStatus === "success" && (
                    <p className="text-green-600 text-sm text-center font-medium">
                      Ďakujeme! Vaša správa bola úspešne odoslaná.
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-destructive text-sm text-center font-medium">
                      Nastala chyba. Skúste to prosím znova.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn direction="right" delay={0.2}>
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Kontaktné údaje
                  </h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          Adresa
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Hollého 1, 920 01 Hlohovec
                        </p>
                        <p className="text-muted-foreground text-sm">
                          OC Viktória
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          Telefón
                        </p>
                        <p className="text-muted-foreground text-sm">
                          033/322 22 99
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Rozvoz: 0914 105 500
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          E-mail
                        </p>
                        <a
                          href="mailto:info@spilkaterasa.sk"
                          className="text-accent hover:underline text-sm"
                        >
                          info@spilkaterasa.sk
                        </a>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          Otváracie hodiny
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Pondelok – Nedeľa
                        </p>
                        <p className="text-muted-foreground text-sm font-medium">
                          11:00 – 23:30
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground text-sm mb-4">
                    Sledujte nás
                  </h4>
                  <div className="flex gap-3">
                    <a
                      href="https://facebook.com/spilkaterasa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-accent" />
                    </a>
                    <a
                      href="https://instagram.com/spilkaterasa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-accent" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="border-border/50 overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
                  <div className="relative text-center">
                    <MapPin className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-foreground font-semibold text-sm">
                      OC Viktória, Hlohovec
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Hollého 1, 920 01
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </FadeIn>
        </div>
      </div>
    </SectionWrapper>
  );
}
