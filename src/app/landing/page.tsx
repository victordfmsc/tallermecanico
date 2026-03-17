"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Camera, 
  Plus,
  Play,
  Star,
  ArrowRight,
  Menu,
  X,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { CookieBanner } from "@/components/legal/CookieBanner";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      title: "Órdenes de Trabajo Digitales",
      description: "Elimina el papel. Crea, asigna y gestiona reparaciones en tiempo real desde cualquier dispositivo.",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Inspecciones con Fotos (DVI)",
      description: "Genera confianza enviando informes visuales de alta calidad directamente al WhatsApp de tus clientes.",
      icon: Camera,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Presupuestos vía WhatsApp",
      description: "Tus clientes aprueban presupuestos con un solo clic. Sin llamadas perdidas, sin esperas.",
      icon: MessageSquare,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Facturación en 1 Clic",
      description: "Convierte órdenes de trabajo en facturas legales al instante. Integrado con pagos online.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Marketing Automatizado",
      description: "Recupera clientes inactivos y aumenta la recurrencia con campañas de SMS y Email inteligentes.",
      icon: Phone,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Informes de Rentabilidad",
      description: "Visualiza tus ingresos, eficiencia de técnicos y stock en dashboards potentes e intuitivos.",
      icon: BarChart3,
      color: "text-pink-500",
      bg: "bg-pink-500/10"
    }
  ];

  const testimonials = [
    {
      name: "Talleres García",
      location: "Madrid",
      quote: "Desde que usamos ShopFlow, la aprobación de presupuestos es un 40% más rápida. Los clientes valoran muchísimo las fotos de las averías.",
      author: "Carlos García, Propietario"
    },
    {
      name: "AutoSport Levante",
      location: "Valencia",
      quote: "ShopFlow nos ha permitido digitalizar todo el taller en menos de una semana. La facturación integrada nos ahorra horas de gestión administrativa.",
      author: "Marta Ruiz, Gerente"
    },
    {
      name: "Mecánica Central",
      location: "Sevilla",
      quote: "El sistema de marketing automatizado ha traído de vuelta a clientes que no veíamos en meses. Es como tener un comercial 24/7.",
      author: "José Antonio Pérez, Jefe de Taller"
    }
  ];

  const faqs = [
    {
      q: "¿Es realmente gratis durante 14 días?",
      a: "Sí, puedes probar todas las funcionalidades del plan Professional sin compromiso. No requerimos tarjeta de crédito para empezar."
    },
    {
      q: "¿Puedo migrar mis datos de otro software?",
      a: "Nuestro equipo técnico te ayuda a importar tus clientes, vehículos y stock de forma gratuita para que no pierdas ni un minuto."
    },
    {
      q: "¿Funcionan las órdenes de trabajo sin internet?",
      a: "ShopFlow está basado en la nube para sincronización en tiempo real, pero permite crear bocetos que se guardan localmente si pierdes la conexión."
    },
    {
      q: "¿Cómo funciona el envío por WhatsApp?",
      a: "Generamos un enlace único y seguro para cada inspección o presupuesto que puedes enviar con un botón directamente al WhatsApp de tu cliente."
    },
    {
      q: "¿Es legal la facturación electrónica?",
      a: "Sí, ShopFlow cumple con la normativa de facturación española vigente, incluyendo los requisitos de la Ley Antifraude."
    },
    {
      q: "¿Puedo acceder desde el móvil?",
      a: "Absolutamente. ShopFlow es una aplicación web progresiva optimizada para tablets y smartphones, ideal para usar directamente bajo el elevador."
    }
  ];

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-primary selection:text-white">
      <CookieBanner />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter italic">ShopFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Características</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Precios</Link>
            <Link href="#testimonials" className="hover:text-primary transition-colors">Testimonios</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Acceder</Link>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white px-6">
              <Link href="/register">Empezar Gratis</Link>
            </Button>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0f0f0f] border-b border-white/5 p-4 space-y-4 text-center pb-8 animate-in slide-in-from-top duration-300">
            <Link href="#features" className="block text-sm font-bold uppercase tracking-widest py-2" onClick={() => setIsMenuOpen(false)}>Características</Link>
            <Link href="#pricing" className="block text-sm font-bold uppercase tracking-widest py-2" onClick={() => setIsMenuOpen(false)}>Precios</Link>
            <Link href="/login" className="block text-sm font-bold uppercase tracking-widest py-2">Acceder</Link>
            <Button asChild className="w-full bg-primary py-6">
              <Link href="/register">Probar 14 días gratis</Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary py-1 px-4 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Aumenta tu rentabilidad hoy
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic max-w-5xl mx-auto">
            Gestiona tu taller mecánico <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.8)' }}>como los grandes</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            La plataforma definitiva para digitalizar tu negocio: ahorra tiempos administrativos, 
            elimina el papel y fideliza a tus clientes con inspecciones visuales profesionales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white text-lg font-black uppercase tracking-widest h-16 px-10 shadow-[0_0_30px_rgba(232,92,26,0.3)]">
              <Link href="/register">Empezar gratis 14 días</Link>
            </Button>
            <Button variant="outline" className="text-lg font-bold uppercase tracking-widest h-16 px-10 border-white/10 hover:bg-white/5">
              <Play className="h-5 w-5 mr-3 fill-white" /> Ver Demo
            </Button>
          </div>

          <div className="mt-20 relative px-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 blur-[100px] opacity-20 -z-10" />
            <div className="relative rounded-2xl border border-white/10 bg-[#121212] overflow-hidden shadow-2xl p-2 md:p-4 rotate-x-2 perspective-1000">
              <Image 
                src="/images/dashboard_mockup.png" 
                alt="ShopFlow Dashboard Mockup" 
                width={1200} 
                height={675}
                className="rounded-xl shadow-inner border border-white/5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Potencia sin complicaciones</h2>
            <p className="text-muted-foreground font-medium">Todo lo necesario para llevar tu taller al siguiente nivel digital.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="bg-[#121212] border-white/10 hover:border-primary/30 transition-all group overflow-hidden">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${f.bg} ${f.color}`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tighter leading-tight italic">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Planes para cada etapa</h2>
            <p className="text-muted-foreground font-medium">Escala tu negocio sin miedos con precios transparentes.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Starter */}
            <Card className="bg-[#121212] border-white/10 flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-sm font-bold bg-white/5 py-1 px-3 rounded-full inline-block mb-4 text-muted-foreground uppercase tracking-widest italic">Starter</CardTitle>
                <div className="flex items-end justify-center gap-1 my-4">
                  <span className="text-5xl font-black">29€</span>
                  <span className="text-muted-foreground text-sm font-bold mb-2 uppercase">/mes</span>
                </div>
                <CardDescription className="font-medium">Para talleres pequeños que empiezan su digitalización.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  {[
                    "Hasta 2 técnicos",
                    "Expedientes digitales ilimitados",
                    "Inspecciones visuales básicas",
                    "Facturación estándar"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-white/5">
                <Button className="w-full bg-white/5 border border-white/10 text-white font-bold h-12 hover:bg-white/10">Contratar Starter</Button>
              </CardFooter>
            </Card>

            {/* Professional */}
            <Card className="bg-[#121212] border-primary/40 relative shadow-[0_0_50px_rgba(232,92,26,0.1)] flex flex-col scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] py-1 px-4 rounded-full italic">Popular</div>
              <CardHeader className="text-center">
                <CardTitle className="text-sm font-bold bg-primary/10 py-1 px-3 rounded-full inline-block mb-4 text-primary uppercase tracking-widest italic">Professional</CardTitle>
                <div className="flex items-end justify-center gap-1 my-4">
                  <span className="text-5xl font-black text-white">59€</span>
                  <span className="text-muted-foreground text-sm font-bold mb-2 uppercase">/mes</span>
                </div>
                <CardDescription className="text-muted-foreground font-medium">Potencia tu flujo de trabajo con automatizaciones reales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  {[
                    "Hasta 8 técnicos",
                    "Plantillas de Inspección (DVI)",
                    "Aprobaciones vía WhatsApp",
                    "Marketing Automático (Credits Inc.)",
                    "API & Integraciones"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm font-bold">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-white/5">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14">Probar 14 días Gratis</Button>
              </CardFooter>
            </Card>

            {/* Enterprise */}
            <Card className="bg-[#121212] border-white/10 flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-sm font-bold bg-white/5 py-1 px-3 rounded-full inline-block mb-4 text-muted-foreground uppercase tracking-widest italic">Enterprise</CardTitle>
                <div className="flex items-end justify-center gap-1 my-4">
                  <span className="text-5xl font-black text-white">99€</span>
                  <span className="text-muted-foreground text-sm font-bold mb-2 uppercase">/mes</span>
                </div>
                <CardDescription className="font-medium">Para talleres multi-sede o grandes empresas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  {[
                    "Técnicos ilimitados",
                    "Múltiples localizaciones",
                    "Informes personalizados (BI)",
                    "Soporte prioritario 24/7",
                    "Formación in-situ"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-white/5">
                <Button className="w-full bg-white/5 border border-white/10 text-white font-bold h-12 hover:bg-white/10">Consultar Empresa</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 italic">
            {testimonials.map((t, i) => (
              <div key={i} className="space-y-4 relative">
                <div className="text-primary opacity-20 absolute -top-4 -left-4 text-6xl">"</div>
                <p className="text-lg font-medium leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black">{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tighter">{t.author}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t.name}, {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-12 text-center">Preguntas Frecuentes</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/5 px-6 bg-[#121212] rounded-xl">
                <AccordionTrigger className="hover:no-underline font-bold text-left py-6">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-medium pb-6 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-primary rounded-[2rem] p-12 text-center space-y-8 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(232,92,26,0.3)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">Digitaliza tu taller hoy</h2>
          <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">Únete a cientos de talleres que ya operan con máxima eficiencia. Empezar es gratis y solo te llevará 2 minutos.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild className="bg-white text-primary hover:bg-white/90 text-lg font-black uppercase tracking-widest h-16 px-10">
              <Link href="/register">Crear mi cuenta gratis</Link>
            </Button>
            <Button variant="outline" className="text-lg font-bold uppercase tracking-widest h-16 px-10 border-white/20 hover:bg-white/10">
              Contacto ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary fill-primary" />
            <span className="text-xl font-black uppercase tracking-tighter italic">ShopFlow</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Link href="/legal/politica-de-privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/legal/terminos-de-servicio" className="hover:text-white transition-colors">Términos</Link>
            <Link href="/legal/politica-de-cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
          <div className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">
            © 2026 ShopFlow. Made with passion for workshops.
          </div>
        </div>
      </footer>
    </div>
  );
}
