import { createReducer, on } from '@ngrx/store';
import { startDay, endDay } from '../actions/day.actions';

export interface DayState {
  dayStarted: boolean;
  openingBalance: number;
}

export const initialState: DayState = {
  dayStarted: false,
  openingBalance: 0,
};

export const dayReducer = createReducer(
  initialState,
  on(startDay, (state, { openingBalance }) => ({
    ...state,
    dayStarted: true,
    openingBalance,
  })),
  on(endDay, (state) => ({
    ...state,
    dayStarted: false,
  }))
);
