import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shop-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './shop-dialog.component.html',
  styleUrls: ['./shop-dialog.component.css'],
})
export class ShopDialogComponent implements OnInit {
  shopForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ShopDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.shopForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: [''],
      zipcode: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.data.shop) {
      this.shopForm.patchValue(this.data.shop);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.shopForm.valid) {
      this.dialogRef.close(this.shopForm.value);
    }
  }
}
