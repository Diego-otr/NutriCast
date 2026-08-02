"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useButtonVariant, ButtonVariant } from "./useButtonVariant";

interface ButtonForwardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const ButtonForward: React.FC<ButtonForwardProps> = ({
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
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full border border-black/20 transition-all duration-150 shadow-md active:scale-95 ${bgClasses} ${className}`}
      {...props}
    >
      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
};
