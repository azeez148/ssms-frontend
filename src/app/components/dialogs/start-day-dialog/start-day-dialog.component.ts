import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-day-dialog',
  templateUrl: './start-day-dialog.component.html',
  styleUrls: ['./start-day-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class StartDayDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<StartDayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      openingBalance: ['', [Validators.required, Validators.pattern('^[0-9]*\\.?[0-9]+$')]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onStart(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.openingBalance);
    }
  }
}
