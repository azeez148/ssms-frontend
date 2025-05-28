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
import { Sale } from '../data/sale-model';
import { SaleDialogComponent } from '../sale-dialog/sale-dialog.component';
import { SaleService } from '../services/sale.service';
import { Product } from '../../product/data/product-model';
import { SaleDetailDialogComponent } from '../sale-detail-dialog/sale-detail-dialog.component';

@Component({
  selector: 'app-sales',
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
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {
  displayedColumns: string[] = ['id', 'customerName', 'totalQuantity', 'totalPrice', 'date', 'viewDetails'];
  dataSource = new MatTableDataSource<Sale>([]);

  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId: number | null = null;
  productNameFilter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
    this.loadSales(); // Load all sales initially
  }

  loadSales(): void {
    this.saleService.getSales().subscribe(sales => {
      this.dataSource.data = sales;
      this.dataSource.paginator = this.paginator;
    });
  }

  // Called when the category or product filter is changed
  onFilterChange(): void {
    this.loadSales();  // Reload the sales based on the updated filters
  }

  // Open dialog to create a new sale
  openCreateSaleDialog(): void {
    const dialogRef = this.dialog.open(SaleDialogComponent, {
      maxWidth: '1000px',
      height: '800px',
      data: this.products
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saleService.addSale(result).subscribe(newProduct => {
          console.log(newProduct);
        });
      }
    });
  }

  viewDetails(sale: any): void {
    this.dialog.open(SaleDetailDialogComponent, {
      width: '600px',
      // Pass the sale details as data
      data: sale
    });
  }

  exportExcel(): void {
      // Convert dataSource.data to worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sales');
  
      // Write workbook result as binary array
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'sales_data');
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