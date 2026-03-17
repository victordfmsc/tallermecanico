export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-primary selection:text-white">
      <nav className="h-20 border-b border-white/5 flex items-center px-8">
        <a href="/landing" className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
          <div className="bg-primary p-1 rounded cursor-pointer">
            <span className="text-white text-xs">SF</span>
          </div>
          ShopFlow
        </a>
      </nav>
      <main className="max-w-4xl mx-auto py-20 px-4">
        <div className="prose prose-invert prose-orange max-w-none">
          {children}
        </div>
      </main>
      <footer className="py-12 border-t border-white/5 text-center text-[10px] text-zinc-600 font-bold tracking-widest uppercase">
        © 2026 ShopFlow. All Rights Reserved.
      </footer>
    </div>
  );
}
