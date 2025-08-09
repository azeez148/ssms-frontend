import { createAction, props } from '@ngrx/store';

export const startDay = createAction(
  '[Day] Start Day',
  props<{ openingBalance: number }>()
);

export const endDay = createAction(
  '[Day] End Day'
);

export const loadDayState = createAction(
  '[Day] Load Day State'
);

export const loadDayStateSuccess = createAction(
  '[Day] Load Day State Success',
  props<{ dayStarted: boolean; openingBalance: number }>()
);

export const loadDayStateFailure = createAction(
  '[Day] Load Day State Failure',
  props<{ error: any }>()
);
