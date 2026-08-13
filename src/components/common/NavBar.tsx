"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonNavTile, NavTileType } from "@/components/buttons/ButtonNavTile";

export interface NavBarProps {
  activeTab?: NavTileType;
  onTabChange?: (tab: NavTileType) => void;
  className?: string;
}

const navItems: NavTileType[] = ["inicio", "lista", "grupo", "ajustes"];

const routeMap: Record<NavTileType, string> = {
  inicio: "/dashboard",
  lista: "/foods",
  grupo: "/dashboard",
  ajustes: "/dashboard",
};

export const NavBar: React.FC<NavBarProps> = ({
  activeTab,
  onTabChange,
  className = "",
}) => {
  const router = useRouter();
  const [internalTab, setInternalTab] = useState<NavTileType>("inicio");

  const currentActiveTab = activeTab ?? internalTab;

  const handleSelectTab = (tab: NavTileType) => {
    if (activeTab === undefined) {
      setInternalTab(tab);
    }
    if (onTabChange) {
      onTabChange(tab);
    } else if (routeMap[tab]) {
      router.push(routeMap[tab]);
    }
  };

  return (
    <nav
      className={`w-full max-w-md mx-auto grid grid-cols-4 bg-[#368482] rounded-none overflow-hidden shadow-lg border-t border-[#1b3d30]/20 ${className}`}
    >
      {navItems.map((tab) => {
        const isSelected = currentActiveTab === tab;
        return (
          <ButtonNavTile
            key={tab}
            iconType={tab}
            variant={isSelected ? "pressed" : "default"}
            onClick={() => handleSelectTab(tab)}
            className="w-full h-14 rounded-none border-r border-[#2c6e6c]/40 last:border-r-0"
          />
        );
      })}
    </nav>
  );
};
