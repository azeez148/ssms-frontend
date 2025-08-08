import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../data/product-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-quantity-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-quantity-dialog.component.html',
  styleUrls: ['./update-quantity-dialog.component.css']
})
export class UpdateQuantityDialogComponent {

  quantities: any = {};

  constructor(
    public dialogRef: MatDialogRef<UpdateQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeQuantities(data.product);
  }

  initializeQuantities(product: Product) {
    this.quantities = {};

    const getQuantity = (sizeToFind: string | number): number => {
      const match = product.sizeMap.find(s => s.size === sizeToFind.toString());
      return match ? match.quantity : 0;
    };

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
    } else if (product.category.name === 'Boot') {
      this.quantities.sizeType = 'Boot';
      this.quantities.bootSizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      this.quantities.bootSizes.forEach((size: number) => {
        this.quantities[size] = getQuantity(size);
      });
    } else if (product.category.name === 'Football') {
      this.quantities.sizeType = 'Football';
      this.quantities.footballSizes = [3, 4, 5];
      this.quantities.footballSizes.forEach((size: number) => {
        this.quantities[size] = getQuantity(size);
      });
    }
  }

  onSave(): void {
    const sizeMap: any = {};

    if (this.quantities.sizeType === 'Normal') {
      for (let size of this.quantities.sizes) {
        sizeMap[size] = this.quantities[size] !== undefined ? this.quantities[size] : 0;
      }
    } else if (this.quantities.sizeType === 'Boot') {
      for (let size of this.quantities.bootSizes) {
        sizeMap[size] = this.quantities[size] !== undefined ? this.quantities[size] : 0;
      }
    } else if (this.quantities.sizeType === 'Football') {
      for (let size of this.quantities.footballSizes) {
        sizeMap[size] = this.quantities[size] !== undefined ? this.quantities[size] : 0;
      }
    }

    this.dialogRef.close({
      productId: this.data.product.id,
      sizeMap: sizeMap
    });
  }

  onSizeTypeChange(event: any) {
    this.quantities.sizeType = event.target.value;
    this.initializeQuantities(this.data.product);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}