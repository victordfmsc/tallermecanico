import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface InspectionEmailProps {
  customerName: string;
  vehicleName: string;
  inspectionLink: string;
  sections: Array<{ name: string; status: string }>;
}

export const InspectionEmail = ({
  customerName = "Cliente",
  vehicleName = "Vehículo",
  inspectionLink = "#",
  sections = [],
}: InspectionEmailProps) => {
  const previewText = `Inspección terminada para su ${vehicleName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-10 px-5 max-w-[580px]">
            <Section className="bg-[#0a0a0a] rounded-t-xl p-8 text-center">
              <Heading className="text-[#E85C1A] text-2xl font-bold uppercase tracking-tighter m-0">
                ShopFlow
              </Heading>
            </Section>
            <Section className="bg-[#f9f9f9] p-8 rounded-b-xl border border-[#eeeeee]">
              <Text className="text-xl font-bold text-[#1a1a1a]">
                Hola {customerName},
              </Text>
              <Text className="text-[#444444] leading-relaxed">
                Hemos completado la inspección digital (DVI) para tu <strong>{vehicleName}</strong>. 
                A continuación tienes un resumen de los puntos clave revisados.
              </Text>

              <Section className="py-4">
                {sections.map((section, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-[#eeeeee]">
                    <span className="text-sm font-medium text-[#1a1a1a]">{section.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      section.status === 'good' ? 'bg-green-100 text-green-700' : 
                      section.status === 'attention' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {section.status === 'good' ? 'Correcto' : section.status === 'attention' ? 'Atención' : 'Urgente'}
                    </span>
                  </div>
                ))}
              </Section>

              <Section className="text-center py-6">
                <Button
                  className="bg-[#E85C1A] text-white px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-widest"
                  href={inspectionLink}
                >
                  Ver Informe con Fotos
                </Button>
              </Section>
              
              <Hr className="my-4 border-[#eeeeee]" />
              <Text className="text-[#888888] text-xs">
                Gracias por confiar en nuestro taller. Si tienes preguntas sobre los resultados, no dudes en contactarnos.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InspectionEmail;
