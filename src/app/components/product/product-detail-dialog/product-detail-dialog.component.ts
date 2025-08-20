import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../data/product-model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './product-detail-dialog.component.html',
  styleUrls: ['./product-detail-dialog.component.css']
})
export class ProductDetailDialogComponent {
  editMode = false;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {
    this.editForm = this.fb.group({
      category: [data.product.category?.name],
      unitPrice: [data.product.unitPrice],
      sellingPrice: [data.product.sellingPrice],
      isActive: [data.product.isActive],
      canListed: [data.product.canListed]
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editForm.reset({
        category: this.data.product.category?.name,
        unitPrice: this.data.product.unitPrice,
        sellingPrice: this.data.product.sellingPrice,
        isActive: this.data.product.isActive,
        canListed: this.data.product.canListed
      });
    }
  }

  onUpdate(): void {
    if (this.editForm.valid) {
      const updatedProduct = {
        ...this.data.product,
        ...this.editForm.value
      };
      this.dialogRef.close(updatedProduct);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}