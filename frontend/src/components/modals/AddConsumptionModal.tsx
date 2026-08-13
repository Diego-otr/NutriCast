"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { ItemFormField } from "@/components/lists";
import { ButtonPrimary, ButtonCancelar } from "@/components/buttons";
import { FoodResponse } from "@/features/foods";

export interface AddConsumptionModalProps {
  isOpen: boolean;
  food: FoodResponse | null;
  initialPortions?: number;
  initialAmountGrams?: number;
  onClose: () => void;
  onConfirm: (data: {
    foodId: number;
    portions?: number;
    amountGrams?: number;
    calculatedCalories: number;
  }) => Promise<void> | void;
}

export const AddConsumptionModal: React.FC<AddConsumptionModalProps> = ({
  isOpen,
  food,
  initialPortions,
  initialAmountGrams,
  onClose,
  onConfirm,
}) => {
  // Modo de ingreso: "portions" | "grams"
  const [unitMode, setUnitMode] = useState<"portions" | "grams">("portions");
  const [inputValue, setInputValue] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialPortions !== undefined || initialAmountGrams !== undefined);

  // Sincronizar estado al abrir el modal sin causar renders en cascada
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevFood, setPrevFood] = useState<FoodResponse | null>(null);
  const [prevPortions, setPrevPortions] = useState<number | undefined>(undefined);
  const [prevGrams, setPrevGrams] = useState<number | undefined>(undefined);

  if (
    isOpen !== prevIsOpen ||
    food !== prevFood ||
    initialPortions !== prevPortions ||
    initialAmountGrams !== prevGrams
  ) {
    setPrevIsOpen(isOpen);
    setPrevFood(food);
    setPrevPortions(initialPortions);
    setPrevGrams(initialAmountGrams);

    if (isOpen) {
      if (initialAmountGrams !== undefined && initialAmountGrams > 0) {
        setUnitMode("grams");
        setInputValue(String(initialAmountGrams));
      } else if (initialPortions !== undefined && initialPortions > 0) {
        setUnitMode("portions");
        setInputValue(String(initialPortions));
      } else {
        setUnitMode("portions");
        setInputValue("1");
      }
      setIsSubmitting(false);
    }
  }

  if (!isOpen || !food) return null;

  const numValue = Math.max(0, parseFloat(inputValue) || 0);
  const isConfirmDisabled = isSubmitting || numValue <= 0 || inputValue.trim() === "";

  // Cálculos en tiempo real según el modo seleccionado
  let calculatedCalories = 0;
  let calculatedProteins = 0;
  let calculatedCarbs = 0;
  let calculatedFats = 0;

  const baseCalPerPortion = Number(
    food.caloriesPerPortion ?? (food.caloriesPerGram ? food.caloriesPerGram * 100 : 0)
  );
  const baseCalPerGram = Number(
    food.caloriesPerGram ?? (food.caloriesPerPortion ? food.caloriesPerPortion / 100 : 0)
  );

  const baseProteins = Number(food.proteins ?? 0);
  const baseCarbs = Number(food.carbs ?? 0);
  const baseFats = Number(food.fats ?? 0);

  if (unitMode === "portions") {
    calculatedCalories = Math.round(numValue * baseCalPerPortion);
    calculatedProteins = Math.round(numValue * baseProteins * 10) / 10;
    calculatedCarbs = Math.round(numValue * baseCarbs * 10) / 10;
    calculatedFats = Math.round(numValue * baseFats * 10) / 10;
  } else {
    // Modo gramos
    calculatedCalories = Math.round(numValue * baseCalPerGram);
    const gramRatio = numValue / 100;
    calculatedProteins = Math.round(gramRatio * baseProteins * 10) / 10;
    calculatedCarbs = Math.round(gramRatio * baseCarbs * 10) / 10;
    calculatedFats = Math.round(gramRatio * baseFats * 10) / 10;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirmDisabled) return;

    try {
      setIsSubmitting(true);
      await onConfirm({
        foodId: food.id,
        portions: unitMode === "portions" ? numValue : undefined,
        amountGrams: unitMode === "grams" ? numValue : undefined,
        calculatedCalories,
      });
      onClose();
    } catch (err) {
      console.error("Error al registrar consumo:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Contenedor Modal */}
      <div className="w-full max-w-sm bg-[#a7f5d0] border-2 border-[#1b3d30] rounded-3xl overflow-hidden shadow-2xl flex flex-col font-mono text-black">
        {/* Cabecera del Modal */}
        <div className="relative px-6 py-4 border-b border-[#1b3d30]/20 bg-[#a7f5d0] text-center">
          <h3 className="text-xl font-bold text-black tracking-wide pr-6">
            {isEditing ? `Editar "${food.name}"` : `Registrar "${food.name}"`}
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute right-3 top-3.5 p-1 rounded-full text-black hover:bg-black/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Selector de Unidad: Porciones / Gramos */}
          <div className="p-4 border-b border-[#1b3d30]/15 bg-[#c5f8df] flex flex-col gap-2">
            <label className="font-semibold text-sm text-black tracking-wide">
              Medir por:
            </label>

            <div className="grid grid-cols-2 gap-2 p-1 bg-[#a7f5d0] rounded-full border border-[#1b3d30]/30">
              <button
                type="button"
                onClick={() => {
                  setUnitMode("portions");
                  setInputValue(initialPortions ? String(initialPortions) : "1");
                }}
                className={`py-2 rounded-full font-bold text-sm transition-all ${
                  unitMode === "portions"
                    ? "bg-[#368482] text-white shadow"
                    : "text-black hover:bg-black/5"
                }`}
              >
                Porciones
              </button>

              <button
                type="button"
                onClick={() => {
                  setUnitMode("grams");
                  setInputValue(initialAmountGrams ? String(initialAmountGrams) : "100");
                }}
                className={`py-2 rounded-full font-bold text-sm transition-all ${
                  unitMode === "grams"
                    ? "bg-[#368482] text-white shadow"
                    : "text-black hover:bg-black/5"
                }`}
              >
                Gramos (g)
              </button>
            </div>
          </div>

          {/* Campo de ingreso numérico */}
          <ItemFormField
            label={unitMode === "portions" ? "Cantidad de Porciones" : "Peso en Gramos"}
            placeholder={unitMode === "portions" ? "Ej. 1.5" : "Ej. 150"}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          {/* Tarjeta de Valores Calculados en Tiempo Real */}
          <div className="p-4 mx-4 my-3 bg-[#e8fce8] border border-[#1b3d30]/25 rounded-2xl flex flex-col gap-2 shadow-inner text-sm">
            <h4 className="font-bold text-base border-b border-[#1b3d30]/15 pb-1 text-[#0c7336]">
              Aporte del consumo:
            </h4>

            <div className="flex justify-between items-center font-bold text-base text-black">
              <span>Calorías totales:</span>
              <span className="text-lg text-[#0c7336]">{calculatedCalories} cal</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Proteínas:</span>
              <span className="font-bold">{calculatedProteins > 0 ? `${calculatedProteins} g` : "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Carbohidratos:</span>
              <span className="font-bold">{calculatedCarbs > 0 ? `${calculatedCarbs} g` : "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Grasas:</span>
              <span className="font-bold">{calculatedFats > 0 ? `${calculatedFats} g` : "-"}</span>
            </div>
          </div>

          {/* Botoneras: Confirmar / Volver */}
          <div className="p-4 bg-[#a7f5d0] border-t border-[#1b3d30]/15 flex flex-col gap-2">
            <ButtonPrimary
              type="submit"
              disabled={isConfirmDisabled}
              icon={<Check className="w-5 h-5 stroke-[3]" />}
              className={`w-full justify-center py-3.5 text-lg rounded-full shadow-lg ${
                isConfirmDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            >
              {isEditing ? "Guardar Cambios" : "Agregar al Consumo"}
            </ButtonPrimary>

            <ButtonCancelar
              type="button"
              onClick={onClose}
              className="w-full justify-center py-3 text-base rounded-full shadow"
            >
              Volver
            </ButtonCancelar>
          </div>
        </form>
      </div>
    </div>
  );
};
