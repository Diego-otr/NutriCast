import apiClient from "@/lib/api-client";
import {
  DailyProgressResponse,
  CreateDailyProgressDto,
  UpdateDailyProgressDto,
} from "../types";

export const dailyProgressService = {
  /**
   * Crear un nuevo registro de progreso diario para un perfil
   */
  async create(dto: CreateDailyProgressDto): Promise<DailyProgressResponse> {
    const response = await apiClient.post<DailyProgressResponse>(
      "/tracker/daily-progress",
      dto
    );
    return response.data;
  },

  /**
   * Obtener un registro de progreso diario por ID
   */
  async findById(id: number): Promise<DailyProgressResponse> {
    const response = await apiClient.get<DailyProgressResponse>(
      `/tracker/daily-progress/${id}`
    );
    return response.data;
  },

  /**
   * Obtener el registro de progreso diario actualmente activo (no finalizado ni omitido) para un perfil
   */
  async getActiveByProfile(profileId: number): Promise<DailyProgressResponse> {
    const response = await apiClient.get<DailyProgressResponse>(
      `/tracker/daily-progress/profile/${profileId}/active`
    );
    return response.data;
  },

  /**
   * Obtener todos los registros de progreso diario de un perfil
   */
  async findByProfile(profileId: number): Promise<DailyProgressResponse[]> {
    const response = await apiClient.get<DailyProgressResponse[]>(
      `/tracker/daily-progress/profile/${profileId}`
    );
    return response.data;
  },

  /**
   * Actualizar un registro de progreso diario
   */
  async update(id: number, dto: UpdateDailyProgressDto): Promise<DailyProgressResponse> {
    const response = await apiClient.patch<DailyProgressResponse>(
      `/tracker/daily-progress/${id}`,
      dto
    );
    return response.data;
  },

  /**
   * Marcar el día como finalizado y obtener el nuevo DailyProgress generado
   */
  async finalizeDay(id: number): Promise<DailyProgressResponse> {
    const response = await apiClient.patch<DailyProgressResponse>(
      `/tracker/daily-progress/${id}/finalize`
    );
    return response.data;
  },

  /**
   * Omitir el día (skip) y obtener el nuevo DailyProgress generado
   */
  async skipDay(id: number): Promise<DailyProgressResponse> {
    const response = await apiClient.patch<DailyProgressResponse>(
      `/tracker/daily-progress/${id}/skip`
    );
    return response.data;
  },

  /**
   * Eliminar un progreso diario
   */
  async delete(id: number): Promise<DailyProgressResponse> {
    const response = await apiClient.delete<DailyProgressResponse>(
      `/tracker/daily-progress/${id}`
    );
    return response.data;
  },
};
