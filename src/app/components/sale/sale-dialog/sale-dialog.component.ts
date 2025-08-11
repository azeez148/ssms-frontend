import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../product/data/product-model';
import { Sale, SaleItem, PaymentType, DeliveryType } from '../data/sale-model';
import { CommonModule } from '@angular/common';
import { SaleService } from '../services/sale.service';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../customer/services/customer.service';
import { Customer } from '../../customer/data/customer.model';
import { Category } from '../../category/data/category-model';
import { CategoryService } from '../../category/services/category.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./sale-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
})
export class SaleDialogComponent implements OnInit {
  saleItems: SaleItem[] = [];
  filteredSaleItems: SaleItem[] = [];
  selectedSaleItems: SaleItem[] = [];
  categories: Category[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';

  sale: Sale = {
    id: 0,
    customerName: '',
    customerAddress: '',
    customerMobile: '',
    customerEmail: '',
    customerId: 0,
    shopId: 0,
    date: '',
    saleItems: [],
    totalQuantity: 0,
    totalPrice: 0,
    paymentType: { id: 0, name: '', description: '' },
    paymentReferenceNumber: '',
    deliveryType: { id: 0, name: '', description: '' }
  };

  pageSize = 5;
  pageIndex = 0;
  customers: Customer[] = [];
  paymentTypes: PaymentType[] = [];
  deliveryTypes: DeliveryType[] = [];

  constructor(
    public dialogRef: MatDialogRef<SaleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product[],
    private saleService: SaleService,
    private customerService: CustomerService,
    private categoryService: CategoryService
  ) {
    this.convertProductsToSaleItems();
  }

  ngOnInit() {
    const today = new Date();
    this.sale.date = today.toISOString().split('T')[0];

    this.loadPaymentTypes();
    this.loadDeliveryTypes();
    this.loadCustomers();
    this.loadCategories();
    this.updatePagination();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onCustomerSelected(customer: Customer): void {
    this.sale.customerName = customer.name;
    this.sale.customerAddress = customer.address || '';
    this.sale.customerMobile = customer.mobile;
    this.sale.customerEmail = customer.email || '';
    this.sale.customerId = customer.id;
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.customers = data;
    });
  }

  convertProductsToSaleItems(): void {
    this.saleItems = this.data.flatMap(product =>
      product.sizeMap.map(sizeEntry => ({
        productId: product.id,
        productName: product.name,
        productCategory: product.category.name,
        size: sizeEntry.size,
        quantityAvailable: sizeEntry.quantity,
        quantity: 1,
        salePrice: product.sellingPrice,
        totalPrice: 0
      }))
    );
    this.filteredSaleItems = this.saleItems;
  }


  loadPaymentTypes(): void {
    this.saleService.getPaymentTypes().subscribe((data: PaymentType[]) => {
      this.paymentTypes = data;
      if (this.paymentTypes.length > 0) {
        this.sale.paymentType = this.paymentTypes[0];
      }
    });
  }

  loadDeliveryTypes(): void {
    this.saleService.getDeliveryTypes().subscribe((data: DeliveryType[]) => {
      this.deliveryTypes = data;
      if (this.deliveryTypes.length > 0) {
        this.sale.deliveryType = this.deliveryTypes[0];
      }
    });
  }

  getTotalPrice(element: SaleItem): number {
    const quantity = element.quantity || 0;
    const salePrice = element.salePrice || 0;
    return quantity * salePrice;
  }

  updateTotalSummary(): void {
    this.sale.totalQuantity = this.selectedSaleItems.reduce((sum, item) => sum + item.quantity, 0);
    this.sale.totalPrice = this.selectedSaleItems.reduce((sum, item) => sum + this.getTotalPrice(item), 0);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (!this.sale.customerName || !this.sale.customerMobile || this.selectedSaleItems.length === 0) {
      alert('Please fill in all mandatory fields: Customer Name, Mobile, and select at least one sale item.');
      return;
    }
    this.sale.saleItems = this.selectedSaleItems;
    this.dialogRef.close(this.sale);
  }

  applyFilter(event: any): void {
    if (event.target.tagName === 'INPUT') {
      this.searchTerm = event.target.value;
    } else {
      this.selectedCategory = event.target.value;
    }

    let filteredItems = this.saleItems;

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

    this.filteredSaleItems = filteredItems;
    this.pageIndex = 0;
    this.updatePagination();
  }

  toggleSelection(saleItem: SaleItem): void {
    const index = this.selectedSaleItems.findIndex(item => item.productId === saleItem.productId && item.size === saleItem.size);
    if (index >= 0) {
      this.selectedSaleItems.splice(index, 1);
    } else {
      this.selectedSaleItems.push(saleItem);
    }
    this.updateTotalSummary();
  }

  isSelected(saleItem: SaleItem): boolean {
    return this.selectedSaleItems.some(item => item.productId === saleItem.productId && item.size === saleItem.size);
  }

  selectAll(event: any): void {
    if (event.target.checked) {
      this.selectedSaleItems = [...this.filteredSaleItems];
    } else {
      this.selectedSaleItems = [];
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
