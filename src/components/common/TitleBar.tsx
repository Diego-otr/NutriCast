"use client";

import React from "react";
import { UtensilsCrossed } from "lucide-react";

export interface TitleBarProps {
  title?: string;
  className?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = "MiApp",
  className = "",
}) => {
  return (
    <header
      className={`w-full max-w-md mx-auto flex items-center justify-center gap-3 bg-[#7c95f6] text-white py-3.5 px-6 rounded-2xl shadow-md ${className}`}
    >
      <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
      <h1 className="font-bold text-xl md:text-2xl tracking-wide">
        {title}
      </h1>
      <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
    </header>
  );
};
