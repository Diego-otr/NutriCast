"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TitleBar, NavBar } from "@/components/common";
import { ButtonFinDia, ButtonPrimary, ButtonDesplegar } from "@/components/buttons";
import { ItemTracker } from "@/components/lists";
import { AddConsumptionModal, ConfirmModal } from "@/components/modals";
import {
  dailyProgressService,
  DailyProgressResponse,
  DEFAULT_TARGET_CALORIES,
} from "@/features/daily-progress";
import { consumptionLogService } from "@/features/consumption-log";
import { FoodResponse } from "@/features/foods";

interface FoodItem {
  id: string;
  logId?: number;
  cal: number;
  name: string;
  proteins?: number | string;
  carbs?: number | string;
  fats?: number | string;
  notes?: string;
  portions?: number;
  amountGrams?: number;
}

export default function DashboardPage() {
  const router = useRouter();

  // ID del perfil activo cargado desde localStorage
  const [profileId, setProfileId] = useState<number | null>(null);

  // Estados de datos del backend y UI
  const [dailyProgress, setDailyProgress] = useState<DailyProgressResponse | null>(null);
  const [trackerItems, setTrackerItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Estado para desplegar información nutricional acumulada en la card "Total de Calorías"
  const [isTotalCaloriesExpanded, setIsTotalCaloriesExpanded] = useState(false);

  // Estado para acordeón desplegable en Tracker y modal de descarte
  const [expandedTrackerId, setExpandedTrackerId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FoodItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Estado para modal de edición de consumo
  const [itemToEdit, setItemToEdit] = useState<FoodItem | null>(null);
  const [isEditConsumptionModalOpen, setIsEditConsumptionModalOpen] = useState(false);

  // Meta diaria de calorías provista por el backend o constante por defecto (DEFAULT_TARGET_CALORIES)
  const targetCal = Number(dailyProgress?.targetCal || DEFAULT_TARGET_CALORIES);

  // Cargar progreso diario activo del perfil directamente desde el backend
  useEffect(() => {
    let isCancelled = false;

    const fetchActiveDailyProgress = async () => {
      const savedProfileId =
        typeof window !== "undefined"
          ? localStorage.getItem("selected_profile_id")
          : null;

      if (!savedProfileId) {
        router.push("/group");
        return;
      }

      const activeId = Number(savedProfileId);
      if (!isCancelled) setProfileId(activeId);

      try {
        const activeProgress = await dailyProgressService.getActiveByProfile(activeId);
        if (isCancelled) return;

        if (activeProgress) {
          setDailyProgress(activeProgress);

          // Mapear los consumos (consumption_logs) devueltos por el backend
          if (activeProgress.logs && activeProgress.logs.length > 0) {
            const mappedLogs: FoodItem[] = activeProgress.logs.map((log) => ({
              id: String(log.id),
              logId: log.id,
              cal: Number(log.calculatedCalories || 0),
              name: log.food?.name || `Alimento #${log.foodId || log.id}`,
              proteins: log.food?.proteins ?? "-",
              carbs: log.food?.carbs ?? "-",
              fats: log.food?.fats ?? "-",
              notes: log.food?.notes || "Información nutricional registrada en la cuenta compartida.",
              portions: log.portions,
              amountGrams: log.amountGrams,
            }));
            setTrackerItems(mappedLogs);
          } else {
            setTrackerItems([]);
          }
        }
      } catch {
        console.warn("No se pudo conectar con el backend en puerto 3001, usando datos mock iniciales.");
        if (!isCancelled) {
          // Fallback amigable con datos de prueba si el backend está apagado o no responde
          setTrackerItems([
            {
              id: "1",
              cal: 400,
              name: "Pollo al horno",
              proteins: 45,
              carbs: 0,
              fats: 18,
              notes: "Información nutricional registrada en la cuenta compartida.",
            },
            {
              id: "2",
              cal: 50,
              name: "Arroz blanco",
              proteins: 3,
              carbs: 28,
              fats: 0.5,
              notes: "Información nutricional registrada en la cuenta compartida.",
            },
            {
              id: "3",
              cal: 330,
              name: "Milanesa Carne",
              proteins: 28,
              carbs: 15,
              fats: 16,
              notes: "Información nutricional registrada en la cuenta compartida.",
            },
            {
              id: "4",
              cal: 100,
              name: "Fideos",
              proteins: 7,
              carbs: 35,
              fats: 2,
              notes: "Información nutricional registrada en la cuenta compartida.",
            },
          ]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchActiveDailyProgress();

    return () => {
      isCancelled = true;
    };
  }, [profileId, router]);

  // Manejo de acordeón exclusivo
  const handleToggleExpand = (id: string) => {
    setExpandedTrackerId((prevId) => (prevId === id ? null : id));
  };

  // Manejo de confirmación de eliminación/descarte de ítem del tracker
  const handlePromptDelete = (item: FoodItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      if (dailyProgress?.id && itemToDelete.logId) {
        try {
          await consumptionLogService.removeLogFromDailyProgress(
            dailyProgress.id,
            itemToDelete.logId
          );
        } catch (err) {
          console.error("Error al eliminar consumo del backend:", err);
        }
      }
      setTrackerItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Manejo de edición de consumo ingresado
  const handlePromptEdit = (item: FoodItem) => {
    setItemToEdit(item);
    setIsEditConsumptionModalOpen(true);
  };

  const foodForEditModal: FoodResponse | null = itemToEdit
    ? {
        id: itemToEdit.logId || parseInt(itemToEdit.id) || 1,
        name: itemToEdit.name,
        caloriesPerGram:
          itemToEdit.amountGrams && itemToEdit.amountGrams > 0
            ? itemToEdit.cal / itemToEdit.amountGrams
            : undefined,
        caloriesPerPortion:
          itemToEdit.portions && itemToEdit.portions > 0
            ? itemToEdit.cal / itemToEdit.portions
            : itemToEdit.cal,
        proteins:
          typeof itemToEdit.proteins === "number"
            ? itemToEdit.proteins
            : parseFloat(String(itemToEdit.proteins || 0)) || undefined,
        carbs:
          typeof itemToEdit.carbs === "number"
            ? itemToEdit.carbs
            : parseFloat(String(itemToEdit.carbs || 0)) || undefined,
        fats:
          typeof itemToEdit.fats === "number"
            ? itemToEdit.fats
            : parseFloat(String(itemToEdit.fats || 0)) || undefined,
        notes: itemToEdit.notes,
      }
    : null;

  const handleConfirmEditConsumption = async (data: {
    foodId: number;
    portions?: number;
    amountGrams?: number;
    calculatedCalories: number;
  }) => {
    if (itemToEdit) {
      if (itemToEdit.logId) {
        try {
          await consumptionLogService.update(itemToEdit.logId, {
            portions: data.portions,
            amountGrams: data.amountGrams,
            calculatedCalories: data.calculatedCalories,
          });
        } catch (err) {
          console.error("Error al actualizar consumo en el backend:", err);
        }
      }

      setTrackerItems((prev) =>
        prev.map((item) => {
          if (item.id === itemToEdit.id) {
            return {
              ...item,
              cal: data.calculatedCalories,
              portions: data.portions,
              amountGrams: data.amountGrams,
            };
          }
          return item;
        })
      );
    }
    setIsEditConsumptionModalOpen(false);
    setItemToEdit(null);
  };

  // Cálculo de calorías consumidas y meta diaria
  const totalConsumed = trackerItems.reduce((acc, item) => acc + item.cal, 0);

  // Cálculo de macronutrientes acumulados cargados hasta el momento
  const totalProteins =
    Math.round(
      trackerItems.reduce((acc, item) => {
        const base =
          typeof item.proteins === "number"
            ? item.proteins
            : parseFloat(String(item.proteins || 0)) || 0;
        let val = base;
        if (item.portions && item.portions > 0) val = item.portions * base;
        else if (item.amountGrams && item.amountGrams > 0) val = (item.amountGrams / 100) * base;
        return acc + val;
      }, 0) * 10
    ) / 10;

  const totalCarbs =
    Math.round(
      trackerItems.reduce((acc, item) => {
        const base =
          typeof item.carbs === "number"
            ? item.carbs
            : parseFloat(String(item.carbs || 0)) || 0;
        let val = base;
        if (item.portions && item.portions > 0) val = item.portions * base;
        else if (item.amountGrams && item.amountGrams > 0) val = (item.amountGrams / 100) * base;
        return acc + val;
      }, 0) * 10
    ) / 10;

  const totalFats =
    Math.round(
      trackerItems.reduce((acc, item) => {
        const base =
          typeof item.fats === "number"
            ? item.fats
            : parseFloat(String(item.fats || 0)) || 0;
        let val = base;
        if (item.portions && item.portions > 0) val = item.portions * base;
        else if (item.amountGrams && item.amountGrams > 0) val = (item.amountGrams / 100) * base;
        return acc + val;
      }, 0) * 10
    ) / 10;

  // Acción de finalizar el día conectando con el backend
  const handleConfirmFinalizarDia = async () => {
    try {
      if (dailyProgress?.id) {
        const newDailyProgress = await dailyProgressService.finalizeDay(dailyProgress.id);
        if (newDailyProgress) {
          setDailyProgress(newDailyProgress);
        }
      }
    } catch (err) {
      console.error("Error al finalizar el día en el backend:", err);
    } finally {
      setTrackerItems([]);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7e6] text-black flex flex-col items-center justify-between font-mono">
      {/* Contenedor vista móvil */}
      <main className="w-full max-w-md min-h-screen flex flex-col justify-between pb-20 relative bg-[#f3f7e6]">
        {/* Header Superior - TitleBar pegado al tope y rectangular */}
        <div className="sticky top-0 z-40 w-full">
          <TitleBar title="NutriTracker" />
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 px-4 flex flex-col gap-4 py-4">
          {/* Card: Total de Calorías */}
          <section className="bg-[#a7f5d0] rounded-3xl p-5 border border-[#1b3d30] shadow-lg flex flex-col transition-all duration-200">
            <div
              onClick={() => setIsTotalCaloriesExpanded((prev) => !prev)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <h2 className="text-xl font-bold text-black tracking-tight">
                Total de Calorías
              </h2>

              <ButtonDesplegar
                isExpanded={isTotalCaloriesExpanded}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTotalCaloriesExpanded((prev) => !prev);
                }}
              />
            </div>

            <div
              onClick={() => setIsTotalCaloriesExpanded((prev) => !prev)}
              className="w-full flex items-center justify-center py-2 cursor-pointer select-none"
            >
              <span className="text-4xl md:text-5xl font-extrabold text-[#0c7336] tracking-tight">
                {isLoading ? "..." : `${totalConsumed}/${targetCal}`}
              </span>
            </div>

            {/* Sección desplegable con los datos avanzados de macronutrientes acumulados */}
            {isTotalCaloriesExpanded && (
              <div className="border-t border-[#1b3d30]/15 pt-3 mt-1 flex flex-col gap-2 font-mono text-sm text-black animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex justify-between items-center py-0.5">
                  <span>Proteínas totales:</span>
                  <span className="font-bold">{totalProteins > 0 ? `${totalProteins} g` : "0 g"}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span>Carbohidratos totales:</span>
                  <span className="font-bold">{totalCarbs > 0 ? `${totalCarbs} g` : "0 g"}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span>Grasas totales:</span>
                  <span className="font-bold">{totalFats > 0 ? `${totalFats} g` : "0 g"}</span>
                </div>
              </div>
            )}
          </section>

          {/* Botón: Finalizar Día */}
          <div className="w-full">
            <ButtonFinDia
              onClick={() => setIsConfirmModalOpen(true)}
              className="w-full py-4 justify-center shadow-lg text-xl"
            />
          </div>

          {/* Card / Lista: Tracker */}
          <section className="bg-[#a7f5d0] rounded-3xl overflow-hidden border border-[#1b3d30] shadow-lg flex flex-col">
            <div className="px-6 py-3 border-b border-[#1b3d30]/20 bg-[#a7f5d0]">
              <h3 className="text-xl font-bold text-black tracking-wide">
                Tracker
              </h3>
            </div>

            <div className="p-3 flex flex-col gap-2.5 max-h-[360px] overflow-y-auto">
              {isLoading ? (
                <div className="py-8 text-center text-zinc-700 font-sans italic text-sm">
                  Cargando consumos del día...
                </div>
              ) : trackerItems.length > 0 ? (
                trackerItems.map((item) => (
                  <ItemTracker
                    key={item.id}
                    cal={item.cal}
                    name={item.name}
                    proteins={item.proteins}
                    carbs={item.carbs}
                    fats={item.fats}
                    notes={item.notes}
                    portions={item.portions}
                    amountGrams={item.amountGrams}
                    isExpanded={expandedTrackerId === item.id}
                    onToggleExpand={() => handleToggleExpand(item.id)}
                    onClickDelete={() => handlePromptDelete(item)}
                    onClickEdit={() => handlePromptEdit(item)}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-zinc-600 font-sans italic text-sm">
                  No hay alimentos en el tracker. ¡Comienza registrando tu primer consumo!
                </div>
              )}
            </div>
          </section>

          {/* Botón: Registrar Comida */}
          <div className="w-full mt-1">
            <ButtonPrimary
              onClick={() => router.push("/foods")}
              className="w-full py-4 justify-center shadow-lg text-xl"
            >
              Registrar Comida
            </ButtonPrimary>
          </div>
        </div>

        {/* Footer Inferior Fijo - NavBar pegado al fondo y rectangular */}
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
          <NavBar activeTab="inicio" className="w-full" />
        </footer>
      </main>

      {/* Modal para Editar Consumo Seleccionado */}
      <AddConsumptionModal
        isOpen={isEditConsumptionModalOpen}
        food={foodForEditModal}
        initialPortions={itemToEdit?.portions}
        initialAmountGrams={itemToEdit?.amountGrams}
        onClose={() => {
          setIsEditConsumptionModalOpen(false);
          setItemToEdit(null);
        }}
        onConfirm={handleConfirmEditConsumption}
      />

      {/* Modal de Confirmación para Finalizar Día */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Finalizar Día"
        text="¿Estás seguro de que deseas finalizar el día?"
        confirmText="Confirmar"
        cancelText="Volver"
        onConfirm={handleConfirmFinalizarDia}
        onCancel={() => setIsConfirmModalOpen(false)}
      />

      {/* Modal de Confirmación para Descartar Consumo del Tracker */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Descartar Consumo"
        text={`¿Estás seguro de que deseas descartar "${itemToDelete?.name}" del tracker?`}
        confirmText="Confirmar"
        cancelText="Volver"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}
