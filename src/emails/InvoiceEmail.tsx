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

interface InvoiceEmailProps {
  customerName: string;
  invoiceId: string;
  totalAmount: number;
  paymentLink: string;
}

export const InvoiceEmail = ({
  customerName = "Cliente",
  invoiceId = "INV-0000",
  totalAmount = 0,
  paymentLink = "#",
}: InvoiceEmailProps) => {
  const previewText = `Factura ${invoiceId} lista para pago`;

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
                Tu vehículo está listo y hemos generado la factura <strong>{invoiceId}</strong>. 
                Puedes descargarla o realizar el pago online de forma segura clicando en el botón inferior.
              </Text>

              <Section className="bg-white p-6 border border-[#eeeeee] rounded-lg my-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-[#888888]">Total a pagar</span>
                  <span className="text-2xl font-black text-[#1a1a1a]">
                    {totalAmount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
              </Section>

              <Section className="text-center py-4">
                <Button
                  className="bg-[#E85C1A] text-white px-10 py-4 rounded-lg font-bold text-sm uppercase tracking-widest"
                  href={paymentLink}
                >
                  Pagar Factura
                </Button>
              </Section>
              
              <Hr className="my-4 border-[#eeeeee]" />
              <Text className="text-[#888888] text-xs">
                Gracias por confiar en nuestros servicios mecánicos.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvoiceEmail;
