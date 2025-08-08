import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-excel-import-dialog',
  templateUrl: './excel-import-dialog.component.html',
  styleUrls: ['./excel-import-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class ExcelImportDialogComponent {
  importForm: FormGroup;
  selectedFile!: File;

  constructor(
    public dialogRef: MatDialogRef<ExcelImportDialogComponent>,
    private fb: FormBuilder
  ) {
    this.importForm = this.fb.group({
      file: [null, Validators.required]
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.importForm.get('file')?.setValue(this.selectedFile);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.importForm.valid) {
      this.dialogRef.close(this.selectedFile);
    }
  }
}
