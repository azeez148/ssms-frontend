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

  quantities: any = {
    sizes: [],
    customSizes: []
  };
  newSizeName: string = '';
  newSizeQuantity: number = 0;

  sizeConfig: any = {
    "Jersey": ["S", "M", "L", "XL", "XXL"],
    "5s Jersey": ["S", "M", "L", "XL", "XXL"],
    "Kids Jersey": ["20", "22", "24", "26", "28", "30", "32", "34"],
    "First Copy Jersey": ["S", "M", "L", "XL", "XXL"],
    "Tshirt": ["S", "M", "L", "XL", "XXL"],
    "Dotknit Shorts - Embroidery": ["S", "M", "L", "XL", "XXL"],
    "Dotknit Shorts - Submiation": ["S", "M", "L", "XL", "XXL"],
    "Dotknit Shorts - Plain": ["S", "M", "L", "XL", "XXL"],
    "PP Shorts - Plain": ["S", "M", "L", "XL", "XXL"],
    "PP Shorts - Embroidery": ["S", "M", "L", "XL", "XXL"],
    "FC Shorts": ["S", "M", "L", "XL", "XXL"],
    "NS Shorts": ["S", "M", "L", "XL", "XXL"],
    "Sleeve Less - D/N": ["S", "M", "L", "XL", "XXL"],
    "Sleeve Less - Saleena": ["S", "M", "L", "XL", "XXL"],
    "Sleeve Less - Other": ["S", "M", "L", "XL", "XXL"],
    "Sleeve Less - NS": ["S", "M", "L", "XL", "XXL"],
    "Track Pants - Imp": ["S", "M", "L", "XL", "XXL"],
    "Track Pants - Normal": ["S", "M", "L", "XL", "XXL"],
    "Boot-Adult": ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"],
    "Boot-Kids": ["-13", "-12", "-11", "1", "2", "3", "4"],
    "Boot-Imp": ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"],
    "Shorts-Kids": ["20", "22", "24", "26", "28", "30", "32", "34"],
    "Football": ["3", "4", "5"],
    "Cricket Ball": ["Standard"],
    "Shuttle Bat": ["Standard"],
    "Shuttle Cock": ["Standard"],
    "Foot Pad": ["Free Size"],
    "Foot sleeve": ["Free Size"],
    "Socks-Full": ["Free Size"],
    "Socks-3/4": ["Free Size"],
    "Socks-Half": ["Free Size"],
    "Socks-Ankle": ["Free Size"],
    "Hand Sleeve": ["Free Size"],
    "GK Glove": ["5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"],
    "Trophy": ["Small", "Medium", "Large"]
  };

  constructor(
    public dialogRef: MatDialogRef<UpdateQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeQuantities(data.product);
  }

  initializeQuantities(product: Product) {
    this.quantities = {
      sizes: [],
      customSizes: []
    };

    const getQuantity = (sizeToFind: string | number): number => {
      const match = product.sizeMap.find(s => s.size === sizeToFind.toString());
      return match ? match.quantity : 0;
    };

    const categoryName = product.category.name;
    if (this.sizeConfig[categoryName]) {
      this.quantities.sizes = this.sizeConfig[categoryName];
      this.quantities.sizes.forEach((size: string) => {
        this.quantities[size] = getQuantity(size);
      });
    }
  }

  addCustomSize(): void {
    if (this.newSizeName && !this.quantities.customSizes.some((s: any) => s.size === this.newSizeName)) {
      this.quantities.customSizes.push({ size: this.newSizeName, quantity: this.newSizeQuantity });
      this.newSizeName = '';
      this.newSizeQuantity = 0;
    }
  }

  onSave(): void {
    const sizeMap: any = {};

    // Standard sizes
    for (let size of this.quantities.sizes) {
      sizeMap[size] = this.quantities[size] !== undefined ? this.quantities[size] : 0;
    }

    // Custom sizes
    for (let customSize of this.quantities.customSizes) {
      sizeMap[customSize.size] = customSize.quantity !== undefined ? customSize.quantity : 0;
    }

    this.dialogRef.close({
      productId: this.data.product.id,
      sizeMap: sizeMap
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}