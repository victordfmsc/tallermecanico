import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  shopName: string;
  userName: string;
}

export const WelcomeEmail = ({
  shopName = "Tu Taller",
  userName = "Propietario",
}: WelcomeEmailProps) => {
  const previewText = `¡Bienvenido a ShopFlow, ${userName}!`;

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
                ¡Hola, {userName}!
              </Text>
              <Text className="text-[#444444] leading-relaxed">
                Es un placer tenerte a bordo. Hemos configurado correctamente tu taller 
                <strong> {shopName}</strong> en nuestra plataforma.
              </Text>
              <Text className="text-[#444444] leading-relaxed">
                A partir de ahora, podrás gestionar órdenes de trabajo, inventario y 
                marketing de forma profesional y eficiente.
              </Text>
              <Section className="text-center py-6">
                <Button
                  className="bg-[#E85C1A] text-white px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-widest"
                  href={`${process.env.NEXTAUTH_URL}/dashboard`}
                >
                  Ir al Dashboard
                </Button>
              </Section>
              <Text className="text-[#888888] text-xs pt-4 border-t border-[#eeeeee]">
                Si tienes alguna duda, responde a este correo. Estamos aquí para ayudarte.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
