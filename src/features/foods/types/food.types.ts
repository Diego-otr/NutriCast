export interface FoodResponse {
  id: number;
  name: string;
  caloriesPerGram?: number;
  caloriesPerPortion?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
  category?: string;
  accountId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFoodDto {
  name: string;
  caloriesPerGram?: number;
  caloriesPerPortion?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
  category?: string;
  accountId: number;
}

export interface UpdateFoodDto {
  name?: string;
  caloriesPerGram?: number;
  caloriesPerPortion?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
  category?: string;
}
