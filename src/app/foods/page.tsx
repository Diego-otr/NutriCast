"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TitleBar, NavBar } from "@/components/common";
import { ButtonPrimary } from "@/components/buttons";
import { ItemFoodList } from "@/components/lists";
import { FoodModal, ConfirmModal, AddConsumptionModal } from "@/components/modals";
import { foodsService, FoodResponse } from "@/features/foods";
import { dailyProgressService } from "@/features/daily-progress";
import { consumptionLogService } from "@/features/consumption-log";
import { authService } from "@/features/auth/services/auth.service";

export default function FoodsPage() {
  const router = useRouter();
  const accountId = 1; // ID de la cuenta compartida
  const [profileId, setProfileId] = useState<number | null>(null);
  const [groupName, setGroupName] = useState<string>("Mi Grupo");

  const [foods, setFoods] = useState<FoodResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Estado para permitir desplegar únicamente 1 ítem a la vez (acordeón exclusivo)
  const [expandedFoodId, setExpandedFoodId] = useState<number | null>(null);

  // Estados del modal de alimento (Crear / Editar)
  const [isFoodModalOpen, setIsFoodModalOpen] = useState<boolean>(false);
  const [selectedFoodToEdit, setSelectedFoodToEdit] = useState<FoodResponse | null>(null);

  // Estados del modal de confirmación de eliminación (Descartar)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [foodToDelete, setFoodToDelete] = useState<FoodResponse | null>(null);

  // Estados del modal para registrar consumo en el tracker
  const [isAddConsumptionModalOpen, setIsAddConsumptionModalOpen] = useState<boolean>(false);
  const [foodForConsumption, setFoodForConsumption] = useState<FoodResponse | null>(null);

  const handleToggleExpand = (id: number) => {
    setExpandedFoodId((prevId) => (prevId === id ? null : id));
  };

  // Cargar lista de alimentos registrados desde el backend
  const fetchFoods = async () => {
    try {
      const data = await foodsService.findByAccount(accountId);
      if (Array.isArray(data)) {
        setFoods(data);
      } else {
        setFoods([]);
      }
    } catch {
      console.warn("No se pudo conectar con el backend.");
      setFoods([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const loadFoods = async () => {
      const savedProfileId =
        typeof window !== "undefined"
          ? localStorage.getItem("selected_profile_id")
          : null;

      if (!savedProfileId) {
        router.push("/group");
        return;
      }

      if (!isCancelled) setProfileId(Number(savedProfileId));

      try {
        const meData = await authService.getMe();
        if (!isCancelled && meData.account?.groupName) {
          setGroupName(meData.account.groupName);
        }

        const data = await foodsService.findByAccount(accountId);
        if (isCancelled) return;

        if (Array.isArray(data)) {
          setFoods(data);
        } else {
          setFoods([]);
        }
      } catch {
        if (!isCancelled) {
          setFoods([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadFoods();

    return () => {
      isCancelled = true;
    };
  }, [router]);

  // Abrir modal para crear nuevo alimento
  const handleOpenCreateModal = () => {
    setSelectedFoodToEdit(null);
    setIsFoodModalOpen(true);
  };

  // Abrir modal para editar alimento existente
  const handleOpenEditModal = (food: FoodResponse) => {
    setSelectedFoodToEdit(food);
    setIsFoodModalOpen(true);
  };

  // Abrir modal de confirmación para eliminar alimento
  const handlePromptDeleteFood = (food: FoodResponse) => {
    setFoodToDelete(food);
    setIsDeleteModalOpen(true);
  };

  // Confirmar eliminación del alimento
  const handleConfirmDeleteFood = async () => {
    if (foodToDelete) {
      try {
        if (foodToDelete.id) {
          await foodsService.delete(foodToDelete.id);
        }
        showNotification(`Descartado: ${foodToDelete.name}`);
        fetchFoods();
      } catch (err) {
        console.error("Error al eliminar alimento:", err);
        setFoods((prev) => prev.filter((f) => f.id !== foodToDelete.id));
        showNotification(`Descartado: ${foodToDelete.name}`);
      }
    }
    setIsDeleteModalOpen(false);
    setFoodToDelete(null);
  };

  // Guardar (Crear o Editar) alimento en el backend
  const handleSubmitFood = async (formData: Partial<FoodResponse>) => {
    try {
      if (selectedFoodToEdit?.id) {
        // Modo Editar
        await foodsService.update(selectedFoodToEdit.id, formData);
        showNotification(`¡Alimento "${formData.name}" actualizado!`);
      } else {
        // Modo Crear
        await foodsService.create({
          name: formData.name || "Nuevo Alimento",
          caloriesPerGram: formData.caloriesPerGram,
          caloriesPerPortion: formData.caloriesPerPortion,
          proteins: formData.proteins,
          carbs: formData.carbs,
          fats: formData.fats,
          notes: formData.notes,
          accountId,
        });
        showNotification(`¡Alimento "${formData.name}" creado correctamente!`);
      }
      fetchFoods();
    } catch (err) {
      console.error("Error al guardar alimento en el backend:", err);
      // Actualización local si el backend está apagado
      if (selectedFoodToEdit?.id) {
        setFoods((prev) =>
          prev.map((f) => (f.id === selectedFoodToEdit.id ? { ...f, ...formData } : f))
        );
      } else {
        setFoods((prev) => [
          ...prev,
          { id: Date.now(), name: formData.name || "Nuevo Alimento", ...formData },
        ]);
      }
      showNotification(`Guardado: ${formData.name}`);
    }
  };

  // Abrir modal de consumo al hacer clic en el botón (+)
  const handleOpenAddConsumptionModal = (food: FoodResponse) => {
    setFoodForConsumption(food);
    setIsAddConsumptionModalOpen(true);
  };

  // Confirmar y guardar el consumo diario en el backend
  const handleConfirmAddConsumption = async (data: {
    foodId: number;
    portions?: number;
    amountGrams?: number;
    calculatedCalories: number;
  }) => {
    if (!profileId) return;
    try {
      const activeProgress = await dailyProgressService.getActiveByProfile(profileId);
      if (activeProgress?.id) {
        await consumptionLogService.addLogToDailyProgress(activeProgress.id, {
          dailyProgressId: activeProgress.id,
          foodId: data.foodId,
          portions: data.portions,
          amountGrams: data.amountGrams,
          calculatedCalories: data.calculatedCalories,
        });
      }
      showNotification(`¡${foodForConsumption?.name || 'Alimento'} agregado a tu consumo diario!`);
    } catch (err) {
      console.error("Error al agregar alimento al consumo:", err);
      showNotification(`Agregado a tu consumo diario`);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f3f7e6] text-[#171717] flex flex-col items-center justify-between font-mono">
      {/* Contenedor vista móvil */}
      <main className="w-full max-w-md min-h-screen flex flex-col justify-between pb-20 relative bg-[#f3f7e6]">
        {/* Header Superior - TitleBar pegado al tope */}
        <div className="sticky top-0 z-40 w-full">
          <TitleBar title="NutriCast" />
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 px-4 flex flex-col gap-4 py-4 min-h-0">
          {/* Card / Lista de Alimentos de la Familia/Grupo */}
          <section className="bg-[#a7f5d0] rounded-3xl overflow-hidden border border-[#1b3d30] shadow-lg flex flex-col flex-1 min-h-0">
            {/* Título de la tarjeta */}
            <div className="px-6 py-3 border-b border-[#1b3d30]/20 bg-[#a7f5d0] text-center shrink-0">
              <h2 className="text-xl font-bold text-black tracking-wide">
                Lista de {groupName}
              </h2>
            </div>

            {/* Botón: Nuevo Alimento ubicado debajo del título y sobre la lista */}
            <div className="p-3 border-b border-[#1b3d30]/15 shrink-0">
              <ButtonPrimary
                onClick={handleOpenCreateModal}
                className="w-full py-3.5 justify-center shadow-md text-lg"
              >
                Nuevo Alimento
              </ButtonPrimary>
            </div>

            {/* Lista de alimentos desplazable */}
            <div className="p-3 flex flex-col gap-2.5 overflow-y-auto flex-1 min-h-0">
              {isLoading ? (
                <div className="py-12 text-center text-zinc-700 font-sans italic text-sm">
                  Cargando lista de alimentos...
                </div>
              ) : foods.length > 0 ? (
                foods.map((food) => (
                  <ItemFoodList
                    key={food.id}
                    name={food.name}
                    isExpanded={expandedFoodId === food.id}
                    onToggleExpand={() => handleToggleExpand(food.id)}
                    caloriesPerGram={food.caloriesPerGram ?? "0.6"}
                    caloriesPerPortion={food.caloriesPerPortion ?? "122"}
                    proteins={food.proteins ?? "-"}
                    carbs={food.carbs ?? "-"}
                    fats={food.fats ?? "-"}
                    notes={food.notes || "Información nutricional registrada en la cuenta compartida."}
                    onClickDelete={() => handlePromptDeleteFood(food)}
                    onClickEdit={() => handleOpenEditModal(food)}
                    onClickAdd={() => handleOpenAddConsumptionModal(food)}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-zinc-600 font-sans italic text-sm">
                  No hay alimentos registrados en la cuenta.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Modal para Crear / Editar Alimento */}
        <FoodModal
          isOpen={isFoodModalOpen}
          foodToEdit={selectedFoodToEdit}
          onClose={() => setIsFoodModalOpen(false)}
          onSubmit={handleSubmitFood}
        />

        {/* Modal para Registrar Consumo en el Tracker */}
        <AddConsumptionModal
          isOpen={isAddConsumptionModalOpen}
          food={foodForConsumption}
          onClose={() => setIsAddConsumptionModalOpen(false)}
          onConfirm={handleConfirmAddConsumption}
        />

        {/* Modal de Confirmación para Descartar Alimento */}
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="Descartar Alimento"
          text={`¿Estás seguro de que deseas descartar "${foodToDelete?.name}" de la lista?`}
          confirmText="Confirmar"
          cancelText="Volver"
          onConfirm={handleConfirmDeleteFood}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setFoodToDelete(null);
          }}
        />

        {/* Notificación flotante de feedback */}
        {notification && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#34c759] text-black font-bold px-4 py-2 rounded-full shadow-lg border border-black text-sm z-50 animate-in fade-in slide-in-from-top-2">
            {notification}
          </div>
        )}

        {/* Footer Inferior Fijo - NavBar con pestaña lista activa */}
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
          <NavBar activeTab="lista" className="w-full" />
        </footer>
      </main>
    </div>
  );
}
