import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '../data/customer.model';
import { CustomerService } from '../services/customer.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'address', 'mobile', 'email', 'actions'];
  customers: Customer[] = [];

  constructor(private customerService: CustomerService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.customers = data;
    });
  }

  openDialog(customer?: Customer): void {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: '400px',
      data: customer
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (customer) {
          // Edit mode
          this.customerService.updateCustomer(result).subscribe(() => this.loadCustomers());
        } else {
          // Create mode
          this.customerService.createCustomer(result).subscribe(() => this.loadCustomers());
        }
      }
    });
  }

  deleteCustomer(id: number): void {
    this.customerService.deleteCustomer(id).subscribe(() => this.loadCustomers());
  }
}
