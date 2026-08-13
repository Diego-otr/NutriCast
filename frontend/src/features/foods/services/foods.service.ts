import apiClient from "@/lib/api-client";
import { FoodResponse, CreateFoodDto, UpdateFoodDto } from "../types";

export const foodsService = {
  /**
   * Obtener todos los alimentos asociados a la cuenta compartida
   */
  async findByAccount(accountId: number): Promise<FoodResponse[]> {
    const response = await apiClient.get<FoodResponse[]>(
      `/foods/account/${accountId}`
    );
    return response.data;
  },

  /**
   * Obtener un alimento por su ID
   */
  async findById(id: number): Promise<FoodResponse> {
    const response = await apiClient.get<FoodResponse>(`/foods/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo alimento en la biblioteca compartida
   */
  async create(dto: CreateFoodDto): Promise<FoodResponse> {
    const response = await apiClient.post<FoodResponse>("/foods", dto);
    return response.data;
  },

  /**
   * Actualizar los datos de un alimento
   */
  async update(id: number, dto: UpdateFoodDto): Promise<FoodResponse> {
    const response = await apiClient.patch<FoodResponse>(`/foods/${id}`, dto);
    return response.data;
  },

  /**
   * Eliminar un alimento
   */
  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/foods/${id}`);
    return response.data;
  },
};
