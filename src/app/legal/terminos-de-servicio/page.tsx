export default function TermsOfServicePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black uppercase tracking-tighter italic text-primary">Términos de Servicio (B2B SaaS)</h1>
      <p className="text-zinc-400">Última actualización: 17 de marzo de 2026</p>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">1. Objeto y Aceptación</h2>
        <p>El presente documento establece las condiciones de uso de ShopFlow, una plataforma de software como servicio (SaaS) dirigida exclusivamente a profesionales y empresas del sector automotriz. El registro en la plataforma implica la aceptación plena de estos términos.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">2. Disponibilidad y SLA (Acuerdo de Nivel de Servicio)</h2>
        <p>ShopFlow se compromete a mantener una disponibilidad del servicio del <strong>99.5%</strong> medida mensualmente, excluyendo paradas programadas de mantenimiento debidamente notificadas. En caso de incumplimiento crítico de este SLA, el cliente podrá solicitar compensaciones en forma de créditos de servicio.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">3. Propiedad de los Datos</h2>
        <p>Usted conserva todos los derechos de propiedad sobre los datos de taller, clientes y vehículos introducidos en la plataforma. ShopFlow actúa únicamente como encargado del tratamiento. Puede exportar sus datos en cualquier momento en formatos estándar.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">4. Limitación de Responsabilidad</h2>
        <p>ShopFlow proporciona una herramienta de gestión administrativa. No nos hacemos responsables de las decisiones técnicas de reparación, errores mecánicos o daños derivados del uso incorrecto de la información por parte de los técnicos del taller.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">5. Política de Cancelación</h2>
        <p>No existe compromiso de permanencia. El usuario puede cancelar su suscripción desde el panel de Billing en cualquier momento. El acceso se mantendrá hasta el final del periodo facturado actual.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">6. Jurisdicción</h2>
        <p>Para cualquier controversia, las partes se someten a los juzgados y tribunales de la ciudad de Madrid, España.</p>
      </section>
    </div>
  );
}
