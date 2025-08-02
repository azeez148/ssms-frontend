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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, KeyValuePipe, MatDialogModule, MatButtonModule],
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
    total_purchases: {
      total_count: 0,
      total_cost: 0,
      total_items_purchased: 0,
    },
    recent_purchases: [],
  };

  constructor(
    private homeService: HomeService,
    private productService: ProductService,
    private saleService: SaleService,
    private purchaseService: PurchaseService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.homeService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
    });
  }

  openSaleDialog(): void {
    this.productService.getProducts().subscribe(products => {
      const dialogRef = this.dialog.open(SaleDialogComponent, {
        width: '80%',
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
        width: '80%',
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
}
