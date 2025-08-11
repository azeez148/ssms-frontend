import { Expense } from './expense.model';

export interface DaySummary {
  id: number;
  opening_balance: number;
  start_time: string;
  end_time: string | null;
  closing_balance: number | null;
  total_expense: number | null;
  cash_in_hand: number | null;
  cash_in_account: number | null;
  expenses: Expense[];
  message?: string;
}
