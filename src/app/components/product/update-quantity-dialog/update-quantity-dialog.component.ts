import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../data/product-model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-quantity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './update-quantity-dialog.component.html',
  styleUrls: ['./update-quantity-dialog.component.css']
})
export class UpdateQuantityDialogComponent implements OnInit {
  quantityForm: FormGroup;
  standardSizes: string[] = [];
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
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {
    this.quantityForm = this.fb.group({
      standardSizes: this.fb.group({}),
      customSizes: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initializeQuantities(this.data.product);
  }

  initializeQuantities(product: Product): void {
    const standardSizesGroup = this.quantityForm.get('standardSizes') as FormGroup;
    const customSizesArray = this.quantityForm.get('customSizes') as FormArray;
    const categoryName = product.category.name;

    if (this.sizeConfig[categoryName]) {
      this.standardSizes = this.sizeConfig[categoryName];
      this.standardSizes.forEach(size => {
        const existingSize = product.sizeMap.find(s => s.size === size);
        standardSizesGroup.addControl(size, this.fb.control(existingSize ? existingSize.quantity : 0, Validators.min(0)));
      });
    }

    const standardSizeNames = new Set(this.standardSizes);
    product.sizeMap.forEach(size => {
      if (!standardSizeNames.has(size.size)) {
        customSizesArray.push(this.fb.group({
          size: [size.size, Validators.required],
          quantity: [size.quantity, Validators.min(0)]
        }));
      }
    });
  }

  get customSizes(): FormArray {
    return this.quantityForm.get('customSizes') as FormArray;
  }

  addCustomSize(): void {
    this.customSizes.push(this.fb.group({
      size: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeCustomSize(index: number): void {
    this.customSizes.removeAt(index);
  }

  onSave(): void {
    if (this.quantityForm.valid) {
      const formValue = this.quantityForm.value;
      const sizeMap: { [key: string]: number } = { ...formValue.standardSizes };

      formValue.customSizes.forEach((customSize: { size: string; quantity: number }) => {
        if (customSize.size) {
          sizeMap[customSize.size] = customSize.quantity;
        }
      });

      this.dialogRef.close({
        productId: this.data.product.id,
        sizeMap: sizeMap
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}