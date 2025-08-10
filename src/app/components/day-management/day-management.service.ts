import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from './expense.model';
import { DaySummary } from './day-summary.model';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class DayManagementService {
    private apiUrl = environment.apiUrl + '/day-management';
  

  constructor(private http: HttpClient) { }

  getDayStatus(): Observable<DaySummary> {
    return this.http.get<DaySummary>(`${this.apiUrl}/today`);
  }


  startDay(openingBalance: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/startDay`, { opening_balance: openingBalance });
  }

  addExpense(expense: Expense): Observable<any> {
    return this.http.post(`${this.apiUrl}/addExpense`, expense);
  }

  endDay(dayId: number, summary: DaySummary): Observable<any> {
    return this.http.post(`${this.apiUrl}/${dayId}/end`, summary);
  }

  getTodaysExpenses(dayId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/${dayId}/expenses`);
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
