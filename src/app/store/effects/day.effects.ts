import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DayManagementService } from 'src/app/components/day-management/day-management.service';
import { loadDayState, loadDayStateSuccess, loadDayStateFailure } from '../actions/day.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class DayEffects {
  constructor(
    private actions$: Actions,
    private dayManagementService: DayManagementService
  ) {}

  loadDayState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDayState),
      switchMap(() =>
        this.dayManagementService.getDayStatus().pipe(
          map((summary) => loadDayStateSuccess({ dayStarted: summary.dayStarted, openingBalance: summary.openingBalance })),
          catchError((error) => of(loadDayStateFailure({ error })))
        )
      )
    )
  );
}
