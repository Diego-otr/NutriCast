import apiClient from "@/lib/api-client";
import { DailyProgressResponse } from "@/features/daily-progress/types";
import {
  ConsumptionLogResponse,
  CreateConsumptionLogDto,
  UpdateConsumptionLogDto,
} from "../types";

export const consumptionLogService = {
  /**
   * Crear un registro de consumo independiente
   */
  async create(dto: CreateConsumptionLogDto): Promise<ConsumptionLogResponse> {
    const response = await apiClient.post<ConsumptionLogResponse>(
      "/tracker/consumption-log",
      dto
    );
    return response.data;
  },

  /**
   * Añadir un nuevo consumo directamente a un progreso diario existente
   */
  async addLogToDailyProgress(
    dailyProgressId: number,
    dto: CreateConsumptionLogDto
  ): Promise<DailyProgressResponse> {
    const response = await apiClient.patch<DailyProgressResponse>(
      `/tracker/daily-progress/${dailyProgressId}/add-log`,
      dto
    );
    return response.data;
  },

  /**
   * Eliminar un consumo del progreso diario
   */
  async removeLogFromDailyProgress(
    dailyProgressId: number,
    logId: number
  ): Promise<DailyProgressResponse> {
    const response = await apiClient.delete<DailyProgressResponse>(
      `/tracker/daily-progress/${dailyProgressId}/remove-log/${logId}`
    );
    return response.data;
  },

  /**
   * Obtener consumo por ID
   */
  async findById(id: number): Promise<ConsumptionLogResponse> {
    const response = await apiClient.get<ConsumptionLogResponse>(
      `/tracker/consumption-log/${id}`
    );
    return response.data;
  },

  /**
   * Actualizar un consumo existente
   */
  async update(id: number, dto: UpdateConsumptionLogDto): Promise<ConsumptionLogResponse> {
    const response = await apiClient.patch<ConsumptionLogResponse>(
      `/tracker/consumption-log/${id}`,
      dto
    );
    return response.data;
  },

  /**
   * Eliminar consumo
   */
  async delete(id: number): Promise<ConsumptionLogResponse> {
    const response = await apiClient.delete<ConsumptionLogResponse>(
      `/tracker/consumption-log/${id}`
    );
    return response.data;
  },
};
