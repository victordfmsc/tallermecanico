"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShopFlowLogo } from "@/components/ShopFlowLogo";
import { loginAction, loginWithGoogle } from "@/lib/actions";
import { FcGoogle } from "react-icons/fc";
import { Icons } from "@/components/ui/icons"; // Assuming icons exist or I'll use Lucide

const loginSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    setIsPending(true);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await loginAction(formData);
    if (result) {
      setError(result);
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 font-sans antialiased">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <ShopFlowLogo size={48} />
          <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            ShopFlow
          </h1>
          <p className="text-muted-foreground">Gestión de taller inteligente</p>
        </div>

        <Card className="border-border/50 bg-[#121212]/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Iniciar sesión</CardTitle>
            <CardDescription>
              Introduce tus credenciales para acceder a tu taller
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">Contraseña</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
                </div>
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

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6" disabled={isPending}>
                {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121212] px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-white/10 bg-transparent hover:bg-white/5 text-white py-6"
              onClick={() => loginWithGoogle()}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-center text-muted-foreground w-full">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
