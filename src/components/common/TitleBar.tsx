"use client";

import React from "react";
import { UtensilsCrossed } from "lucide-react";

export interface TitleBarProps {
  title?: string;
  className?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = "NutriTracker",
  className = "",
}) => {
  return (
    <header
      className={`w-full flex items-center justify-center gap-3 bg-[#368482] text-white py-3.5 px-6 rounded-none shadow-md border-b border-[#1b3d30]/20 ${className}`}
    >
      <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
      <h1 className="font-bold text-xl md:text-2xl tracking-wide">
        {title}
      </h1>
      <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
    </header>
  );
};
