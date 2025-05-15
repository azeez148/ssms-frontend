import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-excel-import-dialog',
  templateUrl: './excel-import-dialog.component.html',
  styleUrls: ['./excel-import-dialog.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule
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
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.selectedFile) {
      // Pass the file (or you could wrap it into a FormData)
      this.dialogRef.close(this.selectedFile);
    }
  }
}
