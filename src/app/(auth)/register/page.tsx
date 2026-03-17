"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShopFlowLogo } from "@/components/ShopFlowLogo";
import { loginAction } from "@/lib/actions";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
  shopName: z.string().min(2, "El nombre del taller debe tener al menos 2 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      shopName: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setError(null);
    setIsPending(true);

    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          shopName: values.shopName,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || "Algo salió mal");
        setIsPending(false);
        return;
      }

      // Auto login
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      
      await loginAction(formData);
      router.push("/onboarding");
    } catch (err) {
      setError("Error de conexión");
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 font-sans antialiased">
      <div className="w-full max-w-md space-y-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <ShopFlowLogo size={48} />
          <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            ShopFlow
          </h1>
          <p className="text-muted-foreground">Únete a la nueva era de gestión</p>
        </div>

        <Card className="border-border/50 bg-[#121212]/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Crea tu cuenta</CardTitle>
            <CardDescription>
              Regístrate y configura tu taller en pocos minutos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-300">Nombre Personal</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  {...form.register("name")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  {...form.register("email")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopName" className="text-sm font-medium text-gray-300">Nombre del Taller</Label>
                <Input
                  id="shopName"
                  placeholder="Taller Ejemplo S.A."
                  {...form.register("shopName")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                {form.formState.errors.shopName && (
                  <p className="text-xs text-destructive">{form.formState.errors.shopName.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirmar</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6" disabled={isPending}>
                {isPending ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center text-muted-foreground w-full">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
