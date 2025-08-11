import { DaySummary } from './day-summary.model';

export interface DayStatus {
  day_started: boolean;
  active_day: DaySummary | null;
}
