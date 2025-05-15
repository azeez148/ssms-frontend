import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../category/services/category.service';

@Component({
  selector: 'app-assign-attribute-dialog',
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatOptionModule],
  templateUrl: './assign-attribute-dialog.component.html',
  styleUrl: './assign-attribute-dialog.component.css'
})
export class AssignAttributeDialogComponent {
  assignForm: FormGroup;
  attributes: any[] = [];
  categories: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AssignAttributeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.assignForm = this.fb.group({
      attributeId: ['', Validators.required],
      value: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
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