import { ConsumptionLogResponse } from "@/features/consumption-log/types/consumption-log.types";

export interface DailyProgressResponse {
  id: number;
  referenceDate: string; // ISO String / 'YYYY-MM-DD'
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
}

export interface UpdateDailyProgressDto {
  totalCaloriesSum?: number;
  isFinalized?: boolean;
  isSkiped?: boolean;
}
