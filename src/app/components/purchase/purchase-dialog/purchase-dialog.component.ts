import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../product/data/product-model';
import { Purchase, PurchaseItem, PaymentType, DeliveryType } from '../data/purchase-model';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../services/purchase.service';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../vendor/services/vendor.service';
import { Vendor } from '../../vendor/data/vendor.model';
import { Category } from '../../category/data/category-model';
import { CategoryService } from '../../category/services/category.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-purchase-dialog',
  templateUrl: './purchase-dialog.component.html',
  styleUrls: ['./purchase-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
})
export class PurchaseDialogComponent implements OnInit {
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
    supplierEmail: '',
    supplierId: 0,
    date: '',
    purchaseItems: [],
    totalQuantity: 0,
    totalPrice: 0,
    paymentType: { id: 0, name: '', description: '' },
    paymentReferenceNumber: '',
    deliveryType: { id: 0, name: '', description: '' },
    shopIds: [1]
  };

  pageSize = 5;
  pageIndex = 0;
  vendors: Vendor[] = [];
  paymentTypes: PaymentType[] = [];
  deliveryTypes: DeliveryType[] = [];

  constructor(
    public dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product[],
    private purchaseService: PurchaseService,
    private vendorService: VendorService,
    private categoryService: CategoryService
  ) {
    this.convertProductsToPurchaseItems();
  }

  ngOnInit() {
    const today = new Date();
    this.purchase.date = today.toISOString().split('T')[0];

    this.loadPaymentTypes();
    this.loadDeliveryTypes();
    this.loadVendors();
    this.loadCategories();
    this.updatePagination();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onVendorSelected(vendor: Vendor): void {
    this.purchase.supplierName = vendor.name;
    this.purchase.supplierAddress = vendor.address || '';
    this.purchase.supplierMobile = vendor.mobile;
    this.purchase.supplierEmail = vendor.email || '';
    this.purchase.supplierId = vendor.id;
  }

  loadVendors(): void {
    this.vendorService.getVendors().subscribe(data => {
      this.vendors = data;
    });
  }

  convertProductsToPurchaseItems(): void {
    this.purchaseItems = this.data.flatMap(product =>
      product.sizeMap.map(sizeEntry => ({
        productId: product.id,
        productName: product.name,
        productCategory: product.category.name,
        size: sizeEntry.size,
        quantityAvailable: sizeEntry.quantity,
        quantity: 1,
        purchasePrice: product.sellingPrice,
        totalPrice: 0
      }))
    );
    this.filteredPurchaseItems = this.purchaseItems;
  }

  loadPaymentTypes(): void {
    this.purchaseService.getPaymentTypes().subscribe((data: PaymentType[]) => {
      this.paymentTypes = data;
      if (this.paymentTypes.length > 0) {
        this.purchase.paymentType = this.paymentTypes[0];
      }
    });
  }

  loadDeliveryTypes(): void {
    this.purchaseService.getDeliveryTypes().subscribe((data: DeliveryType[]) => {
      this.deliveryTypes = data;
      if (this.deliveryTypes.length > 0) {
        this.purchase.deliveryType = this.deliveryTypes[0];
      }
    });
  }

  getTotalPrice(element: PurchaseItem): number {
    const quantity = element.quantity || 0;
    const purchasePrice = element.purchasePrice || 0;
    return quantity * purchasePrice;
  }

  updateTotalSummary(): void {
    this.purchase.totalQuantity = this.selectedPurchaseItems.reduce((sum, item) => sum + item.quantity, 0);
    this.purchase.totalPrice = this.selectedPurchaseItems.reduce((sum, item) => sum + this.getTotalPrice(item), 0);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (!this.purchase.supplierName || !this.purchase.supplierMobile || this.selectedPurchaseItems.length === 0) {
      alert('Please fill in all mandatory fields: Vendor Name, Mobile, and select at least one purchase item.');
      return;
    }
    this.purchase.purchaseItems = this.selectedPurchaseItems;
    this.dialogRef.close(this.purchase);
  }

  applyFilter(event: any): void {
    if (event.target.tagName === 'INPUT') {
      this.searchTerm = event.target.value;
    } else {
      this.selectedCategory = event.target.value;
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
    this.pageIndex = 0;
    this.updatePagination();
  }

  toggleSelection(purchaseItem: PurchaseItem): void {
    const index = this.selectedPurchaseItems.findIndex(item => item.productId === purchaseItem.productId && item.size === purchaseItem.size);
    if (index >= 0) {
      this.selectedPurchaseItems.splice(index, 1);
    } else {
      this.selectedPurchaseItems.push(purchaseItem);
    }
    this.updateTotalSummary();
  }

  isSelected(purchaseItem: PurchaseItem): boolean {
    return this.selectedPurchaseItems.some(item => item.productId === purchaseItem.productId && item.size === purchaseItem.size);
  }

  selectAll(event: any): void {
    if (event.target.checked) {
      this.selectedPurchaseItems = [...this.filteredPurchaseItems];
    } else {
      this.selectedPurchaseItems = [];
    }
    this.updateTotalSummary();
  }

  onPageChange(page: number): void {
    this.pageIndex = page - 1;
  }

  updatePagination(): void {
    // ngx-pagination handles this automatically
  }
}
