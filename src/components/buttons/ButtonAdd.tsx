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
    ? "bg-[#0c7336] hover:bg-[#095929] text-black"
    : "bg-[#34c759] hover:bg-[#2eb04f] active:bg-[#0c7336] text-black";

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full border border-black/20 transition-all duration-150 shadow-md active:scale-95 ${bgClasses} ${className}`}
      {...props}
    >
      <Plus className="w-6 h-6 stroke-[3]" />
    </button>
  );
};
