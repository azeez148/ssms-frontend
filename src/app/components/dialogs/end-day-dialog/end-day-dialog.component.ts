import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-end-day-dialog',
  templateUrl: './end-day-dialog.component.html',
  styleUrls: ['./end-day-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class EndDayDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EndDayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
