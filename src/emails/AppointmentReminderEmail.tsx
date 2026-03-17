import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface ReminderEmailProps {
  customerName: string;
  vehicleName: string;
  appointmentDate: string;
}

export const AppointmentReminderEmail = ({
  customerName = "Cliente",
  vehicleName = "Vehículo",
  appointmentDate = "",
}: ReminderEmailProps) => {
  const previewText = `Recordatorio: Cita para tu ${vehicleName} mañana`;

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
                ¡Hola {customerName}!
              </Text>
              <Text className="text-[#444444] leading-relaxed">
                Este es un recordatorio de que tienes una cita programada para tu <strong>{vehicleName}</strong> mañana.
              </Text>

              <Section className="bg-[#E85C1A]/5 p-6 border border-[#E85C1A]/20 rounded-lg my-6">
                <Text className="m-0 text-xs font-bold uppercase tracking-widest text-[#E85C1A]">Detalles de la Cita</Text>
                <Text className="text-lg font-bold text-[#1a1a1a] mt-1">{appointmentDate}</Text>
                <Text className="m-0 text-sm text-[#444444]">En nuestro taller habitual.</Text>
              </Section>

              <Text className="text-[#444444] leading-relaxed">
                Si no puedes asistir, por favor llámanos lo antes posible para reprogramar. 
                ¡Te esperamos!
              </Text>
              
              <Hr className="my-6 border-[#eeeeee]" />
              <Text className="text-[#888888] text-xs">
                Este es un mensaje automático, por favor no responda directamente.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AppointmentReminderEmail;
