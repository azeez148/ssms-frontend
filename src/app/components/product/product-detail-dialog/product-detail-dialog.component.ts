import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../data/product-model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-detail-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './product-detail-dialog.component.html',
  styleUrl: './product-detail-dialog.component.css'
})
export class ProductDetailDialogComponent {

  editMode: boolean = false;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {
    // Initialize the reactive form with product data
    this.editForm = this.fb.group({
      category: [data.product.category?.name],
      unitPrice: [data.product.unitPrice],
      sellingPrice: [data.product.sellingPrice],
      isActive: [data.product.isActive],
      canListed: [data.product.canListed]
    });
  }

  toggleEditMode(): void {
    if (this.editMode) {
      // Reset form values if cancelled
      this.editForm.patchValue({
        category: this.data.product.category?.name,
        unitPrice: this.data.product.unitPrice,
        sellingPrice: this.data.product.sellingPrice,
        isActive: this.data.product.isActive,
        canListed: this.data.product.canListed
      });
    }
    this.editMode = !this.editMode;
  }

  onUpdate(): void {
    // Here you can call a service to update the product using this.editForm.value
    // For now, we'll simply close the dialog and pass the updated values back.
    const updatedProduct = {
      ...this.data.product,
      category: { name: this.editForm.value.category },
      unitPrice: this.editForm.value.unitPrice,
      sellingPrice: this.editForm.value.sellingPrice,
      isActive: this.editForm.value.isActive,
      canListed: this.editForm.value.canListed
    };
    this.dialogRef.close(updatedProduct);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}