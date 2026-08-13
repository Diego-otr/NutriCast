"use client";

import React, { useState } from "react";
import { ButtonCancelar, ButtonEditar, ButtonDesplegar } from "@/components/buttons";

export interface ItemTrackerProps {
  id?: string | number;
  cal?: number;
  name?: string;
  proteins?: number | string;
  carbs?: number | string;
  fats?: number | string;
  notes?: string;
  portions?: number;
  amountGrams?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClickDelete?: () => void;
  onClickEdit?: () => void;
  onClickForward?: () => void;
  variant?: "default" | "pressed";
  className?: string;
}

export const ItemTracker: React.FC<ItemTrackerProps> = ({
  cal = 0,
  name = "Alimento",
  proteins = "-",
  carbs = "-",
  fats = "-",
  notes,
  portions,
  amountGrams,
  isExpanded: controlledExpanded,
  onToggleExpand,
  onClickDelete,
  onClickEdit,
  onClickForward,
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

  // Calcular macronutrientes proporcionales si se dispone de porciones o gramos ingresados
  const calculateMacro = (value?: number | string) => {
    if (value === undefined || value === null || value === "" || value === "-") return "-";
    const num = typeof value === "number" ? value : parseFloat(String(value));
    if (isNaN(num)) return value;

    if (portions !== undefined && portions > 0) {
      return Math.round(portions * num * 10) / 10;
    }

    if (amountGrams !== undefined && amountGrams > 0) {
      return Math.round((amountGrams / 100) * num * 10) / 10;
    }

    return num;
  };

  const displayProteins = calculateMacro(proteins);
  const displayCarbs = calculateMacro(carbs);
  const displayFats = calculateMacro(fats);

  return (
    <div
      className={`flex flex-col rounded-xl bg-[#d5f7e6] border border-[#1b3d30] shadow-sm transition-all duration-200 ${className}`}
    >
      {/* Row Principal - Botón Desplegar (izquierda), Nombre (centro), Calorías (derecha) */}
      <div
        onClick={handleToggle}
        className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer select-none hover:bg-[#c6f3db] transition-colors rounded-xl"
      >
        {/* Botón de despliegue (Izquierda) */}
        <ButtonDesplegar
          isExpanded={expanded}
          onClick={(e) => {
            e.stopPropagation();
            if (onClickForward) onClickForward();
            handleToggle();
          }}
        />

        {/* Nombre del alimento (Centro) */}
        <span className="font-medium text-lg text-black tracking-wide flex-1 text-left">
          {name}
        </span>

        {/* Cantidad de calorías (Derecha) */}
        <div className="flex items-baseline gap-1 text-[#0c7336] shrink-0">
          <span className="font-bold text-xl">{cal}</span>
          <span className="font-semibold text-xs lowercase">cal</span>
        </div>
      </div>

      {/* Detalle Desplegable con Macronutrientes Calculados, Notas y Botones */}
      {expanded && (
        <div className="px-6 pb-5 pt-2 border-t border-[#1b3d30]/15 flex flex-col gap-2.5 font-mono text-sm text-black animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex justify-between items-center py-0.5">
            <span>Proteinas:</span>
            <span className="font-bold">{displayProteins}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span>Carbohidratos:</span>
            <span className="font-bold">{displayCarbs}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span>Grasas:</span>
            <span className="font-bold">{displayFats}</span>
          </div>

          {notes && (
            <div className="flex flex-col gap-1 pt-1">
              <span className="font-bold">Notas:</span>
              <p className="text-xs text-black/90 leading-relaxed bg-[#e6fbf1]/80 p-3 rounded-xl border border-[#1b3d30]/15 shadow-inner">
                {notes}
              </p>
            </div>
          )}

          {/* Botones de Acción: Descartar y Editar */}
          <div className="grid grid-cols-2 gap-3 pt-3 mt-1 border-t border-[#1b3d30]/15 w-full">
            {/* Descartar */}
            <ButtonCancelar
              onClick={(e) => {
                e.stopPropagation();
                if (onClickDelete) onClickDelete();
              }}
              className="w-full py-3 px-3 text-base justify-center rounded-xl"
            >
              Descartar
            </ButtonCancelar>

            {/* Editar */}
            <ButtonEditar
              onClick={(e) => {
                e.stopPropagation();
                if (onClickEdit) onClickEdit();
              }}
              className="w-full py-3 px-3 text-base justify-center rounded-xl"
            >
              Editar
            </ButtonEditar>
          </div>
        </div>
      )}
    </div>
  );
};

