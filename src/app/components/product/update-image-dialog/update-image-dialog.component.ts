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
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageForm = this.fb.group({
      image: [null]
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.selectedImage) {
      this.dialogRef.close(this.selectedImage);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
