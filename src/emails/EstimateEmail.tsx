import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface EstimateEmailProps {
  customerName: string;
  vehicleName: string;
  totalAmount: number;
  approvalLink: string;
  lines: Array<{ description: string; price: number }>;
}

export const EstimateEmail = ({
  customerName = "Cliente",
  vehicleName = "Vehículo",
  totalAmount = 0,
  approvalLink = "#",
  lines = [],
}: EstimateEmailProps) => {
  const previewText = `Presupuesto disponible para su ${vehicleName}`;

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
                Hemos preparado el presupuesto para los servicios de tu <strong>{vehicleName}</strong>. 
                Por favor, revísalo y confirma la reparación para que podamos empezar cuanto antes.
              </Text>

              <Section className="bg-white border text-sm border-[#eeeeee] rounded-lg mt-4 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#f1f1f1]">
                    <tr>
                      <th className="p-3 text-[10px] uppercase font-bold text-[#888888]">Servicio</th>
                      <th className="p-3 text-[10px] uppercase font-bold text-[#888888] text-right">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx} className="border-t border-[#eeeeee]">
                        <td className="p-3 text-[#1a1a1a]">{line.description}</td>
                        <td className="p-3 text-[#1a1a1a] text-right">{line.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-[#E85C1A]">
                      <td className="p-3 font-bold text-[#1a1a1a]">TOTAL ESTIMADO</td>
                      <td className="p-3 font-bold text-[#E85C1A] text-right text-lg">
                        {totalAmount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              <Section className="text-center py-6">
                <Button
                  className="bg-[#E85C1A] text-white px-10 py-4 rounded-lg font-bold text-sm uppercase tracking-widest"
                  href={approvalLink}
                >
                  Revisar y Aprobar
                </Button>
              </Section>
              
              <Text className="text-[#888888] text-[10px] italic">
                * Este es un presupuesto estimado. El precio final puede variar ligeramente según sea necesario durante la reparación.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EstimateEmail;
