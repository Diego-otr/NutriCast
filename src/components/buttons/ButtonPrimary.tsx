"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useButtonVariant, ButtonVariant } from "./useButtonVariant";

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  variant,
  onClick,
  icon,
  children = "Registrar Comida",
  className = "",
  ...props
}) => {
  const { isPressed, handleClick } = useButtonVariant({ variant, onClick });

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-between gap-3 px-6 py-3.5 rounded-full font-bold text-lg tracking-wide transition-all duration-150 shadow-md active:scale-95 ${
        isPressed
          ? "bg-[#0c7336] hover:bg-[#095929] text-white"
          : "bg-[#34c759] hover:bg-[#2eb04f] active:bg-[#0c7336] text-black active:text-white"
      } ${className}`}
      {...props}
    >
      <span>{children}</span>
      <span
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-150 ${
          isPressed ? "bg-[#06381a] text-[#34c759]" : "bg-black text-[#34c759]"
        }`}
      >
        {icon ?? <Plus className="w-5 h-5 stroke-[3]" />}
      </span>
    </button>
  );
};
