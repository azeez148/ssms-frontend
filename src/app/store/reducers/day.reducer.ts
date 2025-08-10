import { createReducer, on } from '@ngrx/store';
import { DaySummary } from 'src/app/components/day-management/day-summary.model';
import * as DayActions from '../actions/day.actions';

export interface DayState {
  summary: DaySummary | null;
  dayStarted: boolean;
  loading: boolean;
  error: any;
}

export const initialState: DayState = {
  summary: null,
  dayStarted: false,
  loading: false,
  error: null,
};

export const dayReducer = createReducer(
  initialState,

  // Actions that trigger loading state
  on(DayActions.loadDayState, DayActions.startDay, DayActions.endDay, DayActions.addExpense, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DayActions.loadDayStateSuccess, (state, { dayStatus }) => ({
    ...state,
    summary: dayStatus.active_day,
    dayStarted: dayStatus.day_started,
    loading: false,
    error: null,
  })),

  // Success actions that update the summary
  on(DayActions.startDaySuccess, DayActions.addExpenseSuccess, (state, { summary }) => ({
    ...state,
    summary,
    dayStarted: summary && summary.id ? true : false,
    loading: false,
    error: null,
  })),

  // End day success resets the state
  on(DayActions.endDaySuccess, (state) => initialState),

  // Failure actions
  on(DayActions.loadDayStateFailure, DayActions.startDayFailure, DayActions.endDayFailure, DayActions.addExpenseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),
);
