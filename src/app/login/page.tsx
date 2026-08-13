"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UtensilsCrossed, LogIn, AlertCircle, ArrowLeft } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";
import { ButtonPrimary } from "@/components/buttons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Por favor ingresa tu correo electrónico y contraseña.");
      return;
    }

    try {
      setIsLoading(true);
      await authService.login({
        email: email.trim(),
        password,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { message?: string | string[] } } }).response;
        const msg = res?.data?.message;
        if (Array.isArray(msg)) {
          setErrorMessage(msg.join(". "));
        } else if (typeof msg === "string") {
          setErrorMessage(msg);
        } else {
          setErrorMessage("Error al iniciar sesión. Verifica tus credenciales.");
        }
      } else {
        setErrorMessage("No se pudo conectar con el servidor. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f7e6] text-black font-sans flex flex-col justify-between items-center">
      <header className="w-full flex items-center justify-between gap-3 bg-[#368482] text-white py-4 px-6 shadow-md border-b border-[#1b3d30]/20">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-all">
          <ArrowLeft className="w-4 h-4" />
          <span>Inicio</span>
        </Link>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
          <h1 className="font-bold text-xl md:text-2xl tracking-wide">NutriTracker</h1>
        </div>
        <div className="w-16" />
      </header>

      <div className="w-full max-w-md px-4 py-12 flex-1 flex flex-col justify-center">
        <div className="bg-[#f7faeb] border border-[#1b3d30] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-2xl font-extrabold text-[#1b3d30]">Iniciar Sesión</h2>
            <p className="text-xs text-zinc-600">Ingresa a tu cuenta para gestionar tu nutrición y perfiles.</p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs sm:text-sm animate-in fade-in duration-150">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="login-email" className="font-bold text-xs uppercase tracking-wider text-black">
                Correo Electrónico
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#1b3d30] bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#368482] transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="login-password" className="font-bold text-xs uppercase tracking-wider text-black">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#1b3d30] bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#368482] transition-all"
                required
              />
            </div>

            <ButtonPrimary
              type="submit"
              isLoading={isLoading}
              icon={<LogIn className="w-5 h-5" />}
              fullWidth
              className="mt-2"
            >
              Ingresar
            </ButtonPrimary>
          </form>

          <div className="text-center text-xs text-zinc-600">
            ¿No tienes una cuenta aún?{" "}
            <Link href="/register" className="font-bold text-[#368482] hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full py-4 text-center text-xs text-zinc-600 border-t border-[#1b3d30]/10 bg-[#f7faeb]">
        <span>NutriTracker &copy; 2026 — Control nutricional diario</span>
      </footer>
    </main>
  );
}
