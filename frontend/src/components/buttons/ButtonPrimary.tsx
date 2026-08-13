"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useButtonVariant, ButtonVariant } from "./useButtonVariant";

export interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  variant,
  onClick,
  icon,
  iconPosition = "left",
  isLoading = false,
  fullWidth = false,
  children = "Registrar Comida",
  className = "",
  type = "button",
  disabled,
  ...props
}) => {
  const { isPressed, handleClick } = useButtonVariant({ variant, onClick });

  const bgClasses = isPressed
    ? "bg-[#06411f] hover:bg-[#043017] text-white"
    : "bg-[#0c7336] hover:bg-[#095729] active:bg-[#06411f] text-white";

  const justifyClass = className.includes("justify-") ? "" : "justify-center";

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center ${justifyClass} gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-base tracking-wide transition-all duration-150 shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${
        fullWidth ? "w-full" : ""
      } ${bgClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
