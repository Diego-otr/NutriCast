"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useButtonVariant, ButtonVariant } from "./useButtonVariant";

interface ButtonAddProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const ButtonAdd: React.FC<ButtonAddProps> = ({
  variant,
  onClick,
  className = "",
  type = "button",
  ...props
}) => {
  const { isPressed, handleClick } = useButtonVariant({ variant, onClick });

  const bgClasses = isPressed
    ? "bg-[#06411f] hover:bg-[#043017] text-white"
    : "bg-[#0c7336] hover:bg-[#095729] active:bg-[#06411f] text-white";

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full transition-all duration-150 shadow-md active:scale-95 ${bgClasses} ${className}`}
      {...props}
    >
      <Plus className="w-6 h-6 stroke-[3]" />
    </button>
  );
};
