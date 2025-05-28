import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../../product/data/product-model';
import { Category } from '../../category/data/category-model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CategoryService } from '../../category/services/category.service';
import { ProductService } from '../../product/services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';  // <-- Import MatChipsModule here
import { MatDialog } from '@angular/material/dialog';
import { StockService } from '../services/stock.service';
import { ExcelImportDialogComponent } from '../excel-import-dialog/excel-import-dialog.component';

// Import xlsx and file-saver libraries:
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-stocks',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, FormsModule, MatInputModule, MatChipsModule],
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent {
  displayedColumns: string[] = ['id', 'name', 'description', 'category', 'quantity'];
  dataSource = new MatTableDataSource<Product>([]);
  
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  productNameFilter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.loadProducts(); // Load all products initially
  }

  loadProducts(): void {
    // Fetch products with the selected category and type filter
    this.productService.getFilteredProducts(this.selectedCategoryId, this.productNameFilter).subscribe(products => {
      this.dataSource.data = products;
      this.dataSource.paginator = this.paginator;
    });
  }

  // This method will be called when the category is changed or the product filter is applied
  onFilterChange(): void {
    this.loadProducts();  // Reload the products based on new filters
  }

  // Function to return sizes and their quantities with non-zero quantity
  // getAvailableSizesWithQuantities(sizeMap: any): string[] {
  //   const availableSizesWithQuantities: string[] = [];
  //   let isOutOfStock = true;
  
  //   // Iterate over sizeMap to check if there's any size with a quantity greater than 0
  //   for (const size in sizeMap) {
  //     if (sizeMap[size] > 0) {
  //       availableSizesWithQuantities.push(`${size}:${sizeMap[size]}`);
  //       isOutOfStock = false;  // At least one size has stock, so it's not out of stock
  //     }
  //   }
  
  //   // If all sizes have 0 quantity, return "Out of Stock"
  //   if (isOutOfStock) {
  //     availableSizesWithQuantities.push('Out of Stock');
  //   }
  
  //   return availableSizesWithQuantities;
  // }

  getAvailableSizesWithQuantities(sizeMap: any): string[] {
    const availableSizesWithQuantities: string[] = [];
    let isOutOfStock = true;
  
    // Iterate over sizeMap to check if there's any size with a quantity greater than 0 or less than 0
    for (const size in sizeMap) {
      const quantity = sizeMap[size];
      if (quantity > 0) {
        availableSizesWithQuantities.push(`${size}:${quantity}`);
        isOutOfStock = false;  // At least one size has stock, so it's not out of stock
      } else if (quantity < 0) {
        availableSizesWithQuantities.push(`${size}:${quantity}`); // Display negative quantities
      }
    }
  
    // If all sizes have 0 quantity, return "Out of Stock"
    if (isOutOfStock) {
      availableSizesWithQuantities.push('Out of Stock');
    }
  
    return availableSizesWithQuantities;
  }
  
  openExcelImportDialog(): void {
    const dialogRef = this.dialog.open(ExcelImportDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result is the File object.
        this.uploadExcelData(result);
      }
    });
  }

  uploadExcelData(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    // Call your service method to upload the data.
    this.stockService.uploadExcel(formData).subscribe(response => {
      // Handle server response
      console.log('Excel data uploaded successfully', response);
    });
  }

  downloadExcel(): void {
    // Convert dataSource.data to a worksheet.
    // You might want to process/extract only the fields you want to export.
    
    const dataToExport = this.dataSource.data.map(product => ({
      ...product,
      sizeMap: `{${this.getAvailableSizesWithQuantities(product.sizeMap).join(', ')}}`
    }));

    console.log('Data to export:', dataToExport); // Debugging line to check the data structure
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);


    // Create a new workbook and append the worksheet.
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stocks');

    // Write workbook to binary array.
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'stocks_data');
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