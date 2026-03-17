"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShopFlowLogo } from "@/components/ShopFlowLogo";
import { Check, UserPlus, Clock, PartyPopper, ChevronRight, ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("");
  const router = useRouter();

  // Form states
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [techEmails, setTechEmails] = useState<string[]>([]);
  const [currentTechEmail, setCurrentTechEmail] = useState("");

  useEffect(() => {
    fetch("/api/onboarding")
      .then(res => res.json())
      .then(data => {
        if (data.onboardingStep) {
          setStep(data.onboardingStep);
          setShopName(data.name);
        }
        setLoading(false);
      });
  }, []);

  const nextStep = async (data: any = {}) => {
    setLoading(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, data }),
      });
      setStep(prev => prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 0) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">Cargando...</div>;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Cuéntanos sobre {shopName}</h2>
              <p className="text-muted-foreground text-sm">Completa los detalles básicos de tu taller.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Dirección</Label>
                <Input 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle Ejemplo 123"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Teléfono</Label>
                <Input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <Button onClick={() => nextStep({ address, phone })} className="w-full bg-primary py-6" disabled={loading}>
              Siguiente <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Tu Equipo</h2>
              <p className="text-muted-foreground text-sm">Invita a tus técnicos para empezar a asignar trabajos.</p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={currentTechEmail}
                  onChange={(e) => setCurrentTechEmail(e.target.value)}
                  placeholder="tecnico@ejemplo.com"
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button onClick={() => {
                  if (currentTechEmail) {
                    setTechEmails([...techEmails, currentTechEmail]);
                    setCurrentTechEmail("");
                  }
                }} variant="secondary">Añadir</Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {techEmails.map((email, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/10 text-sm text-white">
                    {email}
                    <button onClick={() => setTechEmails(techEmails.filter((_, idx) => idx !== i))} className="text-destructive text-xs">Eliminar</button>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={() => nextStep({ technicians: techEmails })} className="w-full bg-primary py-6" disabled={loading}>
              Siguiente <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Horarios de Apertura</h2>
              <p className="text-muted-foreground text-sm">Configura cuándo está abierto tu taller.</p>
            </div>
            <div className="space-y-3">
              {["Lunes - Viernes", "Sábado", "Domingo"].map((day) => (
                <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white text-sm font-medium">{day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{day === "Domingo" ? "Cerrado" : "09:00 - 18:00"}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => nextStep()} className="w-full bg-primary py-6" disabled={loading}>
              Finalizar Configuración <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center flex-col items-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                <PartyPopper className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white">¡Todo listo, {shopName}!</h2>
              <p className="text-muted-foreground">Tu taller ya está configurado. Es hora de llevar tu negocio al siguiente nivel.</p>
            </div>
            <Button onClick={() => router.push("/dashboard")} className="w-full bg-primary py-8 text-lg font-bold" disabled={loading}>
              Ir al Dashboard
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 font-sans antialiased">
      <div className="w-full max-w-xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShopFlowLogo size={32} />
            <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>ShopFlow</span>
          </div>
          <div className="text-xs text-muted-foreground">Paso {Math.min(step, 4)} de 4</div>
        </div>
        
        <Progress value={progress} className="h-1 bg-white/10" />

        <Card className="border-border/50 bg-[#121212]/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
