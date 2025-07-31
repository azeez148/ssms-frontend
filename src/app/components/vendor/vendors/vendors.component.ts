import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vendor } from '../data/vendor.model';
import { VendorService } from '../services/vendor.service';
import { VendorDialogComponent } from '../vendor-dialog/vendor-dialog.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class VendorsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'address', 'mobile', 'email', 'actions'];
  vendors: Vendor[] = [];

  constructor(private vendorService: VendorService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.vendorService.getVendors().subscribe(data => {
      this.vendors = data;
    });
  }

  openDialog(vendor?: Vendor): void {
    const dialogRef = this.dialog.open(VendorDialogComponent, {
      width: '400px',
      data: vendor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (vendor) {
          // Edit mode
          this.vendorService.updateVendor(result).subscribe(() => this.loadVendors());
        } else {
          // Create mode
          this.vendorService.createVendor(result).subscribe(() => this.loadVendors());
        }
      }
    });
  }

  deleteVendor(id: number): void {
    this.vendorService.deleteVendor(id).subscribe(() => this.loadVendors());
  }
}
