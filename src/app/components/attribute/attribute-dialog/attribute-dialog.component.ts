import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../category/services/category.service';
import { AttributeService } from '../services/attribute.service';
import { Category } from '../../category/data/category-model';

@Component({
  selector: 'app-attribute-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './attribute-dialog.component.html',
  styleUrls: ['./attribute-dialog.component.css']
})
export class AttributeDialogComponent implements OnInit {
  attributeForm: FormGroup;
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<AttributeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private attributeService: AttributeService
  ) {
    this.attributeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      values: this.fb.array([this.createValueFormGroup()])
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  get values(): FormArray {
    return this.attributeForm.get('values') as FormArray;
  }

  createValueFormGroup(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required]
    });
  }

  addValue(): void {
    this.values.push(this.createValueFormGroup());
  }

  removeValue(index: number): void {
    if (this.values.length > 1) {
      this.values.removeAt(index);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.attributeForm.valid) {
      const attributeData = {
        ...this.attributeForm.value,
        values: this.values.controls.map(control => control.get('value')!.value)
      };
      this.dialogRef.close(attributeData);
    }
  }
}