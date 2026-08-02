import { ConsumptionLogResponse } from "@/features/consumption-log/types/consumption-log.types";

export interface DailyProgressResponse {
  id: number;
  referenceDate: string; // ISO String / 'YYYY-MM-DD'
  targetCal?: number; // Objetivo diario de calorías
  totalCaloriesSum: number;
  isFinalized: boolean;
  isSkiped: boolean;
  profileId: number;
  logs?: ConsumptionLogResponse[];
  _links?: Record<string, { href: string; method: string }>;
}

export interface CreateDailyProgressDto {
  profileId: number;
  referenceDate?: string;
  targetCal?: number;
}

export interface UpdateDailyProgressDto {
  targetCal?: number;
  totalCaloriesSum?: number;
  isFinalized?: boolean;
  isSkiped?: boolean;
}
