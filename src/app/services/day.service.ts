import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  private apiUrl = environment.apiUrl + '/day';
  private dayStarted = new BehaviorSubject<boolean>(false);
  private openingBalance = new BehaviorSubject<number>(0);

  dayStarted$ = this.dayStarted.asObservable();
  openingBalance$ = this.openingBalance.asObservable();

  constructor(private http: HttpClient) { }

  startDay(openingBalance: number): void {
    this.openingBalance.next(openingBalance);
    this.dayStarted.next(true);
    // Here you might want to persist the state to the backend or local storage
  }

  endDay(summary: any): Observable<any> {
    this.dayStarted.next(false);
    // This will send the end-of-day summary to the backend
    return this.http.post(`${this.apiUrl}/end-of-day-summary`, summary);
  }

  isDayStarted(): boolean {
    return this.dayStarted.getValue();
  }
}
