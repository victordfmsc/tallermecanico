"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShopFlowLogo } from "@/components/ShopFlowLogo";
import { Clock, Lock } from "lucide-react";

export default function TrialExpiredPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 font-sans antialiased">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <ShopFlowLogo size={48} />
          <h1 className="text-3xl font-bold tracking-tight text-white mt-4" style={{ fontFamily: "var(--font-display)" }}>
            Tu prueba ha finalizado
          </h1>
          <p className="text-muted-foreground">
            Esperamos que hayas disfrutado de la experiencia ShopFlow.
          </p>
        </div>

        <Card className="border-border/50 bg-[#121212]/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-xl text-white">Acceso restringido</CardTitle>
            <CardDescription>
              Tus 14 días de prueba gratuita han terminado. Para continuar gestionando tu taller, activa una suscripción.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4 flex items-start gap-3">
              <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                Tus datos siguen seguros. Una vez actives un plan, recuperarás el acceso completo a tu inventario, clientes y órdenes de trabajo.
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6">
              <Link href="/billing">Ver Planes de Suscripción</Link>
            </Button>
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-white">
              <Link href="/login">Volver al inicio</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
