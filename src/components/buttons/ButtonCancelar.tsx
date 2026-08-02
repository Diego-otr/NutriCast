"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { useButtonVariant, ButtonVariant } from "./useButtonVariant";

interface ButtonCancelarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const ButtonCancelar: React.FC<ButtonCancelarProps> = ({
  variant,
  onClick,
  icon,
  children = "Descartar",
  className = "",
  ...props
}) => {
  const { isPressed, handleClick } = useButtonVariant({ variant, onClick });

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-between gap-3 px-6 py-3.5 rounded-2xl font-bold text-lg tracking-wide text-white transition-all duration-150 shadow-md active:scale-95 ${
        isPressed
          ? "bg-[#600000] hover:bg-[#480000]"
          : "bg-[#d00000] hover:bg-[#b00000] active:bg-[#600000]"
      } ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon ?? <Trash2 className="w-5 h-5 fill-current" />}
    </button>
  );
};
