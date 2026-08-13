"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { ButtonCancelar, ButtonPrimary } from "@/components/buttons";

export interface ConfirmModalProps {
  isOpen: boolean;
  text: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  text,
  title,
  confirmText = "Confirmar",
  cancelText = "Volver",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xs md:max-w-sm bg-[#f7faeb] border-2 border-[#1b3d30] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-6 font-mono text-center">
        {title && (
          <h3 className="text-xl font-extrabold text-[#192a68] tracking-tight">
            {title}
          </h3>
        )}

        <p className="text-lg font-bold text-black leading-snug">
          {text}
        </p>

        {/* Botones: Confirmar Arriba (Verde), Volver Abajo (Rojo), ambos rounded-full con ícono a la derecha */}
        <div className="w-full flex flex-col items-center gap-3 mt-2">
          {/* Botón Confirmar (Arriba - Tilde / Check a la derecha) */}
          <ButtonPrimary
            onClick={onConfirm}
            icon={
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black/20 text-white">
                <Check className="w-5 h-5 stroke-[3]" />
              </span>
            }
            iconPosition="right"
            className="w-full justify-between py-3.5 text-lg rounded-full"
          >
            {confirmText}
          </ButtonPrimary>

          {/* Botón Volver / Cancelar (Abajo - Cruz / X a la derecha) */}
          <ButtonCancelar
            onClick={onCancel}
            icon={
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black/20 text-white">
                <X className="w-5 h-5 stroke-[3]" />
              </span>
            }
            className="w-full justify-between py-3.5 text-lg rounded-full"
          >
            {cancelText}
          </ButtonCancelar>
        </div>
      </div>
    </div>
  );
};
