import { Component, OnInit } from '@angular/core';
import { DashboardData } from './data/dashboard.model';
import { HomeService } from './services/home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule],

})
export class HomeComponent implements OnInit {

  dashboardData: DashboardData = {
    recentSales: [],
    recentPurchases: [],
    mostSoldItems: [],
    totalSales: 0,
    totalRevenue: 0,
    totalPurchases: 0,
    totalCost: 0
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
