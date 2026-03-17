"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setCookie, getCookie } from "cookies-next";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie("sf_consent");
    if (!consent) {
      // Delay visibility for a smoother entrance
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (level: "all" | "necessary") => {
    setCookie("sf_consent", level, { maxAge: 60 * 60 * 24 * 365, path: "/" });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-8 animate-in slide-in-from-bottom duration-500">
      <Card className="max-w-4xl mx-auto bg-[#121212]/95 backdrop-blur-xl border-[#E85C1A]/20 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)]">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="bg-[#E85C1A]/10 p-4 rounded-full h-fit border border-[#E85C1A]/20">
            <ShieldCheck className="h-8 w-8 text-[#E85C1A]" />
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-white leading-none">Control de Privacidad</h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl font-medium">
              Utilizamos cookies propias y de terceros para gestionar la sesión de usuario y proteger tus pagos. 
              Al aceptar, nos permites mejorar tu experiencia en ShopFlow. Consulta nuestra 
              <a href="/legal/politica-de-cookies" className="text-[#E85C1A] hover:underline mx-1">Política de Cookies</a>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 order-2 sm:order-1"
              onClick={() => handleConsent("necessary")}
            >
              Solo necesarias
            </Button>
            <Button 
              className="bg-[#E85C1A] hover:bg-[#ff6d2b] text-white font-black uppercase tracking-widest text-[10px] h-11 px-8 order-1 sm:order-2"
              onClick={() => handleConsent("all")}
            >
              Aceptar todo
            </Button>
          </div>

          <button 
            className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
