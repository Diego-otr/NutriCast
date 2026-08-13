"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, LogIn, UserPlus, Flame, Users, Apple, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";

export default function HomeLandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Estados Formulario Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados Formulario Registro
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regGroupName, setRegGroupName] = useState("");

  // Estado UI
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manejar Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage("Por favor ingresa tu correo electrónico y contraseña.");
      return;
    }

    try {
      setIsLoading(true);
      await authService.login({
        email: loginEmail.trim(),
        password: loginPassword,
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

  // Manejar Registro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regEmail.trim() || !regPassword.trim() || !regGroupName.trim()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({
        email: regEmail.trim(),
        password: regPassword,
        groupName: regGroupName.trim(),
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
          setErrorMessage("Error al registrar la cuenta.");
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
      {/* Header Superior estilo Marca */}
      <header className="w-full flex items-center justify-center gap-3 bg-[#368482] text-white py-4 px-6 shadow-md border-b border-[#1b3d30]/20">
        <UtensilsCrossed className="w-7 h-7 stroke-[2.5]" />
        <h1 className="font-bold text-2xl md:text-3xl tracking-wide">NutriTracker</h1>
        <UtensilsCrossed className="w-7 h-7 stroke-[2.5]" />
      </header>

      {/* Hero Content Area */}
      <div className="w-full max-w-5xl px-4 py-4 md:py-12 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-14 flex-1">
        {/* Presentación & Beneficios */}
        <section className="flex-1 flex flex-col gap-3 sm:gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#d5f7e6] border border-[#1b3d30]/20 text-[#0c7336] text-xs md:text-sm font-semibold tracking-wide self-center lg:self-start">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-[#0c7336]" />
            <span>Control Nutricional Inteligente</span>
          </div>

          <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-[#1b3d30] tracking-tight leading-tight">
            Tu alimentación diaria y en equipo, <span className="text-[#368482]">simplificada.</span>
          </h2>

          <p className="text-zinc-700 text-xs sm:text-base md:text-lg leading-relaxed max-w-xl">
            Lleva el registro de tus calorías, proteínas, carbohidratos y grasas acumulados. Gestiona perfiles dentro de tu grupo familiar de forma rápida y visual.
          </p>

          {/* Fila compacta de características en Mobile */}
          <div className="flex sm:hidden items-center justify-center gap-3 pt-1 text-[11px] font-semibold text-[#1b3d30]">
            <span className="flex items-center gap-1">
              <Apple className="w-3.5 h-3.5 text-[#0c7336]" /> Alimentos
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#0c7336]" /> Seguimiento
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#0c7336]" /> Grupos
            </span>
          </div>

          {/* Cards Destacadas de Funcionalidades (Visibles en Tablet y Desktop) */}
          <div className="hidden sm:grid grid-cols-3 gap-4 pt-2">
            <div className="bg-[#a7f5d0]/60 border border-[#1b3d30]/20 rounded-2xl p-4 flex flex-col items-center lg:items-start gap-2 shadow-sm">
              <Apple className="w-6 h-6 text-[#0c7336]" />
              <span className="font-bold text-sm text-[#1b3d30]">Alimentos</span>
              <p className="text-xs text-zinc-700 text-center lg:text-left">
                Calcula calorías por gramos o porción.
              </p>
            </div>

            <div className="bg-[#a7f5d0]/60 border border-[#1b3d30]/20 rounded-2xl p-4 flex flex-col items-center lg:items-start gap-2 shadow-sm">
              <Flame className="w-6 h-6 text-[#0c7336]" />
              <span className="font-bold text-sm text-[#1b3d30]">Seguimiento</span>
              <p className="text-xs text-zinc-700 text-center lg:text-left">
                Monitorea tu meta diaria de calorías y macros.
              </p>
            </div>

            <div className="bg-[#a7f5d0]/60 border border-[#1b3d30]/20 rounded-2xl p-4 flex flex-col items-center lg:items-start gap-2 shadow-sm">
              <Users className="w-6 h-6 text-[#0c7336]" />
              <span className="font-bold text-sm text-[#1b3d30]">Grupos</span>
              <p className="text-xs text-zinc-700 text-center lg:text-left">
                Múltiples perfiles bajo un mismo grupo.
              </p>
            </div>
          </div>
        </section>

        {/* Formulario Interactivo de Autenticación (Login & Registro) */}
        <section className="w-full max-w-md bg-[#f7faeb] border border-[#1b3d30] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
          {/* Pestañas de Cambio: Iniciar Sesión / Registrarse */}
          <div className="flex bg-[#d5f7e6] p-1.5 rounded-2xl border border-[#1b3d30]/20">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "login"
                  ? "bg-[#368482] text-white shadow-md"
                  : "text-[#1b3d30] hover:bg-[#c6f3db]"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "register"
                  ? "bg-[#368482] text-white shadow-md"
                  : "text-[#1b3d30] hover:bg-[#c6f3db]"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrarse</span>
            </button>
          </div>

          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs sm:text-sm animate-in fade-in duration-150">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulario: Iniciar Sesión */}
          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="login-email" className="font-bold text-xs uppercase tracking-wider text-black">
                  Correo Electrónico
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1b3d30] bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#368482] transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3.5 px-6 rounded-2xl bg-[#0c7336] text-white font-bold text-base shadow-md hover:bg-[#095729] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Ingresar</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Formulario: Registrarse */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="reg-email" className="font-bold text-xs uppercase tracking-wider text-black">
                  Correo Electrónico
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1b3d30] bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#368482] transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="reg-password" className="font-bold text-xs uppercase tracking-wider text-black">
                  Contraseña <span className="font-medium text-[11px] text-[#0c7336] tracking-normal block normal-case pt-0.5">(¡Todos los integrantes del grupo usarán esta misma contraseña!)</span>
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1b3d30] bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#368482] transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="reg-group" className="font-bold text-xs uppercase tracking-wider text-black">
                  Nombre del Grupo de Perfiles
                </label>
                <input
                  id="reg-group"
                  type="text"
                  placeholder="Ej: Familia Pérez, Mi Grupo..."
                  value={regGroupName}
                  onChange={(e) => setRegGroupName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1b3d30] bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#368482] transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3.5 px-6 rounded-2xl bg-[#0c7336] text-white font-bold text-base shadow-md hover:bg-[#095729] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Crear Cuenta</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-zinc-600 border-t border-[#1b3d30]/10 bg-[#f7faeb]">
        <span>NutriTracker &copy; 2026 — Control nutricional diario</span>
      </footer>
    </main>
  );
}
