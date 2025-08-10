import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from './expense.model';
import { DayStatus } from './day-status.model';
import { DaySummary } from './day-summary.model';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class DayManagementService {
    private apiUrl = environment.apiUrl + '/day-management';
  

  constructor(private http: HttpClient) { }

  getDayStatus(): Observable<DayStatus> {
    return this.http.get<DayStatus>(`${this.apiUrl}/today`);
  }


  startDay(opening_balance: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/startDay`, { opening_balance: opening_balance });
  }

  addExpense(dayId: number, expense: Expense): Observable<any> {
    const payload = {
      day_id: dayId,
      description: expense.description,
      amount: expense.amount
    };
    return this.http.post(`${this.apiUrl}/addExpense`, payload);
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
