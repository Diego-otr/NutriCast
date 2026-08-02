"use client";

import React from "react";
import { Settings } from "lucide-react";
import { useButtonVariant, ButtonVariant } from "./useButtonVariant";

interface ButtonEditarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

export const ButtonEditar: React.FC<ButtonEditarProps> = ({
  variant,
  onClick,
  children = "Editar",
  className = "",
  ...props
}) => {
  const { isPressed, handleClick } = useButtonVariant({ variant, onClick });

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-3 px-7 py-3 rounded-2xl font-semibold text-lg text-white transition-all duration-150 shadow-md active:scale-95 ${
        isPressed
          ? "bg-[#173b3e] hover:bg-[#112d30]"
          : "bg-[#368482] hover:bg-[#2c6e6c] active:bg-[#173b3e]"
      } ${className}`}
      {...props}
    >
      <span>{children}</span>
      <Settings className="w-5 h-5 fill-current" />
    </button>
  );
};
