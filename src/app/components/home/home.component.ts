import { Component, OnInit } from '@angular/core';
import { DashboardData } from './data/dashboard.model';
import { HomeService } from './services/home.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../product/services/product.service';
import { SaleService } from '../sale/services/sale.service';
import { PurchaseService } from '../purchase/services/purchase.service';
import { SaleDialogComponent } from '../sale/sale-dialog/sale-dialog.component';
import { PurchaseDialogComponent } from '../purchase/purchase-dialog/purchase-dialog.component';
import { KeyValuePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Sale } from '../sale/data/sale-model';
import { Purchase } from '../purchase/data/purchase-model';
import { DayManagementComponent } from '../day-management/day-management.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, KeyValuePipe, MatDialogModule, MatButtonModule],
  standalone: true,
})
export class HomeComponent implements OnInit {

  totalStockValue = 0;
  projectedSaleValue = 0;
  projectedProfitValue = 0;

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
    total_purchases: {
      total_count: 0,
      total_cost: 0,
      total_items_purchased: 0,
    },
    recent_purchases: [],
  };

  todaysSaleSummary = {
    total_count: 0,
    total_revenue: 0,
    total_items_sold: 0,
  };

  todaysPurchaseSummary = {
    total_count: 0,
    total_cost: 0,
    total_items_purchased: 0,
  };

  constructor(
    private homeService: HomeService,
    private productService: ProductService,
    private saleService: SaleService,
    private purchaseService: PurchaseService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadSalesAndCalculateSummary();
    this.loadPurchasesAndCalculateSummary();
    this.calculateStockValues();
  }

  loadDashboardData(): void {
    this.homeService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
    });
  }

  loadSalesAndCalculateSummary(): void {
    this.saleService.getSales().subscribe(sales => {
      this.calculateTodaysSaleSummary(sales);
    });
  }

  calculateTodaysSaleSummary(sales: Sale[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysSales = sales.filter(s => {
      const saleDate = new Date(s.date);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });

    this.todaysSaleSummary.total_count = todaysSales.length;
    this.todaysSaleSummary.total_revenue = todaysSales.reduce((acc, sale) => acc + sale.totalPrice, 0);
    this.todaysSaleSummary.total_items_sold = todaysSales.reduce((acc, sale) => acc + sale.totalQuantity, 0);
  }

  loadPurchasesAndCalculateSummary(): void {
    this.purchaseService.getPurchases().subscribe(purchases => {
      this.calculateTodaysPurchaseSummary(purchases);
    });
  }

  calculateTodaysPurchaseSummary(purchases: Purchase[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysPurchases = purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate.getTime() === today.getTime();
    });

    this.todaysPurchaseSummary.total_count = todaysPurchases.length;
    this.todaysPurchaseSummary.total_cost = todaysPurchases.reduce((acc, purchase) => acc + purchase.totalPrice, 0);
    this.todaysPurchaseSummary.total_items_purchased = todaysPurchases.reduce((acc, purchase) => acc + purchase.totalQuantity, 0);
  }

  openSaleDialog(): void {
    this.productService.getProducts().subscribe(products => {
      const dialogRef = this.dialog.open(SaleDialogComponent, {
         maxWidth: '1000px',
      height: '800px',
        data: products
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saleService.addSale(result).subscribe(() => {
            this.loadDashboardData();
          });
        }
      });
    });
  }

  openPurchaseDialog(): void {
    this.productService.getProducts().subscribe(products => {
      const dialogRef = this.dialog.open(PurchaseDialogComponent, {
        maxWidth: '1000px',
      height: '800px',
        data: products
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.purchaseService.addPurchase(result).subscribe(() => {
            this.loadDashboardData();
          });
        }
      });
    });
  }

  openDayManagement(): void {
    const dialogRef = this.dialog.open(DayManagementComponent, {
      width: '80%'
    });
  }

  calculateStockValues(): void {
    this.productService.getProducts().subscribe(products => {
      let totalStock = 0;
      let projectedSale = 0;

      products.forEach(product => {
        const totalQuantity = product.sizeMap.reduce((acc, size) => acc + size.quantity, 0);
        totalStock += totalQuantity * product.unitPrice;
        projectedSale += totalQuantity * product.sellingPrice;
      });

      this.totalStockValue = totalStock;
      this.projectedSaleValue = projectedSale;
      this.projectedProfitValue = projectedSale - totalStock;
    });
  }
}
