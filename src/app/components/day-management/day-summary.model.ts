import { Expense } from './expense.model';

export interface DaySummary {
  id: number;
  openingBalance: number;
  startTime: string;
  endTime: string | null;
  closingBalance: number | null;
  totalSales?: number;
  totalPurchases?: number;
  totalExpenses: number | null;
  cashInHand: number | null;
  cashInAccount: number | null;
  expenses: Expense[];
}
