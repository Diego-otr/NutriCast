import { FoodResponse } from "@/features/foods/types/food.types";

export interface ConsumptionLogResponse {
  id: number;
  amountGrams: number;
  portions: number;
  calculatedCalories: number;
  dailyProgressId: number;
  foodId: number;
  food?: FoodResponse;
  createdAt: string;
  _links?: Record<string, { href: string; method: string }>;
}

export interface CreateConsumptionLogDto {
  dailyProgressId: number;
  foodId: number;
  amountGrams?: number;
  portions?: number;
}

export interface UpdateConsumptionLogDto {
  amountGrams?: number;
  portions?: number;
  calculatedCalories?: number;
}
