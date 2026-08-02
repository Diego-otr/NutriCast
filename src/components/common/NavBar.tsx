"use client";

import React, { useState } from "react";
import { ButtonNavTile, NavTileType } from "@/components/buttons/ButtonNavTile";

export interface NavBarProps {
  activeTab?: NavTileType;
  onTabChange?: (tab: NavTileType) => void;
  className?: string;
}

const navItems: NavTileType[] = ["inicio", "lista", "grupo", "ajustes"];

export const NavBar: React.FC<NavBarProps> = ({
  activeTab,
  onTabChange,
  className = "",
}) => {
  const [internalTab, setInternalTab] = useState<NavTileType>("inicio");

  const currentActiveTab = activeTab ?? internalTab;

  const handleSelectTab = (tab: NavTileType) => {
    if (activeTab === undefined) {
      setInternalTab(tab);
    }
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <nav
      className={`w-full max-w-md mx-auto grid grid-cols-4 bg-[#7c95f6] rounded-2xl overflow-hidden shadow-lg border border-[#5b73e8]/30 ${className}`}
    >
      {navItems.map((tab) => {
        const isSelected = currentActiveTab === tab;
        return (
          <ButtonNavTile
            key={tab}
            iconType={tab}
            variant={isSelected ? "pressed" : "default"}
            onClick={() => handleSelectTab(tab)}
            className="w-full h-14 rounded-none border-r border-[#5b73e8]/40 last:border-r-0"
          />
        );
      })}
    </nav>
  );
};
