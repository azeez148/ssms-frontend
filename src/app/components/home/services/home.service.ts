import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { DashboardData } from '../data/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = environment.apiUrl + '/dashboard'; // Your API base URL for purchases
  private dashboardData: DashboardData = {
    recentSales: [],
    recentPurchases: [],
    mostSoldItems: [],
    totalSales: 0,
    totalRevenue: 0,
    totalPurchases: 0,
    totalCost: 0
  };


  constructor(private http: HttpClient) {}

    // Fetch all dashboard data
    getDashboardData(): Observable<DashboardData> {
      return this.http.get<DashboardData>(`${this.apiUrl}/all`).pipe(
        tap((dashboardData: DashboardData) => {
          this.dashboardData = dashboardData;  // Store the fetched purchases
        })
      );
    }
}
