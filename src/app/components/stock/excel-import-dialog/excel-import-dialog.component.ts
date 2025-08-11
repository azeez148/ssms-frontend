import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-excel-import-dialog',
  templateUrl: './excel-import-dialog.component.html',
  styleUrls: ['./excel-import-dialog.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  standalone: true
})
export class ExcelImportDialogComponent {
  selectedFile!: File;

  constructor(
    public dialogRef: MatDialogRef<ExcelImportDialogComponent>
  ) {}

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
      this.dialogRef.close(this.selectedFile);
    }
  }
}
