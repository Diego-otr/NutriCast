"use client";

import React, { useState } from "react";
import { TitleBar, NavBar } from "@/components/common";
import { ButtonFinDia, ButtonPrimary } from "@/components/buttons";
import { ItemTracker } from "@/components/lists";

interface FoodItem {
  id: string;
  cal: number;
  name: string;
}

export default function DashboardPage() {
  const dailyGoal = 2380; // Meta diaria de calorías del perfil

  // Lista inicial de alimentos consumidos en el día (mock de CONSUMPTION_LOG)
  const [trackerItems, setTrackerItems] = useState<FoodItem[]>([
    { id: "1", cal: 400, name: "Pollo al horno" },
    { id: "2", cal: 50, name: "Arroz blanco" },
    { id: "3", cal: 330, name: "Milanesa Carne" },
    { id: "4", cal: 100, name: "Fideos" },
  ]);

  // Cálculo de calorías consumidas y restantes
  const totalConsumed = trackerItems.reduce((acc, item) => acc + item.cal, 0);
  const remainingCalories = Math.max(0, dailyGoal - totalConsumed);

  const handleFinalizarDia = () => {
    // TODO: En un futuro, enviar al backend (NestJS) la indicación de terminar el día
    // Ejemplo API: await api.post('/daily-progress/finalize', { profile_id, reference_date })
    console.log("Día finalizado. Enviando indicación al backend...");

    // Limpia la lista de alimentos del tracker
    setTrackerItems([]);
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
          {/* Card: Calorías Restantes (Información más importante) */}
          <section className="bg-[#a7f5d0] rounded-3xl p-5 border border-[#1b3d30] shadow-lg flex flex-col items-start justify-center">
            <h2 className="text-lg font-semibold text-black tracking-tight">
              Calorías Restantes
            </h2>
            <div className="w-full flex items-center justify-center py-2">
              <span className="text-5xl md:text-6xl font-extrabold text-[#0c7336] tracking-tight">
                {remainingCalories}
              </span>
            </div>
          </section>

          {/* Botón: Finalizar Día */}
          <div className="w-full">
            <ButtonFinDia
              onClick={handleFinalizarDia}
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
              {trackerItems.length > 0 ? (
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
    </div>
  );
}
