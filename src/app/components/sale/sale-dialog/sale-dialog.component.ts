import { Component, Inject, NO_ERRORS_SCHEMA, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../product/data/product-model';
import { Sale, SaleItem, PaymentType, DeliveryType } from '../data/sale-model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { SaleService } from '../services/sale.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./sale-dialog.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginator,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
  ]
})
export class SaleDialogComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['selectAll', 'id', 'name', 'category', 'size', 'quantityAvailable', 'quantity', 'salePrice', 'totalPrice'];
  saleItems: SaleItem[] = [];
  filteredSaleItems: SaleItem[] = [];
  selectedSaleItems: SaleItem[] = [];

  sale: Sale = {
    id: 0,
    customerName: '',
    customerAddress: '',
    customerMobile: '',
    date: '',  // Initialize as empty string
    saleItems: [],
    totalQuantity: 0,
    totalPrice: 0,
    paymentType: { id: 0, name: '', description: '' }, // Default to empty object
    paymentReferenceNumber: '',
    deliveryType: { id: 0, name: '', description: '' } // Default to empty object
  };

  pageSize = 5;
  pageIndex = 0;
  length = 0;
  paymentTypes: PaymentType[] = [];
  deliveryTypes: DeliveryType[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<SaleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product[],
    private saleService: SaleService
  ) {
    this.convertProductsToSaleItems();
  }

  ngOnInit() {
    const today = new Date();
    this.sale.date = today.toISOString().split('T')[0]; // Set default date to today

    this.loadPaymentTypes();
    this.loadDeliveryTypes();
  }

  ngAfterViewInit(): void {
    this.filteredSaleItems = this.saleItems.slice(0, this.pageSize); // Set the initial page data
  }

  convertProductsToSaleItems(): void {
    this.saleItems = [];
    this.data.forEach(product => {
      const sizes = Object.keys(product.sizeMap);
      sizes.forEach(size => {
        const saleItem: SaleItem = {
          productId: product.id,
          productName: product.name,
          productCategory: product.category.name,
          size: size,
          quantityAvailable: product.sizeMap[size],
          quantity: 1, // Initially no quantity selected
          salePrice: product.sellingPrice,
          totalPrice: 0 // Initially set to 0
        };
        this.saleItems.push(saleItem);
      });
    });

    this.length = this.saleItems.length;  // Set the total number of items for pagination
    this.filteredSaleItems = this.saleItems;
  }

  loadPaymentTypes(): void {
    this.saleService.getPaymentTypes().subscribe((data: PaymentType[]) => {
      this.paymentTypes = data;
      if (this.paymentTypes.length > 0) {
        this.sale.paymentType = this.paymentTypes[0]; // Set to the first payment type by default
      }
    });
  }

  loadDeliveryTypes(): void {
    this.saleService.getDeliveryTypes().subscribe((data: DeliveryType[]) => {
      this.deliveryTypes = data;
      if (this.deliveryTypes.length > 0) {
        this.sale.deliveryType = this.deliveryTypes[0]; // Set to the first delivery type by default
      }
    });
  }

  calculateTotalPrice(element: SaleItem): number {
    return element.quantity * element.salePrice;
  }

  getTotalPrice(element: SaleItem): number {
    const quantity = element.quantity || 0;  // Default to 0 if quantity is undefined or NaN
    const salePrice = element.salePrice || 0;  // Default to 0 if salePrice is undefined or NaN

    return !isNaN(quantity) && !isNaN(salePrice) ? quantity * salePrice : 0;
  }

  updateTotalSummary(): void {
    this.sale.totalQuantity = this.selectedSaleItems.reduce((sum, item) => sum + item.quantity, 0);
    this.sale.totalPrice = this.selectedSaleItems.reduce((sum, item) => sum + this.getTotalPrice(item), 0);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    // Reset the sale and selected sale items
    this.selectedSaleItems = [];
    this.sale = {
      id: 0,
      customerName: '',
      customerAddress: '',
      customerMobile: '',
      date: '', 
      saleItems: [],
      totalQuantity: 0,
      totalPrice: 0,
      paymentType: { id: 0, name: '', description: '' },
      paymentReferenceNumber: '',
      deliveryType: { id: 0, name: '', description: '' }
    };
    this.dialogRef.close();
  }

  onCreate(): void {
    // Validate that customer name, mobile number, and sale items are selected
    if (!this.sale.customerName || !this.sale.customerMobile || this.selectedSaleItems.length === 0) {
      alert('Please fill in all mandatory fields: Customer Name, Mobile, and select at least one sale item.');
      return; // Prevent creation if the fields are not filled
    }

    this.sale.saleItems = this.selectedSaleItems;

    // Pass the selected sale items and the sale data to the parent component

    this.dialogRef.close(this.sale);
  }

  applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredSaleItems = this.saleItems.filter(saleItem => 
      saleItem.productName.toLowerCase().includes(filterValue.trim().toLowerCase())
    );
    this.updatePagination();
  }

  toggleSelection(saleItem: SaleItem): void {
    const index = this.selectedSaleItems.indexOf(saleItem);
    if (index >= 0) {
      this.selectedSaleItems.splice(index, 1);
    } else {
      this.selectedSaleItems.push(saleItem);
    }
    this.updateTotalSummary();
  }

  isSelected(saleItem: SaleItem): boolean {
    return this.selectedSaleItems.includes(saleItem);
  }

  selectAll(event: any): void {
    if (event.checked) {
      this.selectedSaleItems = [...this.filteredSaleItems];
    } else {
      this.selectedSaleItems = [];
    }
    this.updateTotalSummary();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagination();
  }

  updatePagination(): void {
    this.filteredSaleItems = this.saleItems.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
}
