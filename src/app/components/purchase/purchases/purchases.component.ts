import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Category } from '../../category/data/category-model';
import { CategoryService } from '../../category/services/category.service';
import { ProductService } from '../../product/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Purchase, PurchaseItem } from '../data/purchase-model';
import { PurchaseDialogComponent } from '../purchase-dialog/purchase-dialog.component';
import { PurchaseService } from '../services/purchase.service';
import { Product } from '../../product/data/product-model';
import { PurchaseDetailsDialogComponent } from '../purchase-details-dialog/purchase-details-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
})
export class PurchasesComponent implements OnInit {
  purchases: Purchase[] = [];
  p: number = 1;

  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId: number | null = null;
  productNameFilter: string = '';
  selectedDateFilter: string = 'all';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;

  private allPurchases: Purchase[] = [];

  todaysPurchaseSummary = {
    total_count: 0,
    total_cost: 0,
    total_items_purchased: 0,
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
    this.loadPurchases(); // Load all purchases initially
  }

  loadPurchases(): void {
    this.purchaseService.getPurchases().subscribe(purchases => {
      this.allPurchases = purchases;
      this.purchases = purchases;
      this.calculateTodaysPurchaseSummary();
    });
  }

  calculateTodaysPurchaseSummary(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysPurchases = this.allPurchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate.getTime() === today.getTime();
    });

    this.todaysPurchaseSummary.total_count = todaysPurchases.length;
    this.todaysPurchaseSummary.total_cost = todaysPurchases.reduce((acc, purchase) => acc + purchase.totalPrice, 0);
    this.todaysPurchaseSummary.total_items_purchased = todaysPurchases.reduce((acc, purchase) => acc + purchase.totalQuantity, 0);
  }

  onFilterChange(): void {
    let filteredPurchases = this.allPurchases;

    if (this.selectedCategoryId) {
      filteredPurchases = filteredPurchases.filter(p =>
        p.purchaseItems.some(item => item.productCategory === this.categories.find(c => c.id === this.selectedCategoryId)?.name)
      );
    }

    if (this.productNameFilter) {
      filteredPurchases = filteredPurchases.filter(p =>
        p.purchaseItems.some(item => item.productName.toLowerCase().includes(this.productNameFilter.toLowerCase()))
      );
    }

    this.applyDateFilter(filteredPurchases);
  }

  applyDateFilter(filteredPurchases: Purchase[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.selectedDateFilter) {
      case 'today':
        filteredPurchases = filteredPurchases.filter(p => new Date(p.date).setHours(0, 0, 0, 0) === today.getTime());
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        filteredPurchases = filteredPurchases.filter(p => new Date(p.date).setHours(0, 0, 0, 0) === yesterday.getTime());
        break;
      case 'this_week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        filteredPurchases = filteredPurchases.filter(p => new Date(p.date) >= startOfWeek);
        break;
      case 'this_month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        filteredPurchases = filteredPurchases.filter(p => new Date(p.date) >= startOfMonth);
        break;
      case 'custom':
        if (this.customStartDate && this.customEndDate) {
          const startDate = new Date(this.customStartDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(this.customEndDate);
          endDate.setHours(23, 59, 59, 999);
          filteredPurchases = filteredPurchases.filter(p => {
            const purchaseDate = new Date(p.date);
            return purchaseDate >= startDate && purchaseDate <= endDate;
          });
        }
        break;
      default:
        break;
    }
    this.purchases = filteredPurchases;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.purchases = this.allPurchases.filter(purchase => purchase.supplierName.toLowerCase().includes(filterValue));
  }

  openCreatePurchaseDialog(): void {
    const dialogRef = this.dialog.open(PurchaseDialogComponent, {
      maxWidth: '1000px',
      height: '800px',
      data: this.products
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const purchaseData = {
          supplier_name: result.supplierName,
          supplier_address: result.supplierAddress,
          supplier_mobile: result.supplierMobile,
          supplier_email: result.supplierEmail || '',
          vendor_id: result.supplierId || 0,
          date: result.date,
          total_quantity: result.totalQuantity,
          total_price: result.totalPrice,
          payment_type_id: result.paymentType.id,
          payment_reference_number: result.paymentReferenceNumber,
          delivery_type_id: result.deliveryType.id,
          shop_ids: result.shopIds,
          purchase_items: result.purchaseItems.map((item: PurchaseItem) => ({
            product_id: item.productId,
            product_name: item.productName,
            product_category: item.productCategory,
            size: item.size,
            quantity_available: item.quantityAvailable,
            quantity: item.quantity,
            purchase_price: item.purchasePrice,
            total_price: item.totalPrice
          }))
        };


        this.purchaseService.addPurchase(purchaseData).subscribe(newProduct => {
          console.log(newProduct);
        });
      }
    });
  }

  viewDetails(purchase: any): void {
    this.dialog.open(PurchaseDetailsDialogComponent, {
      width: '600px',
      data: purchase
    });
  }
  exportExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.purchases);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchases');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'purchases_data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}