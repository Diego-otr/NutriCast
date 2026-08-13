"use client";

import React, { useState } from "react";
import { ArrowDown, ArrowUp, X, Check } from "lucide-react";
import { ItemFormField } from "@/components/lists";
import { ButtonPrimary, ButtonCancelar } from "@/components/buttons";
import { FoodResponse } from "@/features/foods";

export interface FoodModalProps {
  isOpen: boolean;
  foodToEdit?: FoodResponse | null;
  onClose: () => void;
  onSubmit: (data: Partial<FoodResponse>) => Promise<void> | void;
}

export const FoodModal: React.FC<FoodModalProps> = ({
  isOpen,
  foodToEdit,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(foodToEdit);

  // Estados de formulario
  const [name, setName] = useState("");
  const [caloriesPerGram, setCaloriesPerGram] = useState("");
  const [caloriesPerPortion, setCaloriesPerPortion] = useState("");
  
  // Estado para desplegar campos secundarios (Avanzado)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [proteins, setProteins] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sincronizar estados del formulario al cambiar props durante el render (evita renders en cascada por useEffect)
  const [prevFoodToEdit, setPrevFoodToEdit] = useState<FoodResponse | null | undefined>(undefined);
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(false);

  if (foodToEdit !== prevFoodToEdit || isOpen !== prevIsOpen) {
    setPrevFoodToEdit(foodToEdit);
    setPrevIsOpen(isOpen);

    if (foodToEdit) {
      setName(foodToEdit.name || "");
      setCaloriesPerGram(
        foodToEdit.caloriesPerGram ? String(foodToEdit.caloriesPerGram) : ""
      );
      setCaloriesPerPortion(
        foodToEdit.caloriesPerPortion ? String(foodToEdit.caloriesPerPortion) : ""
      );
      setProteins(foodToEdit.proteins ? String(foodToEdit.proteins) : "");
      setCarbs(foodToEdit.carbs ? String(foodToEdit.carbs) : "");
      setFats(foodToEdit.fats ? String(foodToEdit.fats) : "");
      setNotes(foodToEdit.notes || "");
      setIsAdvancedOpen(false);
    } else {
      setName("");
      setCaloriesPerGram("");
      setCaloriesPerPortion("");
      setProteins("");
      setCarbs("");
      setFats("");
      setNotes("");
      setIsAdvancedOpen(false);
    }
  }

  if (!isOpen) return null;

  // Validación de requerimientos: Nombre no vacío y al menos 1 de los 2 campos de calorías ingresado
  const isNameValid = name.trim().length > 0;
  const hasCalPerGram = Boolean(caloriesPerGram && parseFloat(caloriesPerGram) > 0);
  const hasCalPerPortion = Boolean(caloriesPerPortion && parseFloat(caloriesPerPortion) > 0);
  const isFormValid = isNameValid && (hasCalPerGram || hasCalPerPortion);
  const isConfirmDisabled = isSubmitting || !isFormValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirmDisabled) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...(foodToEdit?.id ? { id: foodToEdit.id } : {}),
        name,
        caloriesPerGram: caloriesPerGram ? parseFloat(caloriesPerGram) : undefined,
        caloriesPerPortion: caloriesPerPortion ? parseFloat(caloriesPerPortion) : undefined,
        proteins: proteins ? parseFloat(proteins) : undefined,
        carbs: carbs ? parseFloat(carbs) : undefined,
        fats: fats ? parseFloat(fats) : undefined,
        notes: notes || undefined,
      });
      onClose();
    } catch (err) {
      console.error("Error al guardar alimento:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Contenedor Modal */}
      <div className="w-full max-w-sm bg-[#a7f5d0] border-2 border-[#1b3d30] rounded-3xl overflow-hidden shadow-2xl flex flex-col font-mono text-black">
        {/* Cabecera del Modal con Título dinámico */}
        <div className="relative px-6 py-4 border-b border-[#1b3d30]/20 bg-[#a7f5d0] text-center">
          <h3 className="text-xl font-bold text-black tracking-wide pr-6">
            {isEditing ? `Editar "${foodToEdit?.name}"` : "Agregando Alimento"}
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
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 max-h-[80vh] overflow-y-auto">
          {/* Campos Principales Obligatorios */}
          <ItemFormField
            label="Nombre"
            placeholder="Nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <ItemFormField
            label="Calorías/Gramo"
            placeholder="Cal..."
            type="number"
            value={caloriesPerGram}
            onChange={(e) => setCaloriesPerGram(e.target.value)}
          />

          <ItemFormField
            label="Calorías/Porción"
            placeholder="Cal..."
            type="number"
            value={caloriesPerPortion}
            onChange={(e) => setCaloriesPerPortion(e.target.value)}
          />

          {/* Botón para Desplegar Campos Avanzados */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen((prev) => !prev)}
            className="w-full px-5 py-3.5 bg-[#a7f5d0] flex items-center justify-center gap-3 font-bold text-base text-black hover:bg-[#96ebc2] transition-colors border-b border-[#1b3d30]/20 select-none"
          >
            <span>Avanzado</span>
            <span className="w-7 h-7 rounded-full bg-[#368482] text-white flex items-center justify-center shadow">
              {isAdvancedOpen ? (
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              )}
            </span>
          </button>

          {/* Campos Avanzados Secundarios */}
          {isAdvancedOpen && (
            <div className="flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
              <ItemFormField
                label="Proteínas (g)"
                placeholder="Gramos..."
                type="number"
                value={proteins}
                onChange={(e) => setProteins(e.target.value)}
              />

              <ItemFormField
                label="Carbohidratos (g)"
                placeholder="Gramos..."
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />

              <ItemFormField
                label="Grasas (g)"
                placeholder="Gramos..."
                type="number"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
              />

              <ItemFormField
                label="Notas"
                placeholder="Ingresar observaciones o notas..."
                isTextArea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          )}

          {/* Botón de Confirmación al Pie del Formulario */}
          <div className="p-4 bg-[#a7f5d0] flex flex-col gap-2">
            <ButtonPrimary
              type="submit"
              disabled={isConfirmDisabled}
              icon={<Check className="w-5 h-5 stroke-[3]" />}
              className={`w-full justify-center py-3.5 text-lg rounded-full shadow-lg ${
                isConfirmDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            >
              {isEditing ? "Guardar Cambios" : "Confirmar Alimento"}
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
