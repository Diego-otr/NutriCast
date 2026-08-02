"use client";

import React from "react";
import { Moon } from "lucide-react";
import { useButtonVariant, ButtonVariant } from "./useButtonVariant";

interface ButtonFinDiaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

export const ButtonFinDia: React.FC<ButtonFinDiaProps> = ({
  variant,
  onClick,
  children = "Finalizar Día",
  className = "",
  ...props
}) => {
  const { isPressed, handleClick } = useButtonVariant({ variant, onClick });

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-between gap-4 px-7 py-3.5 rounded-full font-bold text-lg text-white tracking-wide transition-all duration-150 shadow-md active:scale-95 ${
        isPressed
          ? "bg-[#173940] hover:bg-[#102b31]"
          : "bg-[#368482] hover:bg-[#2c6e6c] active:bg-[#173940]"
      } ${className}`}
      {...props}
    >
      <span>{children}</span>
      <div className="relative flex items-center justify-center">
        <Moon className="w-6 h-6 fill-current stroke-[1.5]" />
        <span className="absolute -top-1 -right-1 text-xs">✨</span>
      </div>
    </button>
  );
};
