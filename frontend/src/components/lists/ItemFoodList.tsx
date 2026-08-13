"use client";

import React, { useState } from "react";
import { ButtonAdd, ButtonCancelar, ButtonEditar, ButtonDesplegar } from "@/components/buttons";

export interface ItemFoodListProps {
  name?: string;
  caloriesPerGram?: number | string;
  caloriesPerPortion?: number | string;
  proteins?: number | string;
  carbs?: number | string;
  fats?: number | string;
  notes?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClickDelete?: () => void;
  onClickEdit?: () => void;
  onClickAdd?: () => void;
  className?: string;
}

export const ItemFoodList: React.FC<ItemFoodListProps> = ({
  name = "Alimento",
  caloriesPerGram = "-",
  caloriesPerPortion = "-",
  proteins = "-",
  carbs = "-",
  fats = "-",
  notes,
  isExpanded: controlledExpanded,
  onToggleExpand,
  onClickDelete,
  onClickEdit,
  onClickAdd,
  className = "",
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded ?? internalExpanded;

  const handleToggle = () => {
    if (controlledExpanded === undefined) {
      setInternalExpanded((prev) => !prev);
    }
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  return (
    <div
      className={`flex flex-col rounded-xl bg-[#d5f7e6] border border-[#1b3d30] shadow-sm transition-all duration-200 ${className}`}
    >
      {/* Row Principal - Flecha desplegar (izquierda), Nombre (centro), Botón + (derecha) */}
      <div
        onClick={handleToggle}
        className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none hover:bg-[#c6f3db] transition-colors"
      >
        {/* Flecha Desplegar (Izquierda) */}
        <ButtonDesplegar
          isExpanded={expanded}
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
        />

        {/* Nombre del alimento (Centro) */}
        <span className="font-medium text-base text-black tracking-wide flex-1 text-left">
          {name}
        </span>

        {/* Botón Añadir + (Derecha) */}
        <ButtonAdd
          onClick={(e) => {
            e.stopPropagation();
            if (onClickAdd) onClickAdd();
          }}
          title="Añadir al consumo diario"
          className="w-9 h-9 shrink-0"
        />
      </div>

      {/* Menú Desplegable con Información Detallada y Botones Anchos (Descartar y Editar) */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-[#1b3d30]/15 flex flex-col gap-1.5 font-mono text-xs text-black animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex justify-between items-center py-0.5">
            <span>Calorias/gramo:</span>
            <span className="font-bold">{caloriesPerGram}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span>Calorias/porción:</span>
            <span className="font-bold">{caloriesPerPortion}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span>Proteínas:</span>
            <span className="font-bold">{proteins}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span>Carbohidratos:</span>
            <span className="font-bold">{carbs}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span>Grasas:</span>
            <span className="font-bold">{fats}</span>
          </div>

          {notes && (
            <div className="flex flex-col gap-0.5 pt-1">
              <span className="font-bold">Notas:</span>
              <p className="text-[11px] text-zinc-800 leading-normal bg-white/40 p-2 rounded-lg border border-[#1b3d30]/10">
                {notes}
              </p>
            </div>
          )}

          {/* Botones Largos de Texto: Descartar y Editar ocupando todo el ancho (grid 50% / 50%) */}
          <div className="grid grid-cols-2 gap-3 pt-3 mt-1 border-t border-[#1b3d30]/15 w-full">
            {/* Descartar */}
            <ButtonCancelar
              onClick={(e) => {
                e.stopPropagation();
                if (onClickDelete) onClickDelete();
              }}
              className="w-full py-2.5 px-3 text-sm justify-center rounded-xl"
            >
              Descartar
            </ButtonCancelar>

            {/* Editar */}
            <ButtonEditar
              onClick={(e) => {
                e.stopPropagation();
                if (onClickEdit) onClickEdit();
              }}
              className="w-full py-2.5 px-3 text-sm justify-center rounded-xl"
            >
              Editar
            </ButtonEditar>
          </div>
        </div>
      )}
    </div>
  );
};
