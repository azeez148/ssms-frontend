import { Component, OnInit } from '@angular/core';
import { DashboardData } from './data/dashboard.model';
import { HomeService } from './services/home.service';
import { CommonModule } from '@angular/common';

import { KeyValuePipe } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, KeyValuePipe],
  standalone: true,
})
export class HomeComponent implements OnInit {

  dashboardData: DashboardData = {
    total_sales: {
      total_count: 0,
      total_revenue: 0,
      total_items_sold: 0,
    },
    total_products: 0,
    total_categories: 0,
    most_sold_items: {},
    recent_sales: [],
  };

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.homeService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
    });
  }
}
