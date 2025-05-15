import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { Purchase } from '../data/purchase-model';
import { PurchaseDialogComponent } from '../purchase-dialog/purchase-dialog.component';
import { PurchaseService } from '../services/purchase.service';
import { Product } from '../../product/data/product-model';

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
  displayedColumns: string[] = ['id', 'vendorName', 'totalQuantity', 'totalPrice', 'date'];
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
        this.purchaseService.addPurchase(result).subscribe(newProduct => {
          console.log(newProduct);
        });
      }
    });
  }
}