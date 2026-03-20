import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function PrintInvoicePage({ params }: { params: { id: string } }) {
  const shopId = await getShopId();
  if (!shopId) return notFound();

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id, shopId },
    include: {
      customer: true,
      workOrder: {
        include: {
          vehicle: true,
          technician: true,
        }
      }
    }
  });

  if (!invoice || !invoice.workOrder) return notFound();

  const shop = await prisma.shop.findUnique({
    where: { id: shopId }
  });

  const services = (invoice.workOrder.services as any[]) || [];
  const subtotal = services.reduce((sum, s) => sum + (s.price || 0), 0);
  const taxRate = 0.21;
  const taxAmount = subtotal * taxRate;
  const totalWithTax = subtotal + taxAmount;

  return (
    <div className="bg-white text-black min-h-screen p-8 font-sans print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
        <div>
          {shop?.logo ? (
            <img src={shop.logo} alt="Logo" className="h-16 mb-4 object-contain" />
          ) : (
            <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">{shop?.name}</h1>
          )}
          <div className="text-sm space-y-1">
            <p className="font-bold">{shop?.name}</p>
            <p>{shop?.address}</p>
            <p>NIF: {(shop as any)?.nif}</p>
            <p>Tel: {shop?.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-black uppercase tracking-tight text-gray-300 mb-4">FACTURA</h2>
          <div className="text-sm space-y-1">
            <p><span className="font-bold">Nº Factura:</span> {invoice.id.slice(-8).toUpperCase()}</p>
            <p><span className="font-bold">Fecha:</span> {format(invoice.createdAt, "PPP", { locale: es })}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Cliente</h3>
          <div className="text-sm space-y-1">
            <p className="font-bold text-lg">{invoice.customer.name}</p>
            <p>{invoice.customer.email}</p>
            <p>{invoice.customer.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Vehículo</h3>
          <div className="text-sm space-y-1">
            <p className="font-bold text-lg">{invoice.workOrder.vehicle.make} {invoice.workOrder.vehicle.model}</p>
            <p>Matrícula: <span className="font-mono bg-gray-100 px-1">{invoice.workOrder.vehicle.licensePlate}</span></p>
            <p>Kilómetros: {invoice.workOrder.vehicle.mileage?.toLocaleString()} km</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-black text-left text-xs font-black uppercase tracking-widest">
            <th className="py-2">Descripción</th>
            <th className="py-2 text-center">Cant/Hrs</th>
            <th className="py-2 text-right">Precio Unit.</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {services.map((s, i) => (
            <tr key={i} className="border-b border-gray-100 italic">
              <td className="py-4">{s.name}</td>
              <td className="py-4 text-center">{s.quantity || s.estimatedHours || 1}</td>
              <td className="py-4 text-right">€{(s.price / (s.quantity || s.estimatedHours || 1)).toFixed(2)}</td>
              <td className="py-4 text-right font-bold">€{s.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base Imponible:</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>IVA (21%):</span>
            <span>€{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-black border-t-2 border-black pt-2">
            <span>TOTAL:</span>
            <span>€{totalWithTax.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-8 left-8 right-8 text-[10px] text-gray-400 border-t pt-4">
        <p>Gracias por confiar en {shop?.name}. Esta factura se rige por la normativa fiscal vigente.</p>
        <div className="flex justify-between mt-2">
          <p>Generado automáticamente por ShopFlow</p>
          <p>Página 1 de 1</p>
        </div>
      </div>

      {/* Print Trigger */}
      <script dangerouslySetInnerHTML={{ __html: `window.onload = () => { setTimeout(() => window.print(), 500); }` }} />
    </div>
  );
}
