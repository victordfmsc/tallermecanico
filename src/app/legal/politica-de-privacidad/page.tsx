export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6 text-zinc-300">
      <h1 className="text-4xl font-black uppercase tracking-tighter italic text-primary">Política de Privacidad (GDPR/RGPD)</h1>
      <p className="text-zinc-500">ShopFlow cumple estrictamente con el Reglamento General de Protección de Datos (UE) 2016/679.</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">1. Responsable del Tratamiento</h2>
        <p>ShopFlow Digital S.L., con domicilio en Calle de la Mecánica 123, Madrid, es el responsable del tratamiento de los datos de los usuarios registrados.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">2. Datos Recopilados y Finalidad</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Datos de Usuario:</strong> Nombre, email y contraseña cifrada para la gestión del acceso.</li>
          <li><strong>Datos de Taller:</strong> Información profesional necesaria para la facturación y el servicio.</li>
          <li><strong>Datos de Clientes del Taller:</strong> Recopilados por el taller para la gestión de citas y órdenes. ShopFlow los trata únicamente para cumplir el servicio solicitado por el taller.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">3. Plazo de Conservación</h2>
        <p>Los datos se conservarán mientras se mantenga la relación contractual o durante el tiempo necesario para cumplir con las obligaciones legales (normalmente 5 años para datos contables).</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">4. Destinatarios</h2>
        <p>No cedemos datos a terceros excepto por obligación legal o proveedores necesarios para el servicio (Stripe para pagos, Resend para emails, Twilio para SMS).</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">5. Sus Derechos</h2>
        <p>Puede ejercer sus derechos de acceso, rectificación, supresión y portabilidad enviando un correo a <strong>privacidad@shopflow.app</strong>.</p>
      </section>
    </div>
  );
}
