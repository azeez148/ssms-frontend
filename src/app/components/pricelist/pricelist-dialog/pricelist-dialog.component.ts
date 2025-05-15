import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../category/services/category.service';
import { AttributeService } from '../../attribute/services/attribute.service';

@Component({
  selector: 'app-pricelist-dialog',
  templateUrl: './pricelist-dialog.component.html',
  styleUrls: ['./pricelist-dialog.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule]
})
export class PricelistDialogComponent implements OnInit {
  pricelistForm: FormGroup;
  categories: any[] = [];
  attributes: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<PricelistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private attributeService: AttributeService
  ) {
    this.pricelistForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      attribute: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
    this.attributeService.getAttributes().subscribe(attributes => this.attributes = attributes);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.pricelistForm.valid) {
      this.dialogRef.close(this.pricelistForm.value);
    }
  }
}
