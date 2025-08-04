import { createAction, props } from '@ngrx/store';

export const startDay = createAction(
  '[Day] Start Day',
  props<{ openingBalance: number }>()
);

export const endDay = createAction(
  '[Day] End Day'
);
