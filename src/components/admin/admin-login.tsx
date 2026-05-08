"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAdminStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Vyplňte všetky polia");
      return;
    }
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (!success) {
      toast.error("Neplatné meno alebo heslo");
    } else {
      toast.success("Úspešne prihlásený");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-amber-200/50">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-gold/10 flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7 text-amber-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-warm-dark">
            SPILKA Terasa
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Prihlásenie do administrácie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Meno</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-gold hover:bg-amber-gold/90 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Prihlasujem...
                </>
              ) : (
                "Prihlásiť sa"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
