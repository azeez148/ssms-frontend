import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-details-dialog',
  templateUrl: './purchase-details-dialog.component.html',
  styleUrls: ['./purchase-details-dialog.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class PurchaseDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PurchaseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onUpdate(): void {
    // Implement update functionality
    console.log('Update clicked for purchase', this.data);
  }

  onDelete(): void {
    // Implement delete functionality
    console.log('Delete clicked for purchase', this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}