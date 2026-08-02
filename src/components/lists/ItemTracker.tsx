"use client";

import React from "react";
import { ButtonForward } from "@/components/buttons";

export interface ItemTrackerProps {
  cal?: number;
  name?: string;
  onClickForward?: () => void;
  variant?: "default" | "pressed";
  className?: string;
}

export const ItemTracker: React.FC<ItemTrackerProps> = ({
  cal = 0,
  name = "Alimento",
  onClickForward,
  variant,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-6 py-4 rounded-xl bg-[#d5f7e6] border border-[#1b3d30] shadow-sm transition-all duration-200 ${className}`}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-baseline gap-1 text-[#0c7336]">
          <span className="font-bold text-xl">{cal}</span>
          <span className="font-semibold text-xs lowercase">cal</span>
        </div>
        <span className="font-medium text-lg text-black tracking-wide">
          {name}
        </span>
      </div>

      <ButtonForward variant={variant} onClick={onClickForward} />
    </div>
  );
};
