import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../category/services/category.service';
import { AttributeService } from '../services/attribute.service';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-attribute-dialog',
  templateUrl: './attribute-dialog.component.html',
  styleUrls: ['./attribute-dialog.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule
  ]
})
export class AttributeDialogComponent implements OnInit {
  attributeForm: FormGroup;
  categories: any[] = [];
  availableAttributes: any[] = [];

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
      category: ['', Validators.required],
      values: this.fb.array([this.createValueFormGroup()])
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
    this.attributeService.getAttributes().subscribe(attributes => this.availableAttributes = attributes);
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