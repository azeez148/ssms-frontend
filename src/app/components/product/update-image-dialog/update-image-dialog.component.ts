import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-update-image-dialog',
  templateUrl: './update-image-dialog.component.html',
  styleUrls: ['./update-image-dialog.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, FormsModule]
  
})
export class UpdateImageDialogComponent {
  imageForm: FormGroup;
  selectedImages: File[] = [];  // Array to store multiple images

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageForm = this.fb.group({
      images: [null]  // Form control for image inputs
    });
  }

  // Handle file change event to accept multiple images
  onImageChange(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedImages = Array.from(files);  // Convert file list to array
    }
  }

  // Save the selected images
  onSave(): void {
    if (this.selectedImages.length > 0) {
      this.dialogRef.close(this.selectedImages);  // Close dialog and pass images back to the parent
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
