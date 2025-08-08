import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vendor } from '../data/vendor.model';
import { VendorService } from '../services/vendor.service';
import { VendorDialogComponent } from '../vendor-dialog/vendor-dialog.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule
  ]
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  allVendors: Vendor[] = [];
  p: number = 1;

  constructor(private vendorService: VendorService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.vendorService.getVendors().subscribe(data => {
      this.allVendors = data;
      this.vendors = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.vendors = this.allVendors.filter(vendor => vendor.name.toLowerCase().includes(filterValue));
  }

  openDialog(vendor?: Vendor): void {
    const dialogRef = this.dialog.open(VendorDialogComponent, {
      width: '400px',
      data: vendor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (vendor) {
          this.vendorService.updateVendor(result).subscribe(() => this.loadVendors());
        } else {
          this.vendorService.createVendor(result).subscribe(() => this.loadVendors());
        }
      }
    });
  }

  deleteVendor(id: number): void {
    this.vendorService.deleteVendor(id).subscribe(() => this.loadVendors());
  }
}
