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
  selectedImage: File | null = null;  // Stores a single image

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageForm = this.fb.group({
      image: [null]  // Form control for a single image
    });
  }

  // Handle file change event to accept a single image
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;  // Store the single file
    }
  }

  // Save the selected image
  onSave(): void {
    if (this.selectedImage) {
      this.dialogRef.close(this.selectedImage);  // Close dialog and pass the single image back
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
