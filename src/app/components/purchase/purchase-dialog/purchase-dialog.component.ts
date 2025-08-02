import { Component, Inject, NO_ERRORS_SCHEMA, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../product/data/product-model';
import { Purchase, PurchaseItem, PaymentType, DeliveryType } from '../data/purchase-model';
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
import { PurchaseService } from '../services/purchase.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { VendorService } from '../../vendor/services/vendor.service';
import { Vendor } from '../../vendor/data/vendor.model';
import { Observable, startWith, map } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Category } from '../../category/data/category-model';
import { CategoryService } from '../../category/services/category.service';

@Component({
  selector: 'app-purchase-dialog',
  templateUrl: './purchase-dialog.component.html',
  styleUrls: ['./purchase-dialog.component.css'],
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
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
  ]
})
export class PurchaseDialogComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['selectAll', 'id', 'name', 'category', 'size', 'quantityAvailable', 'quantity', 'purchasePrice', 'totalPrice'];
  purchaseItems: PurchaseItem[] = [];
  filteredPurchaseItems: PurchaseItem[] = [];
  selectedPurchaseItems: PurchaseItem[] = [];
  categories: Category[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';

  purchase: Purchase = {
    id: 0,
    supplierName: '',
    supplierAddress: '',
    supplierMobile: '',
    supplierEmail: '', // Reset email
    supplierId: 0, // Reset vendor ID
    date: '',  // Initialize as empty string
    purchaseItems: [],
    totalQuantity: 0,
    totalPrice: 0,
    paymentType: { id: 0, name: '', description: '' }, // Default to empty object
    paymentReferenceNumber: '',
    deliveryType: { id: 0, name: '', description: '' }, // Default to empty object
    shopIds: [1]
  };

  pageSize = 5;
  pageIndex = 0;
  length = 0;
  paymentTypes: PaymentType[] = [];
  deliveryTypes: DeliveryType[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  vendorCtrl = new FormControl();
  filteredVendors: Observable<Vendor[]>;
  vendors: Vendor[] = [];

  constructor(
    public dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product[],
    private purchaseService: PurchaseService,
    private vendorService: VendorService,
    private categoryService: CategoryService
  ) {
    this.convertProductsToPurchaseItems();
    this.filteredVendors = this.vendorCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterVendors(value || ''))
    );
  }

  ngOnInit() {
    const today = new Date();
    this.purchase.date = today.toISOString().split('T')[0]; // Set default date to today

    this.loadPaymentTypes();
    this.loadDeliveryTypes();
    this.loadVendors();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  private _filterVendors(value: string): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendors.filter(vendor => vendor.name.toLowerCase().includes(filterValue));
  }

  onVendorSelected(vendor: Vendor): void {
    this.purchase.supplierName = vendor.name;
    this.purchase.supplierAddress = vendor.address || '';
    this.purchase.supplierMobile = vendor.mobile;
    this.purchase.supplierEmail = vendor.email || '';
    this.purchase.supplierId = vendor.id; // Set the supplier ID
  }

  loadVendors(): void {
    this.vendorService.getVendors().subscribe(data => {
      this.vendors = data;
    });
  }

  ngAfterViewInit(): void {
    this.filteredPurchaseItems = this.purchaseItems.slice(0, this.pageSize); // Set the initial page data
  }

convertProductsToPurchaseItems(): void {
  this.purchaseItems = [];

  this.data.forEach(product => {
    product.sizeMap.forEach(sizeEntry => {
      const purchaseItem: PurchaseItem = {
        productId: product.id,
        productName: product.name,
        productCategory: product.category.name,
        size: sizeEntry.size,
        quantityAvailable: sizeEntry.quantity,
        quantity: 1, // Default selected quantity
        purchasePrice: product.sellingPrice,
        totalPrice: 0 // Initially 0
      };
      this.purchaseItems.push(purchaseItem);
    });
  });

  this.length = this.purchaseItems.length;
  this.filteredPurchaseItems = this.purchaseItems;
}

  loadPaymentTypes(): void {
    this.purchaseService.getPaymentTypes().subscribe((data: PaymentType[]) => {
      this.paymentTypes = data;
      if (this.paymentTypes.length > 0) {
        this.purchase.paymentType = this.paymentTypes[0]; // Set to the first payment type by default
      }
    });
  }

  loadDeliveryTypes(): void {
    this.purchaseService.getDeliveryTypes().subscribe((data: DeliveryType[]) => {
      this.deliveryTypes = data;
      if (this.deliveryTypes.length > 0) {
        this.purchase.deliveryType = this.deliveryTypes[0]; // Set to the first delivery type by default
      }
    });
  }

  calculateTotalPrice(element: PurchaseItem): number {
    return element.quantity * element.purchasePrice;
  }

  getTotalPrice(element: PurchaseItem): number {
    const quantity = element.quantity || 0;  // Default to 0 if quantity is undefined or NaN
    const purchasePrice = element.purchasePrice || 0;  // Default to 0 if purchasePrice is undefined or NaN

    return !isNaN(quantity) && !isNaN(purchasePrice) ? quantity * purchasePrice : 0;
  }

  updateTotalSummary(): void {
    this.purchase.totalQuantity = this.selectedPurchaseItems.reduce((sum, item) => sum + item.quantity, 0);
    this.purchase.totalPrice = this.selectedPurchaseItems.reduce((sum, item) => sum + this.getTotalPrice(item), 0);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    // Reset the purchase and selected purchase items
    this.selectedPurchaseItems = [];
    this.purchase = {
      id: 0,
      supplierName: '',
      supplierAddress: '',
      supplierMobile: '',
      supplierEmail: '', // Reset email
      supplierId: 0, // Reset vendor ID
      date: '', 
      purchaseItems: [],
      totalQuantity: 0,
      totalPrice: 0,
      paymentType: { id: 0, name: '', description: '' },
      paymentReferenceNumber: '',
      deliveryType: { id: 0, name: '', description: '' },
      shopIds: []
    };
    this.dialogRef.close();
  }

  onCreate(): void {
    // Validate that vendor name, mobile number, and purchase items are selected
    if (!this.purchase.supplierName || !this.purchase.supplierMobile || this.selectedPurchaseItems.length === 0) {
      alert('Please fill in all mandatory fields: Vendor Name, Mobile, and select at least one purchase item.');
      return; // Prevent creation if the fields are not filled
    }

    this.purchase.purchaseItems = this.selectedPurchaseItems;

    // Pass the selected purchase items and the purchase data to the parent component

    this.dialogRef.close(this.purchase);
  }

  applyFilter(event: any): void {
    if (event instanceof KeyboardEvent) {
      this.searchTerm = (event.target as HTMLInputElement).value;
    } else {
      this.selectedCategory = event.value;
    }

    let filteredItems = this.purchaseItems;

    if (this.searchTerm) {
      filteredItems = filteredItems.filter(item =>
        item.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategory !== 'all') {
      filteredItems = filteredItems.filter(item =>
        item.productCategory === this.selectedCategory
      );
    }

    this.filteredPurchaseItems = filteredItems;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.updatePagination();
  }

  toggleSelection(purchaseItem: PurchaseItem): void {
    const index = this.selectedPurchaseItems.indexOf(purchaseItem);
    if (index >= 0) {
      this.selectedPurchaseItems.splice(index, 1);
    } else {
      this.selectedPurchaseItems.push(purchaseItem);
    }
    this.updateTotalSummary();
  }

  isSelected(purchaseItem: PurchaseItem): boolean {
    return this.selectedPurchaseItems.includes(purchaseItem);
  }

  selectAll(event: any): void {
    if (event.checked) {
      this.selectedPurchaseItems = [...this.filteredPurchaseItems];
    } else {
      this.selectedPurchaseItems = [];
    }
    this.updateTotalSummary();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagination();
  }

  updatePagination(): void {
    this.filteredPurchaseItems = this.purchaseItems.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
}
