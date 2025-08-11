import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DayState } from '../reducers/day.reducer';

export const selectDayState = createFeatureSelector<DayState>('day');

export const selectDaySummary = createSelector(
    selectDayState,
    (state) => state.summary
);

export const selectDayId = createSelector(
    selectDaySummary,
    (summary) => summary?.id
);

export const selectDayStarted = createSelector(
    selectDayState,
    (state) => state.dayStarted
);

export const selectOpeningBalance = createSelector(
    selectDaySummary,
    (summary) => summary?.opening_balance
);

export const selectDayLoading = createSelector(
    selectDayState,
    (state) => state.loading
);

export const selectDayError = createSelector(
    selectDayState,
    (state) => state.error
);

export const selectExpenses = createSelector(
    selectDaySummary,
    (summary) => summary?.expenses || []
);
