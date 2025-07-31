import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product, Quantities } from '../data/product-model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-update-quantity-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './update-quantity-dialog.component.html',
  styleUrl: './update-quantity-dialog.component.css'
})
export class UpdateQuantityDialogComponent {

  quantities: any = {};  // This will hold the size and quantity map

  constructor(
    public dialogRef: MatDialogRef<UpdateQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeQuantities(data.product); // Initialize quantities based on product category
  }

  // Initialize the quantities object based on the product category
  initializeQuantities(product: Product) {
  this.quantities = {}; // Reset quantities object

  const getQuantity = (sizeToFind: string | number): number => {
    const match = product.sizeMap.find(s => s.size === sizeToFind.toString());
    return match ? match.quantity : 0;
  };

  // For Jersey, Shorts, and Five Sleeve
  if (
    product.category.name === 'Jersey' ||
    product.category.name === 'Shorts' ||
    product.category.name === 'Five Sleeve'
  ) {
    this.quantities.sizeType = 'Normal';
    this.quantities.sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    this.quantities.sizes.forEach((size: string) => {
      this.quantities[size] = getQuantity(size);
    });
  }

  // For Boot category
  if (product.category.name === 'Boot') {
    this.quantities.sizeType = 'Boot';
    this.quantities.bootSizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.quantities.bootSizes.forEach((size: number) => {
      this.quantities[size] = getQuantity(size);
    });
  }

  // For Football category
  if (product.category.name === 'Football') {
    this.quantities.sizeType = 'Football';
    this.quantities.footballSizes = [3, 4, 5];
    this.quantities.footballSizes.forEach((size: number) => {
      this.quantities[size] = getQuantity(size);
    });
  }
}

  

  onSave(): void {
    // Prepare the sizeMap object which will only contain size keys and their quantities
    const sizeMap: any = {};

    // For 'Normal' category (e.g., Jersey, Shorts)
    if (this.quantities.sizeType === 'Normal') {
      for (let size of this.quantities.sizes) {
        sizeMap[size] = this.quantities[size] !== undefined ? this.quantities[size] : 0;  // If undefined, set to 0
      }
    }

    // For 'Boot' category
    if (this.quantities.sizeType === 'Boot') {
      for (let size of this.quantities.bootSizes) {
        sizeMap[size] = this.quantities[size] !== undefined ? this.quantities[size] : 0;  // If undefined, set to 0
      }
    }

    // For 'Football' category
    if (this.quantities.sizeType === 'Football') {
      for (let size of this.quantities.footballSizes) {
        sizeMap[size] = this.quantities[size] !== undefined ? this.quantities[size] : 0;  // If undefined, set to 0
      }
    }

    // Send the updated data (productId and sizeMap) to the service
    this.dialogRef.close({
      productId: this.data.product.id,
      sizeMap: sizeMap
    });
  }

  // Handle the category-specific size type change (if needed)
  onSizeTypeChange(event: any) {
    this.quantities.sizeType = event.value;
    this.initializeQuantities(this.data.product);  // Reinitialize quantities based on selected size type
  }

  onCancel(): void {
    // Simply close the dialog without making any changes
    this.dialogRef.close();
  }
}