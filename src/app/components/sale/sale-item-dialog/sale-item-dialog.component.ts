import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../product/data/product-model';
import { ProductDialogComponent } from '../../product/product-dialog/product-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../product/services/product.service';
import { Category } from '../../category/data/category-model';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sale-item-dialog',
  imports: [
      CommonModule, 
      ReactiveFormsModule,
      MatTableModule, 
      MatPaginatorModule, 
      MatButtonModule, 
      MatFormFieldModule, 
      MatSelectModule, 
      MatInputModule, 
      FormsModule,
      MatDialogModule,
      MatFormFieldModule,
      MatListModule
    ],
  templateUrl: './sale-item-dialog.component.html',
  styleUrl: './sale-item-dialog.component.css'
})
export class SaleItemDialogComponent {
  categories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.categories = data.categories;
    this.products = data.products;
    this.filteredProducts = this.products;

    this.productForm = this.fb.group({
      category: ['', Validators.required],
      productName: ['']
    });

    this.productForm.get('category')?.valueChanges.subscribe(value => {
      this.filterProducts(value, this.productForm.get('productName')?.value);
    });

    this.productForm.get('productName')?.valueChanges.subscribe(value => {
      this.filterProducts(this.productForm.get('category')?.value, value);
    });
  }

  filterProducts(categoryId: string, productName: string): void {
    this.filteredProducts = this.products.filter(product =>
      (categoryId ? product.category.id === +categoryId : true) &&  // Convert categoryId to number
      (productName ? product.name.toLowerCase().includes(productName.toLowerCase()) : true)
    );
  }
  

  onSelectProduct(product: Product): void {
    this.dialogRef.close(product);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}