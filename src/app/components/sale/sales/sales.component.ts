import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Category } from '../../category/data/category-model';
import { CategoryService } from '../../category/services/category.service';
import { ProductService } from '../../product/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sale, SaleItem } from '../data/sale-model';
import { SaleDialogComponent } from '../sale-dialog/sale-dialog.component';
import { SaleService } from '../services/sale.service';
import { Product } from '../../product/data/product-model';
import { SaleDetailDialogComponent } from '../sale-detail-dialog/sale-detail-dialog.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDayStarted } from 'src/app/store/selectors/day.selectors';
import { Observable } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { DayManagementService } from '../../day-management/day-management.service';
import { loadDayState } from 'src/app/store/actions/day.actions';

@Component({
  selector: 'app-sales',
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  standalone: true,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {
  isDayStarted$: Observable<boolean>;

  sales: Sale[] = [];
  p: number = 1;

  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId: number | null = null;
  productNameFilter: string = '';
  selectedDateFilter: string = 'all';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;

  private allSales: Sale[] = [];

  todaysSaleSummary = {
    total_count: 0,
    total_revenue: 0,
    total_items_sold: 0,
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private saleService: SaleService,
    private dayManagementService: DayManagementService,
    private store: Store<AppState>
  ) {
    this.isDayStarted$ = this.store.select(selectDayStarted);
  }

  ngOnInit(): void {
    this.store.dispatch(loadDayState());
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
      this.allSales = sales;
      this.sales = sales;
      this.calculateTodaysSaleSummary();
    });
  }

  calculateTodaysSaleSummary(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysSales = this.allSales.filter(s => {
      const saleDate = new Date(s.date);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });

    this.todaysSaleSummary.total_count = todaysSales.length;
    this.todaysSaleSummary.total_revenue = todaysSales.reduce((acc, sale) => acc + sale.totalPrice, 0);
    this.todaysSaleSummary.total_items_sold = todaysSales.reduce((acc, sale) => acc + sale.totalQuantity, 0);
  }

  // Called when the category or product filter is changed
  onFilterChange(): void {
    let filteredSales = this.allSales;

    if (this.selectedCategoryId) {
      filteredSales = filteredSales.filter(s =>
        s.saleItems.some(item => item.productCategory === this.categories.find(c => c.id === this.selectedCategoryId)?.name)
      );
    }

    if (this.productNameFilter) {
      filteredSales = filteredSales.filter(s =>
        s.saleItems.some(item => item.productName.toLowerCase().includes(this.productNameFilter.toLowerCase()))
      );
    }

    this.applyDateFilter(filteredSales);
  }

  applyDateFilter(filteredSales: Sale[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.selectedDateFilter) {
      case 'today':
        filteredSales = filteredSales.filter(s => new Date(s.date).setHours(0, 0, 0, 0) === today.getTime());
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        filteredSales = filteredSales.filter(s => new Date(s.date).setHours(0, 0, 0, 0) === yesterday.getTime());
        break;
      case 'this_week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        filteredSales = filteredSales.filter(s => new Date(s.date) >= startOfWeek);
        break;
      case 'this_month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        filteredSales = filteredSales.filter(s => new Date(s.date) >= startOfMonth);
        break;
      case 'custom':
        if (this.customStartDate && this.customEndDate) {
          const startDate = new Date(this.customStartDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(this.customEndDate);
          endDate.setHours(23, 59, 59, 999);
          filteredSales = filteredSales.filter(s => {
            const saleDate = new Date(s.date);
            return saleDate >= startDate && saleDate <= endDate;
          });
        }
        break;
      default:
        // No date filter
        break;
    }
    this.sales = filteredSales;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.sales = this.allSales.filter(sale => sale.customerName.toLowerCase().includes(filterValue));
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
        // CONVERT TO underscore case for API compatibility
        const saleData = {
          customer_name: result.customerName,
          customer_address: result.customerAddress,
          customer_mobile: result.customerMobile,
          customer_email: result.customerEmail,
          customer_id: result.customerId || 0, // New field for customer ID
          date: result.date,
          total_quantity: result.totalQuantity,
          total_price: result.totalPrice,
          payment_type_id: result.paymentType.id,
          payment_reference_number: result.paymentReferenceNumber,
          delivery_type_id: result.deliveryType.id,
          shop_id: 1, // Assuming shop_id is not used in this context
          sale_items: result.saleItems.map((item: SaleItem) => ({
            product_id: item.productId,
            product_name: item.productName,
            product_category: item.productCategory,
            size: item.size,
            quantity_available: item.quantityAvailable,
            quantity: item.quantity,
            sale_price: item.salePrice,
            total_price: item.totalPrice
          }))
        };

        this.saleService.addSale(saleData).subscribe(newProduct => {
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.sales);
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

  printReceipt(sale: Sale): void {
    const saleItemsHTML = sale.saleItems.map(item => `
      <tr>
        <td>${item.productName}</td>
        <td>${item.productCategory}</td>
        <td>${item.size}</td>
        <td>${item.quantity}</td>
        <td>${item.salePrice}</td>
        <td>${item.totalPrice}</td>
      </tr>
      `).join('');

    const receiptHTML = `
      <html>
        <head>
        <title>Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .top-info { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
          margin-bottom: 10px; 
          font-size: 13px; 
          }
          .top-info .column { 
          width: 48%; 
          }
          .header { text-align: center; margin-bottom: 20px; }
          .details { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 10px; }
          .details .column { width: 48%; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
        </head>
        <body>
        <div class="top-info">
          <div class="column">
          <p><strong>To:</strong></p>
          <p>${sale.customerName}</p>
          <p>${sale.customerAddress}</p>
          <p><strong>Mobile:</strong> ${sale.customerMobile}</p>
          </div>
          <div class="column">
          <p><strong>From:</strong></p>
          <p>ADrenaline Sports Store</p>
          <p>IGC Jn, Nellikuzhy</p>
          <p>Kothamanagalam, 686691</p>
          <p><strong>Mobile:</strong> 8089325733</p>
          </div>
        </div>
        <div class="header">
          <h2>Sale Receipt</h2>
        </div>
        <div class="details">
          <div class="column">
          <p><strong>Date:</strong> ${sale.date}</p>
          <p><strong>Order ID:</strong> ${sale.id}</p>
          <p><strong>Customer Name:</strong> ${sale.customerName}</p>
          <p><strong>Address:</strong> ${sale.customerAddress}</p>
          <p><strong>Mobile:</strong> ${sale.customerMobile}</p>
          </div>
          <div class="column">
          <p><strong>Total Quantity:</strong> ${sale.totalQuantity}</p>
          <p><strong>Total Price:</strong> ${sale.totalPrice}</p>
          <p><strong>Payment Type:</strong> ${sale.paymentType.name}</p>
          <p><strong>Reference Number:</strong> ${sale.paymentReferenceNumber}</p>
          <p><strong>Delivery Type:</strong> ${sale.deliveryType.name}</p>
          </div>
        </div>
        <h3>Sale Items</h3>
        <table>
          <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Sale Price</th>
            <th>Total Price</th>
          </tr>
          </thead>
          <tbody>
          ${saleItemsHTML}
          </tbody>
        </table>
        </body>
      </html>
      `;
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }

  sendReceiptViaWhatsApp(sale: Sale): void {
    // Create a plain text version of the sale receipt for WhatsApp
    let message = `Sale Receipt\n\n`;
    message += `Date: ${sale.date}\n`;
    message += `Order ID: ${sale.id}\n`;
    message += `Customer Name: ${sale.customerName}\n`;
    message += `Address: ${sale.customerAddress}\n`;
    message += `Mobile: ${sale.customerMobile}\n`;
    message += `Total Quantity: ${sale.totalQuantity}\n`;
    message += `Total Price: ${sale.totalPrice}\n`;
    message += `Payment Type: ${sale.paymentType.name}\n`;
    message += `Reference Number: ${sale.paymentReferenceNumber}\n`;
    message += `Delivery Type: ${sale.deliveryType.name}\n\n`;
    message += `Sale Items:\n`;

    sale.saleItems.forEach(item => {
      message += `- ${item.productName} | Category: ${item.productCategory} | Size: ${item.size} | Qty: ${item.quantity} | Price: ${item.salePrice} | Total: ${item.totalPrice}\n`;
    });

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${sale.customerMobile}&text=${encodedMessage}`;
    window.open(url, '_blank');
  }
}