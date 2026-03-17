"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function TrialBanner() {
  const { data: session } = useSession();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user && (session.user as any).subscriptionStatus === "FREE_TRIAL") {
      const trialEndsAt = (session.user as any).trialEndsAt;
      if (trialEndsAt) {
        const diff = new Date(trialEndsAt).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setDaysLeft(days);
      }
    }
  }, [session]);

  if (daysLeft === null || daysLeft < 0) return null;
  if ((session?.user as any).subscriptionStatus !== "FREE_TRIAL") return null;

  const isUrgent = daysLeft <= 3;

  return (
    <div className={`w-full px-4 py-2 flex items-center justify-between border-b shadow-sm animate-in slide-in-from-top duration-500 ${
      isUrgent 
      ? "bg-orange-500/10 border-orange-500/20 text-orange-500" 
      : "bg-primary/10 border-primary/20 text-primary"
    }`}>
      <div className="flex items-center gap-3">
        {isUrgent ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
        <p className="text-sm font-medium">
          {isUrgent 
            ? `¡Tu prueba gratuita termina pronto! Quedan ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'}.`
            : `Estás usando la prueba gratuita de ShopFlow. Te quedan ${daysLeft} días.`
          }
        </p>
      </div>
      <Button asChild variant="ghost" size="sm" className={
        isUrgent 
        ? "bg-orange-500 text-white hover:bg-orange-600 font-bold" 
        : "bg-primary text-white hover:bg-primary/90 font-bold"
      }>
        <Link href="/billing">Elegir Plan</Link>
      </Button>
    </div>
  );
}
