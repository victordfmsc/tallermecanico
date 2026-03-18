export default function CookiePolicyPage() {
  return (
    <div className="space-y-6 text-zinc-300">
      <h1 className="text-4xl font-black uppercase tracking-tighter italic text-primary">Política de Cookies</h1>
      <p>ShopFlow utiliza cookies propias y de terceros para garantizar el funcionamiento y seguridad de la plataforma.</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Cookies Utilizadas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 uppercase font-black text-[10px] tracking-widest text-[#888888]">
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4">Finalidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 px-4 font-bold">next-auth.session-token</td>
                <td className="py-3 px-4 italic text-zinc-500">Propia</td>
                <td className="py-3 px-4 text-xs font-medium">Mantiene la sesión de usuario iniciada de forma segura.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">__stripe_mid / __stripe_sid</td>
                <td className="py-3 px-4 italic text-zinc-500">Stripe</td>
                <td className="py-3 px-4 text-xs font-medium">Prevención de fraude en los procesos de pago.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">sf_consent</td>
                <td className="py-3 px-4 italic text-zinc-500">Propia</td>
                <td className="py-3 px-4 text-xs font-medium">Almacena sus preferencias de consentimiento de cookies.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Gestión del Consentimiento</h2>
        <p>Puede revocar su consentimiento en cualquier momento a través del banner de configuración o eliminando las cookies en la configuración de su navegador.</p>
      </section>
    </div>
  );
}
