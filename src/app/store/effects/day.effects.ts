import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DayManagementService } from 'src/app/components/day-management/day-management.service';
import * as DayActions from '../actions/day.actions';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { selectDayId } from '../selectors/day.selectors';

@Injectable()
export class DayEffects {
  private actions$ = inject(Actions);
  private dayManagementService = inject(DayManagementService);
  private store = inject(Store<AppState>);

  loadDayState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DayActions.loadDayState),
      switchMap(() =>
        this.dayManagementService.getDayStatus().pipe(
          map((summary) => DayActions.loadDayStateSuccess({ summary })),
          catchError((error) => of(DayActions.loadDayStateFailure({ error })))
        )
      )
    )
  );

  startDay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DayActions.startDay),
      switchMap((action) =>
        this.dayManagementService.startDay(action.openingBalance).pipe(
          map((summary) => DayActions.startDaySuccess({ summary })),
          catchError((error) => of(DayActions.startDayFailure({ error })))
        )
      )
    )
  );

  addExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DayActions.addExpense),
      withLatestFrom(this.store.select(selectDayId)),
      switchMap(([action, dayId]) => {
        if (!dayId) {
          return of(DayActions.addExpenseFailure({ error: 'Day ID is not available to add expense.' }));
        }
        return this.dayManagementService.addExpense(action.expense).pipe(
          map((summary) => DayActions.addExpenseSuccess({ summary })),
          catchError((error) => of(DayActions.addExpenseFailure({ error })))
        );
      })
    )
  );

  endDay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DayActions.endDay),
      withLatestFrom(this.store.select(selectDayId)),
      switchMap(([action, dayId]) => {
        if (!dayId) {
          return of(DayActions.endDayFailure({ error: 'Day ID is not available to end day.' }));
        }
        return this.dayManagementService.endDay(dayId, action.summary).pipe(
          map(() => DayActions.endDaySuccess()),
          catchError((error) => of(DayActions.endDayFailure({ error })))
        );
      })
    )
  );
}
