import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Product } from '../../product/data/product-model';
import { Category } from '../../category/data/category-model';
import { ProductService } from '../../product/services/product.service';
import { CategoryService } from '../../category/services/category.service';
import { EventOffer } from '../data/events-offers-model';

@Component({
  selector: 'app-events-offers-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './events-offers-dialog.component.html',
  styleUrls: ['./events-offers-dialog.component.css']
})
export class EventsOffersDialogComponent implements OnInit {
  eventOfferForm: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<EventsOffersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventOffer: EventOffer },
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.eventOfferForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      type: ['offer', Validators.required],
      isActive: [true],
      productIds: [[]],
      categoryIds: [[]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    if (data && data.eventOffer) {
      this.eventOfferForm.patchValue({
        ...data.eventOffer,
        productIds: data.eventOffer.products.map(p => p.id),
        categoryIds: data.eventOffer.categories.map(c => c.id)
      });
    }
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => this.products = products);
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.eventOfferForm.valid) {
      this.dialogRef.close(this.eventOfferForm.value);
    }
  }
}
