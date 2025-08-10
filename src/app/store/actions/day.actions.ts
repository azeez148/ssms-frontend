import { createAction, props } from '@ngrx/store';
import { DaySummary } from 'src/app/components/day-management/day-summary.model';
import { Expense } from 'src/app/components/day-management/expense.model';

// Load Day State Actions
export const loadDayState = createAction('[Day] Load Day State');

export const loadDayStateSuccess = createAction(
  '[Day] Load Day State Success',
  props<{ summary: DaySummary }>()
);

export const loadDayStateFailure = createAction(
  '[Day] Load Day State Failure',
  props<{ error: any }>()
);

// Start Day Actions
export const startDay = createAction(
  '[Day] Start Day',
  props<{ openingBalance: number }>()
);

export const startDaySuccess = createAction(
  '[Day] Start Day Success',
  props<{ summary: DaySummary }>()
);

export const startDayFailure = createAction(
  '[Day] Start Day Failure',
  props<{ error: any }>()
);

// End Day Actions
export const endDay = createAction(
    '[Day] End Day',
    props<{ summary: DaySummary }>()
);

export const endDaySuccess = createAction('[Day] End Day Success');

export const endDayFailure = createAction(
  '[Day] End Day Failure',
  props<{ error: any }>()
);

// Add Expense Actions
export const addExpense = createAction(
    '[Day] Add Expense',
    props<{ expense: Expense }>()
);

export const addExpenseSuccess = createAction(
    '[Day] Add Expense Success',
    props<{ summary: DaySummary }>()
);

export const addExpenseFailure = createAction(
    '[Day] Add Expense Failure',
    props<{ error: any }>()
);
