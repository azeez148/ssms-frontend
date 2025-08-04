import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DayState } from '../reducers/day.reducer';

export const selectDayState = createFeatureSelector<DayState>('day');

export const selectDayStarted = createSelector(
  selectDayState,
  (state) => state.dayStarted
);

export const selectOpeningBalance = createSelector(
  selectDayState,
  (state) => state.openingBalance
);
