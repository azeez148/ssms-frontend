import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DayManagementService } from './day-management.service';
import { Expense } from './expense.model';
import { DaySummary } from './day-summary.model';
import { CommonModule } from '@angular/common';

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
  dayStarted = false;
  expenses: Expense[] = [];
  daySummary: DaySummary | null = null;

  constructor(
    private fb: FormBuilder,
    private dayManagementService: DayManagementService
  ) {
    this.startDayForm = this.fb.group({
      openingBalance: ['', [Validators.required, Validators.pattern('^[0-9]*\\.?[0-9]+$')]]
    });

    this.expenseForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*\\.?[0-9]+$')]]
    });
  }

  ngOnInit(): void {
  }

  onStartDay(): void {
    if (this.startDayForm.valid) {
      const openingBalance = this.startDayForm.value.openingBalance;
      this.dayManagementService.startDay(openingBalance).subscribe(() => {
        this.dayStarted = true;
      });
    }
  }

  onAddExpense(): void {
    if (this.expenseForm.valid) {
      const newExpense: Expense = {
        description: this.expenseForm.value.description,
        amount: this.expenseForm.value.amount,
        date: new Date()
      };
      this.dayManagementService.addExpense(newExpense).subscribe(() => {
        this.expenses.push(newExpense);
        this.expenseForm.reset();
      });
    }
  }

  onEndDay(): void {
    this.dayManagementService.getTodaysExpenses().subscribe(expenses => {
      const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
      // You will need to get the total sales and purchases from their respective services.
      // For now, I will use dummy data.
      const totalSales = 1000;
      const totalPurchases = 500;
      const openingBalance = this.startDayForm.value.openingBalance;
      const closingBalance = openingBalance + totalSales - totalPurchases - totalExpenses;

      this.daySummary = {
        openingBalance,
        totalSales,
        totalPurchases,
        totalExpenses,
        closingBalance
      };

      this.dayManagementService.endDay(this.daySummary).subscribe(() => {
        const message = `End of Day Summary:\nOpening Balance: ${this.daySummary?.openingBalance}\nTotal Sales: ${this.daySummary?.totalSales}\nTotal Purchases: ${this.daySummary?.totalPurchases}\nTotal Expenses: ${this.daySummary?.totalExpenses}\nClosing Balance: ${this.daySummary?.closingBalance}`;
        this.dayManagementService.sendWhatsAppMessage(message).subscribe(() => {
          this.dayStarted = false;
        });
      });
    });
  }
}
