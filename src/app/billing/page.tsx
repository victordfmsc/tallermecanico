"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Clock } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "29€",
    description: "Para talleres pequeños empezando.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    features: ["Hasta 2 técnicos", "Gestión de pedidos básica", "Soporte por email"],
    color: "bg-orange-500/10 border-orange-500/20 text-orange-500",
  },
  {
    name: "Professional",
    price: "59€",
    description: "Gestión completa para talleres en crecimiento.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL,
    features: ["Hasta 8 técnicos", "CRM de clientes avanzado", "Facturación e informes", "Soporte prioritario"],
    color: "bg-primary/10 border-primary/20 text-primary",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "99€",
    description: "Potencia ilimitada para grandes talleres.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE,
    features: ["Técnicos ilimitados", "Multisucursal", "Integraciones personalizadas", "Account Manager dedicado"],
    color: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  },
];

export default function BillingPage() {
  const { data: session } = useSession();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [trialDays, setTrialDays] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user && (session.user as any).subscriptionStatus === "FREE_TRIAL") {
      const trialEndsAt = (session.user as any).trialEndsAt;
      if (trialEndsAt) {
        const diff = new Date(trialEndsAt).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setTrialDays(days > 0 ? days : 0);
      }
    }
  }, [session]);

  const handleSubscribe = async (priceId: string) => {
    setLoadingPriceId(priceId);
    try {
      const resp = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const { url, error } = await resp.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Error al iniciar el checkout.");
    } finally {
      setLoadingPriceId(null);
    }
  };

  const handlePortal = async () => {
    try {
      const resp = await fetch("/api/billing/portal", { method: "POST" });
      const { url, error } = await resp.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Error al abrir el portal de facturación.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          {trialDays !== null && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium mb-4">
              <Clock className="h-4 w-4" />
              Prueba gratuita activa: {trialDays} días restantes
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Elige el plan perfecto para tu taller
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escalabilidad real para tu negocio. Cambia de plan o cancela en cualquier momento.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="border-white/10 text-white" onClick={handlePortal}>
              Gestionar suscripción actual
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative border-border/50 bg-[#121212]/50 backdrop-blur-xl shadow-2xl transition-all hover:scale-[1.02] ${plan.popular ? 'border-primary shadow-primary/10' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Más Popular
                </div>
              )}
              <CardHeader>
                <div className={`w-fit p-2 rounded-lg ${plan.color} mb-4`}>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
                  className={`w-full py-6 font-bold ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}
                  disabled={loadingPriceId !== null}
                >
                  {loadingPriceId === plan.priceId ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Elegir plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          ¿Necesitas un plan a medida? <span className="text-primary font-semibold hover:underline cursor-pointer">Contáctanos</span>
        </div>
      </div>
    </div>
  );
}
