import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { 
  CheckCircle2, AlertTriangle, AlertCircle, 
  CircleDot, Activity, Car, Sparkles, ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusIcons: Record<string, any> = {
  good: CheckCircle2,
  attention: AlertTriangle,
  urgent: AlertCircle,
};

const statusColors: Record<string, string> = {
  good: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  attention: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  urgent: "text-red-500 bg-red-500/10 border-red-500/20",
};

const sectionIcons: Record<string, any> = {
  "Frenos": CircleDot,
  "Motor": Activity,
  "Neumáticos": CircleDot,
  "Suspensión": Sparkles,
  "Eléctrico": Sparkles,
  "Carrocería": Car,
};

export default async function PublicInspectionPage({ params }: { params: { id: string } }) {
  const inspection = await prisma.inspection.findUnique({
    where: { id: params.id },
    include: {
      workOrder: {
        include: {
          vehicle: true,
          customer: true,
        }
      },
      shop: true,
    }
  });

  if (!inspection) return notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 p-6 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Informe de Inspección Digital</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              RESULTADOS <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' } as any}>DVI</span>
            </h1>
            <p className="text-muted-foreground mt-1">Revisión técnica realizada por {inspection.shop.name}</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Vehículo</p>
            <p className="text-xl font-bold uppercase italic">{inspection.workOrder.vehicle.make} {inspection.workOrder.vehicle.model}</p>
            <p className="text-xs text-muted-foreground uppercase">{inspection.workOrder.vehicle.licensePlate}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 mt-4">
        {/* Overall Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="bg-[#121212] border-white/10">
              <CardContent className="p-6 space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Estado General</span>
                    <Badge className={statusColors[inspection.overallStatus]}>{inspection.overallStatus.toUpperCase()}</Badge>
                 </div>
                 <div className="h-12 flex items-center gap-4">
                    <div className="flex-1">
                       <Progress value={inspection.progress} className="h-2" />
                    </div>
                    <span className="text-2xl font-black text-primary">{inspection.progress}%</span>
                 </div>
              </CardContent>
           </Card>
           <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col justify-center">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Nota del Taller</p>
              <p className="text-sm text-gray-300 leading-relaxed italic">"Hemos realizado una inspección exhaustiva de los puntos clave de seguridad de tu vehículo para tu tranquilidad."</p>
           </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
           {((inspection.sections as any[]) || []).map((section, idx) => {
              const Icon = sectionIcons[section.name] || CircleDot;
              const StatusIcon = statusIcons[section.status] || CheckCircle2;
              
              return (
                <Card key={idx} className="bg-[#121212] border-white/10 overflow-hidden">
                   <div className="p-6 flex flex-col md:flex-row gap-6">
                      <div className="flex items-center gap-4 flex-1">
                         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${statusColors[section.status]}`}>
                            <Icon className="h-6 w-6" />
                         </div>
                         <div>
                            <h3 className="text-xl font-bold uppercase tracking-tight">{section.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                               <StatusIcon className="h-3 w-3" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">{section.status === 'good' ? 'Correcto' : section.status === 'attention' ? 'Observación' : 'Urgente'}</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex-1">
                         <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                            {section.notes || "Revisión realizada satisfactoriamente sin hallazgos relevantes."}
                         </p>
                      </div>
                   </div>
                   
                   {section.photos && section.photos.length > 0 && (
                     <div className="px-6 pb-6 overflow-x-auto">
                        <div className="flex gap-3">
                           {section.photos.map((photo, pIdx) => (
                             <div key={pIdx} className="h-24 w-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                <img src={photo} className="h-full w-full object-cover" alt="Evidencia" />
                             </div>
                           ))}
                        </div>
                     </div>
                   )}
                </Card>
              );
           })}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center py-10 space-y-2 opacity-30">
        <Sparkles className="h-6 w-6 mx-auto text-primary" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Powered by ShopFlow</p>
      </div>
    </div>
  );
}
