import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sale-details-dialog',
    templateUrl: './sale-detail-dialog.component.html',
    styleUrls: ['./sale-detail-dialog.component.css'],
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    standalone: true
})
export class SaleDetailDialogComponent {
constructor(
    public dialogRef: MatDialogRef<SaleDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onUpdate(): void {
    // Implement update functionality here
    console.log('Update clicked for', this.data);
  }

  onDelete(): void {
    // Implement delete functionality here
    console.log('Delete clicked for', this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}