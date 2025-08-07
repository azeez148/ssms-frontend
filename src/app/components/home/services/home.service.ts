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
    total_sales: {
      total_count: 0,
      total_revenue: 0,
      total_items_sold: 0,
    },
    total_products: 0,
    total_categories: 0,
    most_sold_items: {},
    recent_sales: [],
    total_purchases: {
      total_count: 0,
      total_cost: 0,
      total_items_purchased: 0,
    },
    recent_purchases: [],
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
