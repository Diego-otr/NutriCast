"use client";

import React, { useState } from "react";
import { User, Lock, X } from "lucide-react";
import { ButtonPrimary, ButtonCancelar } from "@/components/buttons";
import { ProfileResponse } from "@/features/profiles/services/profiles.service";

export interface ProfileModalProps {
  isOpen: boolean;
  profileToEdit?: ProfileResponse | null;
  onClose: () => void;
  onConfirm: (data: { name: string; pinCode?: string }) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profileToEdit,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Sincronización de estado sin react-hooks/set-state-in-effect
  const [prevProfileToEdit, setPrevProfileToEdit] = useState<ProfileResponse | null | undefined>(profileToEdit);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen || profileToEdit !== prevProfileToEdit) {
    setPrevIsOpen(isOpen);
    setPrevProfileToEdit(profileToEdit);
    if (profileToEdit) {
      setName(profileToEdit.name || "");
      setPinCode(profileToEdit.pinCode || "");
    } else {
      setName("");
      setPinCode("");
    }
    setError(null);
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre del perfil es obligatorio.");
      return;
    }

    if (pinCode.trim() && !/^\d{4}$/.test(pinCode.trim())) {
      setError("El PIN debe ser exactamente de 4 dígitos numéricos.");
      return;
    }

    onConfirm({
      name: name.trim(),
      pinCode: pinCode.trim() ? pinCode.trim() : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#f7faeb] border border-[#1b3d30] rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 text-[#1b3d30] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-xl font-bold text-[#1b3d30]">
            {profileToEdit ? "Editar Perfil" : "Nuevo Perfil"}
          </h2>
          <p className="text-xs text-zinc-600">
            {profileToEdit
              ? "Modifica el nombre o PIN de seguridad del perfil."
              : "Ingresa los datos para agregar un perfil a tu grupo."}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="profile-name" className="font-bold text-xs uppercase text-black">
              Nombre del Perfil
            </label>
            <div className="relative">
              <input
                id="profile-name"
                type="text"
                placeholder="Ej: Mamá, Juan, Perfil 1..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1b3d30] bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#368482]"
                required
              />
              <User className="w-5 h-5 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="profile-pin" className="font-bold text-xs uppercase text-black">
              PIN de Acceso (Opcional - 4 dígitos)
            </label>
            <div className="relative">
              <input
                id="profile-pin"
                type="password"
                maxLength={4}
                placeholder="1234"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1b3d30] bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#368482] tracking-widest"
              />
              <Lock className="w-5 h-5 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <ButtonCancelar onClick={onClose} className="flex-1 justify-center py-3">
              Cancelar
            </ButtonCancelar>
            <ButtonPrimary type="submit" className="flex-1 justify-center py-3">
              Guardar
            </ButtonPrimary>
          </div>
        </form>
      </div>
    </div>
  );
};
