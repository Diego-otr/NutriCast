"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Plus, Edit2, Trash2, Lock, Settings, Check, Loader2, X } from "lucide-react";
import { TitleBar, NavBar } from "@/components/common";
import { authService, UserProfileResponse } from "@/features/auth/services/auth.service";
import { profilesService, ProfileResponse } from "@/features/profiles/services/profiles.service";
import { ProfileModal, PinCheckModal, ConfirmModal } from "@/components/modals";

// Colores de avatares estilo Netflix
const AVATAR_GRADIENTS = [
  "from-emerald-500 to-teal-700",
  "from-[#368482] to-[#1b3d30]",
  "from-green-600 to-emerald-800",
  "from-teal-600 to-cyan-800",
  "from-lime-600 to-emerald-700",
];

export default function GroupProfilesPage() {
  const router = useRouter();
  const [accountData, setAccountData] = useState<UserProfileResponse["account"] | null>(null);
  const [profiles, setProfiles] = useState<ProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem("selected_profile_id");
      return savedId ? Number(savedId) : null;
    }
    return null;
  });

  // Edición del nombre del grupo
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState("");
  const [isSavingGroupName, setIsSavingGroupName] = useState(false);

  // Modales
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<ProfileResponse | null>(null);

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [profileForPin, setProfileForPin] = useState<ProfileResponse | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<ProfileResponse | null>(null);

  // Cargar cuenta y perfiles sin causar cascading renders
  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      try {
        const meData = await authService.getMe();
        if (isCancelled) return;
        setAccountData(meData.account);

        if (meData.account?.id) {
          const profs = await profilesService.getByAccount(meData.account.id);
          if (isCancelled) return;
          if (profs && profs.length > 0) {
            setProfiles(profs);
          } else if (meData.account.profiles && meData.account.profiles.length > 0) {
            setProfiles(meData.account.profiles);
          } else {
            setProfiles([]);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos del grupo:", err);
        if (!isCancelled) {
          router.push("/login");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [router]);

  const refreshProfiles = async () => {
    if (!accountData?.id) return;
    try {
      const profs = await profilesService.getByAccount(accountData.id);
      if (profs && profs.length > 0) {
        setProfiles(profs);
      } else {
        const meData = await authService.getMe();
        if (meData.account?.profiles) {
          setProfiles(meData.account.profiles);
        }
      }
    } catch (err) {
      console.error("Error al refrescar perfiles:", err);
    }
  };

  // Guardar cambio del nombre del grupo
  const handleSaveGroupName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountData?.id || !editedGroupName.trim()) return;

    try {
      setIsSavingGroupName(true);
      await authService.updateAccount(accountData.id, {
        groupName: editedGroupName.trim(),
      });
      setAccountData((prev) =>
        prev ? { ...prev, groupName: editedGroupName.trim() } : prev
      );
      setIsEditingGroupName(false);
    } catch (err) {
      console.error("Error al actualizar el nombre del grupo:", err);
    } finally {
      setIsSavingGroupName(false);
    }
  };

  // Seleccionar Perfil para ingresar al Dashboard
  const handleSelectProfile = (profile: ProfileResponse) => {
    if (isEditMode) return;

    if (profile.pinCode) {
      setProfileForPin(profile);
      setIsPinModalOpen(true);
    } else {
      confirmProfileSelection(profile);
    }
  };

  const confirmProfileSelection = (profile: ProfileResponse) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_profile_id", String(profile.id));
      localStorage.setItem("selected_profile_name", profile.name);
    }
    setActiveProfileId(profile.id);
    router.push("/dashboard");
  };

  // Guardar (Crear / Editar) Perfil
  const handleConfirmSaveProfile = async (data: { name: string; pinCode?: string }) => {
    if (!accountData?.id) return;

    try {
      if (profileToEdit) {
        await profilesService.update(profileToEdit.id, data);
      } else {
        await profilesService.create({
          name: data.name,
          pinCode: data.pinCode,
          accountId: accountData.id,
        });
      }
      setIsProfileModalOpen(false);
      setProfileToEdit(null);
      await refreshProfiles();
    } catch (err) {
      console.error("Error al guardar perfil:", err);
    }
  };

  // Eliminar Perfil
  const handleConfirmDeleteProfile = async () => {
    if (!profileToDelete) return;
    try {
      await profilesService.delete(profileToDelete.id);
      setIsDeleteModalOpen(false);
      setProfileToDelete(null);
      await refreshProfiles();
    } catch (err) {
      console.error("Error al eliminar perfil:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7e6] text-black flex flex-col items-center justify-between font-sans">
      <main className="w-full max-w-md min-h-screen flex flex-col justify-between pb-20 relative bg-[#f3f7e6]">
        {/* Header Superior */}
        <div className="sticky top-0 z-40 w-full">
          <TitleBar title="NutriCast" />
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 px-4 py-6 flex flex-col items-center gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 text-[#1b3d30]">
              <Loader2 className="w-8 h-8 animate-spin text-[#368482]" />
              <span className="font-semibold text-sm">Cargando perfiles del grupo...</span>
            </div>
          ) : (
            <>
              {/* Título de Grupo */}
              <div className="text-center flex flex-col gap-1 items-center">
                <span className="text-xs uppercase font-bold tracking-widest text-[#0c7336]">
                  Grupo de Perfiles
                </span>

                {isEditingGroupName ? (
                  <form onSubmit={handleSaveGroupName} className="flex items-center justify-center gap-2 mt-1">
                    <input
                      type="text"
                      value={editedGroupName}
                      onChange={(e) => setEditedGroupName(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#1b3d30] bg-white text-[#1b3d30] font-extrabold text-lg sm:text-xl text-center focus:outline-none focus:ring-2 focus:ring-[#368482]"
                      placeholder="Nombre del grupo"
                      autoFocus
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSavingGroupName}
                      className="p-2 rounded-xl bg-[#0c7336] text-white hover:bg-[#095729] active:scale-95 transition-all shadow disabled:opacity-50"
                      title="Guardar Nombre"
                    >
                      {isSavingGroupName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingGroupName(false);
                        setEditedGroupName(accountData?.groupName || "");
                      }}
                      className="p-2 rounded-xl bg-zinc-200 text-zinc-700 hover:bg-zinc-300 active:scale-95 transition-all"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b3d30]">
                      {accountData?.groupName || "Mi Grupo"}
                    </h2>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditedGroupName(accountData?.groupName || "");
                          setIsEditingGroupName(true);
                        }}
                        className="p-1.5 rounded-lg bg-[#d5f7e6] text-[#0c7336] hover:bg-[#bbf2d5] border border-[#1b3d30]/20 active:scale-95 transition-all"
                        title="Editar nombre del grupo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                <p className="text-xs text-zinc-600 pt-1">
                  {isEditMode
                    ? "Puedes editar el nombre del grupo o gestionar los perfiles"
                    : "¿Quién está utilizando la app hoy?"}
                </p>
              </div>

              {/* Botón para Alternar Modo Administración */}
              <button
                type="button"
                onClick={() => setIsEditMode((prev) => !prev)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                  isEditMode
                    ? "bg-[#173b3e] text-white border-[#173b3e]"
                    : "bg-[#d5f7e6] text-[#0c7336] border-[#1b3d30]/20 hover:bg-[#c6f3db]"
                }`}
              >
                {isEditMode ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Listo</span>
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4" />
                    <span>Administrar Perfiles</span>
                  </>
                )}
              </button>

              {/* Grid de Perfiles Estilo Netflix */}
              <div className="grid grid-cols-2 gap-4 w-full pt-2">
                {profiles.map((profile, index) => {
                  const gradientClass =
                    AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
                  const isActive = profile.id === activeProfileId;

                  return (
                    <div
                      key={profile.id}
                      onClick={() => handleSelectProfile(profile)}
                      className={`group relative rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-200 shadow-md ${
                        isActive
                          ? "bg-[#d5f7e6] border-2 border-[#0c7336] ring-4 ring-[#0c7336]/20 shadow-lg shadow-[#0c7336]/15"
                          : "bg-[#f7faeb] border border-[#1b3d30]"
                      } ${
                        isEditMode
                          ? "ring-2 ring-[#368482]/50 cursor-default"
                          : "hover:scale-[1.03] active:scale-95 cursor-pointer hover:border-[#368482]"
                      }`}
                    >
                      {/* Badge Perfil Activo */}
                      {isActive && (
                        <div className="absolute top-2 left-2 bg-[#0c7336] text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm z-10">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Activo</span>
                        </div>
                      )}

                      {/* Avatar Icon */}
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-md relative mt-1`}
                      >
                        <User className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />

                        {/* Indicador PIN de Seguridad */}
                        {profile.pinCode && (
                          <div className="absolute top-1.5 right-1.5 bg-black/60 p-1 rounded-full text-white">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Nombre del Perfil */}
                      <span className="font-bold text-sm text-[#1b3d30] text-center line-clamp-1">
                        {profile.name}
                      </span>

                      {/* Overlay de Acciones en Modo Edición */}
                      {isEditMode && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfileToEdit(profile);
                              setIsProfileModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-[#368482] text-white hover:bg-[#2c6e6c] active:scale-95 transition-all shadow"
                            title="Editar Perfil"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfileToDelete(profile);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow"
                            title="Eliminar Perfil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Card: Agregar Perfil */}
                <div
                  onClick={() => {
                    setProfileToEdit(null);
                    setIsProfileModalOpen(true);
                  }}
                  className="bg-[#d5f7e6]/50 border-2 border-dashed border-[#1b3d30]/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#d5f7e6] hover:border-[#1b3d30] transition-all active:scale-95 min-h-[140px]"
                >
                  <div className="w-12 h-12 rounded-full bg-[#368482] text-white flex items-center justify-center shadow-md">
                    <Plus className="w-6 h-6 stroke-[3]" />
                  </div>
                  <span className="font-bold text-xs text-[#1b3d30]">
                    Agregar Perfil
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Navbar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 w-full flex justify-center">
          <NavBar activeTab="grupo" />
        </div>
      </main>

      {/* Modales */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        profileToEdit={profileToEdit}
        onClose={() => {
          setIsProfileModalOpen(false);
          setProfileToEdit(null);
        }}
        onConfirm={handleConfirmSaveProfile}
      />

      <PinCheckModal
        isOpen={isPinModalOpen}
        profile={profileForPin}
        onClose={() => {
          setIsPinModalOpen(false);
          setProfileForPin(null);
        }}
        onSuccess={() => {
          if (profileForPin) {
            confirmProfileSelection(profileForPin);
          }
          setIsPinModalOpen(false);
          setProfileForPin(null);
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="¿Eliminar Perfil?"
        text={`¿Estás seguro de que deseas eliminar el perfil "${profileToDelete?.name}"? Esta acción no se me puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setProfileToDelete(null);
        }}
        onConfirm={handleConfirmDeleteProfile}
      />
    </div>
  );
}
