import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '../data/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CustomerDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  ) {
    this.isEditMode = !!this.data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.id],
      name: [this.data?.name || '', Validators.required],
      address: [this.data?.address || ''],
      mobile: [this.data?.mobile || '', Validators.required],
      email: [this.data?.email || '', Validators.email]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
