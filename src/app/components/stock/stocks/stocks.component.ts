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
  inStockProducts: Product[] = [];
  outOfStockProducts: Product[] = [];
  p: number = 1;
  p2: number = 1;
  
  categories: Category[] = [];
  selectedCategoryId: any = 'all';
  productNameFilter: string = '';
  private allProducts: Product[] = [];

  availableSizes: string[] = [];
  selectedSize: any = 'all';


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
    this.productService.getFilteredProducts(null, '').subscribe(products => {
      this.allProducts = products;
      this.stocks = products;
      this.extractAllSizes();
      this.populateStockArrays();
    });
  }

  extractAllSizes(): void {
    const allSizes = new Set<string>();
    this.allProducts.forEach(product => {
      if (product.sizeMap) {
        product.sizeMap.forEach(sizeInfo => {
          allSizes.add(sizeInfo.size);
        });
      }
    });
    this.availableSizes = Array.from(allSizes);
  }

  populateStockArrays(): void {
    this.inStockProducts = this.stocks.filter(p => this.isProductInStock(p));
    this.outOfStockProducts = this.stocks.filter(p => !this.isProductInStock(p));
  }

  isProductInStock(product: Product): boolean {
    if (!product.sizeMap || product.sizeMap.length === 0) {
      return false;
    }
    return product.sizeMap.some(sizeInfo => sizeInfo.quantity > 0);
  }

  applyFilters() {
    let filteredProducts = this.allProducts;

    // Filter by name
    if (this.productNameFilter) {
      const filterValue = this.productNameFilter.toLowerCase();
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(filterValue));
    }

    // Filter by category
    if (this.selectedCategoryId && this.selectedCategoryId !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.categoryId === +this.selectedCategoryId);
    }

    // Filter by size
    if (this.selectedSize && this.selectedSize !== 'all') {
      filteredProducts = filteredProducts.filter(p =>
        p.sizeMap && p.sizeMap.some(s => s.size === this.selectedSize && s.quantity > 0)
      );
    }

    this.stocks = filteredProducts;
    this.populateStockArrays();
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
    
    const dataToExport = this.stocks.map(product => {
      const sizeMapString = product.sizeMap.map(s => `${s.size}:${s.quantity}`).join(', ');
      return {
        ...product,
        sizeMap: `{${sizeMapString}}`
      }
    });

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