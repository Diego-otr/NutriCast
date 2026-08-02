export interface FoodResponse {
  id: number;
  name: string;
  caloriesPerGram?: number;
  caloriesPerPortion?: number;
  category?: string;
  accountId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFoodDto {
  name: string;
  caloriesPerGram?: number;
  caloriesPerPortion?: number;
  category?: string;
  accountId: number;
}

export interface UpdateFoodDto {
  name?: string;
  caloriesPerGram?: number;
  caloriesPerPortion?: number;
  category?: string;
}
