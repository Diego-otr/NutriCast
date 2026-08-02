"use client";

import React from "react";
import { Home, List, Users, Settings } from "lucide-react";
import { useButtonVariant, ButtonVariant } from "./useButtonVariant";

export type NavTileType = "inicio" | "lista" | "grupo" | "ajustes";

interface ButtonNavTileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconType: NavTileType;
  variant?: ButtonVariant;
}

const iconMap = {
  inicio: Home,
  lista: List,
  grupo: Users,
  ajustes: Settings,
};

export const ButtonNavTile: React.FC<ButtonNavTileProps> = ({
  iconType,
  variant,
  onClick,
  className = "",
  ...props
}) => {
  const IconComponent = iconMap[iconType] || Home;
  const { isPressed, handleClick } = useButtonVariant({ variant, onClick });

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-150 shadow-md active:scale-95 ${
        isPressed
          ? "bg-[#5b73e8] hover:bg-[#485fd0] text-[#1b2b73]"
          : "bg-[#7c95f6] hover:bg-[#6882ef] active:bg-[#5b73e8] active:text-[#1b2b73] text-white"
      } ${className}`}
      {...props}
    >
      <IconComponent className="w-7 h-7 fill-current stroke-[1.5]" />
    </button>
  );
};
