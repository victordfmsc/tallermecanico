import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="mt-20 py-8 border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#555555]">
        <div className="flex gap-6">
          <Link href="/legal/politica-de-privacidad" className="hover:text-primary transition-colors">Privacidad RGPD</Link>
          <Link href="/legal/terminos-de-servicio" className="hover:text-primary transition-colors">Términos B2B</Link>
          <Link href="/legal/politica-de-cookies" className="hover:text-primary transition-colors">Cookies</Link>
        </div>
        <div>
          © 2026 ShopFlow. Versión Profesional v1.4
        </div>
      </div>
    </footer>
  );
}
