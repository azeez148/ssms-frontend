import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Category } from '../../category/data/category-model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CategoryService } from '../../category/services/category.service';
import { ProductService } from '../../product/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { Purchase, PurchaseItem } from '../data/purchase-model';
import { PurchaseDialogComponent } from '../purchase-dialog/purchase-dialog.component';
import { PurchaseService } from '../services/purchase.service';
import { Product } from '../../product/data/product-model';
import { PurchaseDetailsDialogComponent } from '../purchase-details-dialog/purchase-details-dialog.component';

@Component({
  selector: 'app-purchases',
  imports: [
    CommonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule, 
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent {
  displayedColumns: string[] = ['id', 'supplierName', 'totalQuantity', 'totalPrice', 'date', 'viewDetails'];
  dataSource = new MatTableDataSource<Purchase>([]);

  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId: number | null = null;
  productNameFilter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private purchaseService: PurchaseService
  ) {}

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
      this.dataSource.data = purchases;
      this.dataSource.paginator = this.paginator;
    });
  }

  // Called when the category or product filter is changed
  onFilterChange(): void {
    this.loadPurchases();  // Reload the purchases based on the updated filters
  }

  // Open dialog to create a new purchase
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
      supplier_email: result.supplierEmail || '',  // Fallback if not provided
      date: result.date,
      total_quantity: result.totalQuantity,
      total_price: result.totalPrice,
      payment_type_id: result.paymentType.id,
      payment_reference_number: result.paymentReferenceNumber,
      delivery_type_id: result.deliveryType.id,
      shop_ids: result.shopIds, // Assuming shopIds is an array of numbers
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
    // Convert dataSource.data to worksheet and workbook
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchases');

    // Write workbook result as binary array
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