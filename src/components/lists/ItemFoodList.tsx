"use client";

import React from "react";
import { ButtonForward, ButtonAdd } from "@/components/buttons";

export interface ItemFoodListProps {
  name?: string;
  onClickForward?: () => void;
  onClickAdd?: () => void;
  forwardVariant?: "default" | "pressed";
  addVariant?: "default" | "pressed";
  className?: string;
}

export const ItemFoodList: React.FC<ItemFoodListProps> = ({
  name = "Alimento",
  onClickForward,
  onClickAdd,
  forwardVariant,
  addVariant,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-6 py-4 rounded-xl bg-[#d5f7e6] border border-[#1b3d30] shadow-sm transition-all duration-200 ${className}`}
    >
      <span className="font-medium text-lg text-black tracking-wide">
        {name}
      </span>

      <div className="flex items-center gap-2">
        <ButtonForward variant={forwardVariant} onClick={onClickForward} />
        <ButtonAdd variant={addVariant} onClick={onClickAdd} />
      </div>
    </div>
  );
};
