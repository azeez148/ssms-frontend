import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../category/services/category.service';
import { AttributeService } from '../services/attribute.service';
import { Category } from '../../category/data/category-model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-attribute-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
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
    if (this.data.attribute) {
      this.attributeForm.patchValue(this.data.attribute);
      this.values.clear();
      this.data.attribute.values.forEach((value: any) => this.values.push(this.createValueFormGroup(value)));
    }
  }

  get values(): FormArray {
    return this.attributeForm.get('values') as FormArray;
  }

  createValueFormGroup(value = ''): FormGroup {
    return this.fb.group({
      value: [value, Validators.required]
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