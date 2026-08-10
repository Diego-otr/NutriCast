"use client";

import React, { useState, useEffect } from "react";
import { TitleBar, NavBar } from "@/components/common";
import { ButtonFinDia, ButtonPrimary } from "@/components/buttons";
import { ItemTracker } from "@/components/lists";
import { ConfirmModal } from "@/components/modals";
import {
  dailyProgressService,
  DailyProgressResponse,
  DEFAULT_TARGET_CALORIES,
} from "@/features/daily-progress";

interface FoodItem {
  id: string;
  cal: number;
  name: string;
}

export default function DashboardPage() {
  // ID del perfil activo (estilo Netflix). En un futuro provendrá del ProfileContext
  const profileId = 1;

  // Estados de datos del backend y UI
  const [dailyProgress, setDailyProgress] = useState<DailyProgressResponse | null>(null);
  const [trackerItems, setTrackerItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Meta diaria de calorías provista por el backend o constante por defecto (DEFAULT_TARGET_CALORIES)
  const targetCal = Number(dailyProgress?.targetCal || DEFAULT_TARGET_CALORIES);

  // Cargar progreso diario activo del perfil directamente desde el backend
  useEffect(() => {
    let isCancelled = false;

    const fetchActiveDailyProgress = async () => {
      try {
        const activeProgress = await dailyProgressService.getActiveByProfile(profileId);
        if (isCancelled) return;

        if (activeProgress) {
          setDailyProgress(activeProgress);

          // Mapear los consumos (consumption_logs) devueltos por el backend
          if (activeProgress.logs && activeProgress.logs.length > 0) {
            const mappedLogs: FoodItem[] = activeProgress.logs.map((log) => ({
              id: String(log.id),
              cal: Number(log.calculatedCalories || 0),
              name: log.food?.name || `Alimento #${log.foodId || log.id}`,
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
            { id: "1", cal: 400, name: "Pollo al horno" },
            { id: "2", cal: 50, name: "Arroz blanco" },
            { id: "3", cal: 330, name: "Milanesa Carne" },
            { id: "4", cal: 100, name: "Fideos" },
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
  }, [profileId]);

  // Cálculo de calorías consumidas y restantes basadas en targetCal del backend
  const totalConsumed = trackerItems.reduce((acc, item) => acc + item.cal, 0);
  const remainingCalories = Math.max(0, targetCal - totalConsumed);

  // Acción de finalizar el día conectando con el backend
  const handleConfirmFinalizarDia = async () => {
    try {
      if (dailyProgress?.id) {
        // Enviar indicación de finalizar día al backend en NestJS y recibir el nuevo registro diario generado
        const newDailyProgress = await dailyProgressService.finalizeDay(dailyProgress.id);
        if (newDailyProgress) {
          setDailyProgress(newDailyProgress);
        }
        console.log(`Día finalizado en el backend. Creado nuevo registro de progreso activo con ID: ${newDailyProgress?.id || 'nuevo'}`);
      }
    } catch (err) {
      console.error("Error al finalizar el día en el backend:", err);
    } finally {
      // Limpiar la lista del tracker en pantalla y cerrar modal
      setTrackerItems([]);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#192a68] text-black flex flex-col items-center justify-between font-mono">
      {/* Contenedor vista móvil */}
      <main className="w-full max-w-md min-h-screen flex flex-col justify-between pb-20 relative bg-[#192a68]">
        {/* Header Superior - TitleBar pegado al tope y rectangular */}
        <div className="sticky top-0 z-40 w-full">
          <TitleBar title="MiApp" />
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 px-4 flex flex-col gap-4 py-4">
          {/* Card: Calorías Restantes */}
          <section className="bg-[#a7f5d0] rounded-3xl p-5 border border-[#1b3d30] shadow-lg flex flex-col items-start justify-center">
            <h2 className="text-lg font-semibold text-black tracking-tight">
              Calorías Restantes
            </h2>
            <div className="w-full flex items-center justify-center py-2">
              <span className="text-5xl md:text-6xl font-extrabold text-[#0c7336] tracking-tight">
                {isLoading ? "..." : remainingCalories}
              </span>
            </div>
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

            <div className="p-3 flex flex-col gap-2.5 max-h-[280px] overflow-y-auto">
              {isLoading ? (
                <div className="py-8 text-center text-zinc-700 font-sans italic text-sm">
                  Cargando consumos del día...
                </div>
              ) : trackerItems.length > 0 ? (
                trackerItems.map((item) => (
                  <ItemTracker key={item.id} cal={item.cal} name={item.name} />
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
            <ButtonPrimary className="w-full py-4 justify-center shadow-lg text-xl" />
          </div>
        </div>

        {/* Footer Inferior Fijo - NavBar pegado al fondo y rectangular */}
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
          <NavBar activeTab="inicio" className="w-full" />
        </footer>
      </main>

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
    </div>
  );
}
