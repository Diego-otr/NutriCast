"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useButtonVariant, ButtonVariant } from "./useButtonVariant";

export interface ButtonDesplegarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isExpanded?: boolean;
  variant?: ButtonVariant;
}

export const ButtonDesplegar: React.FC<ButtonDesplegarProps> = ({
  isExpanded = false,
  variant,
  onClick,
  className = "",
  type = "button",
  ...props
}) => {
  const { isPressed, handleClick } = useButtonVariant({ variant, onClick });

  const bgClasses = isPressed
    ? "bg-[#173b3e] hover:bg-[#112d30] text-white"
    : "bg-[#368482] hover:bg-[#2c6e6c] active:bg-[#173b3e] text-white";

  return (
    <button
      type={type}
      onClick={handleClick}
      aria-label={isExpanded ? "Colapsar detalles" : "Desplegar detalles"}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150 shadow shrink-0 active:scale-95 ${bgClasses} ${className}`}
      {...props}
    >
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
      ) : (
        <ChevronDown className="w-5 h-5 stroke-[2.5]" />
      )}
    </button>
  );
};
