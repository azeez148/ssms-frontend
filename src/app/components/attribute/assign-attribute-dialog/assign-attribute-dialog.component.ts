import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../category/services/category.service';
import { CommonModule } from '@angular/common';
import { AttributeService } from '../services/attribute.service';
import { Category } from '../../category/data/category-model';
import { Attribute } from '../data/attribute-model';

@Component({
  selector: 'app-assign-attribute-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assign-attribute-dialog.component.html',
  styleUrls: ['./assign-attribute-dialog.component.css']
})
export class AssignAttributeDialogComponent implements OnInit {
  assignForm: FormGroup;
  attributes: Attribute[] = [];
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<AssignAttributeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private attributeService: AttributeService
  ) {
    this.assignForm = this.fb.group({
      attributeId: ['', Validators.required],
      value: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
    this.attributeService.getAttributes().subscribe(attributes => this.attributes = attributes);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAssign(): void {
    if (this.assignForm.valid) {
      this.dialogRef.close(this.assignForm.value);
    }
  }
}