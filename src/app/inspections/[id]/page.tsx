"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, AlertTriangle, AlertCircle, 
  Camera, Plus, Loader2, ArrowLeft, ChevronRight,
  ShieldCheck, Zap, Scissors, CircleDot, Activity, Car
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  "Suspensión": Zap,
  "Eléctrico": Zap,
  "Carrocería": Car,
};

export default function InspectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  const { data: inspection, isLoading } = useQuery<any>({
    queryKey: ["/api/inspections", params.id],
    queryFn: () => fetch(`/api/inspections/${params.id}`).then(res => res.json()),
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const res = await fetch(`/api/inspections/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Error updating inspection");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/inspections", params.id], data);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, sectionName }: { file: File, sectionName: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch(`/api/inspections/${params.id}/photos`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error uploading photo");
      const { url } = await res.json();
      
      // Update the section's photos
      const updatedSections = inspection.sections.map((s: any) => {
        if (s.name === sectionName) {
          return { ...s, photos: [...(s.photos || []), url] };
        }
        return s;
      });
      
      return updateMutation.mutateAsync({ sections: updatedSections });
    },
    onSettled: () => setUploadingSection(null),
  });

  const handleStatusChange = (sectionName: string, status: string) => {
    const updatedSections = inspection.sections.map((s: any) => {
      if (s.name === sectionName) return { ...s, status };
      return s;
    });
    updateMutation.mutate({ sections: updatedSections });
  };

  const handleNotesChange = (sectionName: string, notes: string) => {
    const updatedSections = inspection.sections.map((s: any) => {
      if (s.name === sectionName) return { ...s, notes };
      return s;
    });
    updateMutation.mutate({ sections: updatedSections });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, sectionName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingSection(sectionName);
      uploadMutation.mutate({ file, sectionName });
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  if (!inspection) return <div>Inspección no encontrada</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Inspección Digital (DVI)
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Orden de Trabajo #OT-{inspection.workOrderId.slice(-6).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Header Info */}
      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1 space-y-4 w-full">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Progreso General</span>
                <span className="text-2xl font-black text-primary">{inspection.progress}%</span>
              </div>
              <Progress value={inspection.progress} className="h-2 bg-white/10" />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-32 p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Estado</p>
                <Badge className={statusColors[inspection.overallStatus]}>{inspection.overallStatus.toUpperCase()}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        <Accordion type="single" collapsible className="space-y-4">
          {inspection.sections.map((section: any) => {
            const Icon = sectionIcons[section.name] || CircleDot;
            const StatusIcon = section.status ? statusIcons[section.status] : null;
            
            return (
              <AccordionItem 
                key={section.name} 
                value={section.name}
                className="border border-white/10 bg-[#121212]/50 rounded-2xl overflow-hidden px-4"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 w-full text-left">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${section.status ? statusColors[section.status] : 'bg-white/5 text-muted-foreground'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg uppercase tracking-tight">{section.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {section.status ? `Estado: ${section.status}` : 'Pendiente de revisión'}
                      </p>
                    </div>
                    {StatusIcon && <StatusIcon className={`h-6 w-6 mr-4 ${statusColors[section.status].split(' ')[0]}`} />}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 space-y-6 pt-2 border-t border-white/5">
                  {/* Status Selection */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estado de Inspección</p>
                    <div className="grid grid-cols-3 gap-3">
                      {['good', 'attention', 'urgent'].map((status) => {
                        const SIcon = statusIcons[status];
                        return (
                          <Button
                            key={status}
                            variant="outline"
                            className={`h-12 gap-2 border-white/5 hover:bg-white/5 ${section.status === status ? statusColors[status] + ' border-' + statusColors[status].split('-')[1] + '-500/50' : 'text-muted-foreground'}`}
                            onClick={() => handleStatusChange(section.name, status)}
                          >
                            <SIcon className="h-4 w-4" />
                            <span className="capitalize text-xs font-bold">{status === 'good' ? 'Bueno' : status === 'attention' ? 'Observar' : 'Urgente'}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Notas del Técnico</p>
                    <Textarea 
                      placeholder="Describe hallazgos, desgaste o recomendaciones..."
                      value={section.notes}
                      onChange={(e) => handleNotesChange(section.name, e.target.value)}
                      className="bg-white/5 border-white/10 min-h-[100px] focus:border-primary/50"
                    />
                  </div>

                  {/* Photos */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Evidencia Fotográfica</p>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={(e) => handlePhotoUpload(e, section.name)}
                          id={`photo-input-${section.name}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-2 text-xs border border-white/10 hover:bg-primary hover:text-white transition-all"
                          disabled={uploadingSection === section.name}
                          onClick={() => document.getElementById(`photo-input-${section.name}`)?.click()}
                        >
                          {uploadingSection === section.name ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Camera className="h-3 w-3" />
                          )}
                          Añadir Foto
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {section.photos?.map((url: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 group relative">
                          <img src={url} alt={`Evidencia ${idx}`} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-red-500">
                              <Plus className="h-4 w-4 rotate-45" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {(!section.photos || section.photos.length === 0) && (
                        <div className="col-span-full py-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <Camera className="h-6 w-6 opacity-20" />
                          <p className="text-xs uppercase tracking-widest font-bold">Sin fotos</p>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <div className="fixed bottom-8 right-8 left-8 md:left-auto">
        <Button 
          className="w-full md:w-64 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-3 shadow-2xl shadow-emerald-600/20"
          onClick={() => {
            // Mark as completed if needed, or just go back
            router.push('/work-orders');
          }}
        >
          Finalizar Inspección <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
