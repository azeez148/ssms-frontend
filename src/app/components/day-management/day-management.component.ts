import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import * as DayActions from 'src/app/store/actions/day.actions';
import { selectDayStarted, selectDaySummary, selectExpenses, selectDayLoading } from 'src/app/store/selectors/day.selectors';
import { Observable } from 'rxjs';
import { DaySummary } from './day-summary.model';
import { Expense } from './expense.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-day-management',
  templateUrl: './day-management.component.html',
  styleUrls: ['./day-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DayManagementComponent implements OnInit {
  startDayForm: FormGroup;
  expenseForm: FormGroup;
  dayStarted$: Observable<boolean>;
  daySummary$: Observable<DaySummary | null>;
  expenses$: Observable<Expense[]>;
  loading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.startDayForm = this.fb.group({
      openingBalance: ['', [Validators.required, Validators.pattern('^[0-9]*\\.?[0-9]+$')]]
    });

    this.expenseForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*\\.?[0-9]+$')]]
    });

    this.dayStarted$ = this.store.select(selectDayStarted);
    this.daySummary$ = this.store.select(selectDaySummary);
    this.expenses$ = this.store.select(selectExpenses);
    this.loading$ = this.store.select(selectDayLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(DayActions.loadDayState());
  }

  onStartDay(): void {
    if (this.startDayForm.valid) {
      const openingBalance = this.startDayForm.value.openingBalance;
      this.store.dispatch(DayActions.startDay({ openingBalance }));
    }
  }

  onAddExpense(): void {
    if (this.expenseForm.valid) {
      const newExpense: Expense = {
        description: this.expenseForm.value.description,
        amount: this.expenseForm.value.amount
      };
      this.store.dispatch(DayActions.addExpense({ expense: newExpense }));
      this.expenseForm.reset();
    }
  }

  onEndDay(): void {
    this.daySummary$.pipe(take(1)).subscribe(summary => {
      if (summary) {
        this.store.dispatch(DayActions.endDay({ summary }));
      } else {
        console.error("Cannot end day: Day summary is not available.");
      }
    });
  }
}
