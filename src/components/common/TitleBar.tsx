"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, LogOut } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";

export interface TitleBarProps {
  title?: string;
  groupName?: string;
  showLogout?: boolean;
  onLogout?: () => void;
  className?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = "NutriTracker",
  groupName: propGroupName,
  showLogout = true,
  onLogout,
  className = "",
}) => {
  const router = useRouter();
  const [fetchedGroupName, setFetchedGroupName] = useState<string | undefined>();

  useEffect(() => {
    let isCancelled = false;
    if (showLogout && !propGroupName) {
      authService
        .getMe()
        .then((data) => {
          if (!isCancelled && data?.account?.groupName) {
            setFetchedGroupName(data.account.groupName);
          }
        })
        .catch(() => {
          // Ignorar si no está autenticado
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [showLogout, propGroupName]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      authService.logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("selected_profile_id");
        localStorage.removeItem("selected_profile_name");
      }
      router.push("/");
    }
  };

  const displayGroupName = propGroupName || fetchedGroupName;

  return (
    <header
      className={`w-full flex items-center justify-between gap-2 bg-[#368482] text-white py-3 px-4 sm:px-6 rounded-none shadow-md border-b border-[#1b3d30]/20 ${className}`}
    >
      {/* Lado Izquierdo: Ícono y Título de la Aplicación */}
      <div className="flex items-center gap-2 shrink-0">
        <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-white" />
        <h1 className="font-extrabold text-base sm:text-xl tracking-wide text-white">
          {title}
        </h1>
      </div>

      {/* Lado Derecho: Nombre del Grupo (Visible en Mobile) + Botón Deslogear */}
      <div className="flex items-center justify-end gap-2 min-w-0">
        {displayGroupName && (
          <span
            className="inline-block text-xs font-bold bg-black/20 text-white px-2 py-1 sm:px-2.5 rounded-xl truncate max-w-[100px] sm:max-w-[140px] shadow-inner border border-white/10"
            title={displayGroupName}
          >
            {displayGroupName}
          </span>
        )}

        {showLogout && (
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/20 hover:bg-red-600/90 text-white transition-all duration-150 flex items-center gap-1.5 text-xs font-bold shadow-sm active:scale-95 shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden md:inline">Salir</span>
          </button>
        )}
      </div>
    </header>
  );
};
