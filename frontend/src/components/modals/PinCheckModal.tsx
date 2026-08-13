"use client";

import React, { useState } from "react";
import { Lock, X } from "lucide-react";
import { ButtonPrimary, ButtonCancelar } from "@/components/buttons";
import { ProfileResponse } from "@/features/profiles/services/profiles.service";

export interface PinCheckModalProps {
  isOpen: boolean;
  profile: ProfileResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinCheckModal: React.FC<PinCheckModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSuccess,
}) => {
  const [inputPin, setInputPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Sincronización de estado sin react-hooks/set-state-in-effect
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setInputPin("");
      setError(null);
    }
  }

  if (!isOpen || !profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin.trim() === profile.pinCode) {
      onSuccess();
    } else {
      setError("PIN incorrecto. Inténtalo de nuevo.");
      setInputPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#f7faeb] border border-[#1b3d30] rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 text-[#1b3d30] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-full bg-[#d5f7e6] border border-[#1b3d30]/20 flex items-center justify-center text-[#0c7336]">
          <Lock className="w-6 h-6 stroke-[2.5]" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#1b3d30]">
            Ingresa PIN de {profile.name}
          </h2>
          <p className="text-xs text-zinc-600">
            Este perfil está protegido con PIN de 4 dígitos.
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            maxLength={4}
            autoFocus
            placeholder="••••"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-xl border border-[#1b3d30] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#368482]"
            required
          />

          <div className="flex gap-3">
            <ButtonCancelar onClick={onClose} className="flex-1 justify-center py-3">
              Cancelar
            </ButtonCancelar>
            <ButtonPrimary type="submit" className="flex-1 justify-center py-3">
              Ingresar
            </ButtonPrimary>
          </div>
        </form>
      </div>
    </div>
  );
};
