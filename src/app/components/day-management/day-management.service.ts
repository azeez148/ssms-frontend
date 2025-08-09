import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from './expense.model';
import { DaySummary } from './day-summary.model';

@Injectable({
  providedIn: 'root'
})
export class DayManagementService {
  private apiUrl = '/api/day-management'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getDayStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`);
  }

  startDay(openingBalance: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, { openingBalance });
  }

  addExpense(expense: Expense): Observable<any> {
    return this.http.post(`${this.apiUrl}/expense`, expense);
  }

  endDay(summary: DaySummary): Observable<any> {
    return this.http.post(`${this.apiUrl}/end`, summary);
  }

  getTodaysExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses`);
  }

  sendWhatsAppMessage(message: string): Observable<any> {
    // This is a placeholder for the actual WhatsApp API call.
    // You will need to replace this with the actual implementation.
    console.log('Sending WhatsApp message:', message);
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }
}
