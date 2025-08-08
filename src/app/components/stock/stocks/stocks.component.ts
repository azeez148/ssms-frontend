import { Component, OnInit } from '@angular/core';
import { Product } from '../../product/data/product-model';
import { Category } from '../../category/data/category-model';
import { CategoryService } from '../../category/services/category.service';
import { ProductService } from '../../product/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StockService } from '../services/stock.service';
import { ExcelImportDialogComponent } from '../excel-import-dialog/excel-import-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';

// Import xlsx and file-saver libraries:
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stocks: Product[] = [];
  p: number = 1;
  
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  productNameFilter: string = '';
  private allProducts: Product[] = [];


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
      this.stocks = products;
      this.allProducts = products;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.stocks = this.allProducts.filter(product => product.name.toLowerCase().includes(filterValue));
  }
  
  filterByCategory(event: any) {
    const categoryId = event.target.value;
    if (categoryId === 'all') {
      this.stocks = this.allProducts;
    } else {
      this.stocks = this.allProducts.filter(p => p.categoryId === +categoryId);
    }
  }


  getAvailableSizesWithQuantities(sizeMap: { size: string; quantity: number }[]): string[] {
    if (!sizeMap || sizeMap.length === 0) {
      return ['Out of Stock'];
    }

    const availableSizesWithQuantities: string[] = [];
    let isOutOfStock = true;

    for (const entry of sizeMap) {
      const { size, quantity } = entry;
      if (quantity > 0) {
        availableSizesWithQuantities.push(`${size}:${quantity}`);
        isOutOfStock = false;
      } else if (quantity <= 0) {
        // You might want to handle this case differently, e.g., not show it
      }
    }

    if (isOutOfStock) {
      return ['Out of Stock'];
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
    
    const dataToExport = this.stocks.map(product => ({
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