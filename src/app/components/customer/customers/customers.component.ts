import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '../data/customer.model';
import { CustomerService } from '../services/customer.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule
  ]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  allCustomers: Customer[] = [];
  p: number = 1;

  constructor(private customerService: CustomerService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.allCustomers = data;
      this.customers = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.customers = this.allCustomers.filter(customer => customer.name.toLowerCase().includes(filterValue));
  }

  openDialog(customer?: Customer): void {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: '400px',
      data: customer
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (customer) {
          this.customerService.updateCustomer(result).subscribe(() => this.loadCustomers());
        } else {
          this.customerService.createCustomer(result).subscribe(() => this.loadCustomers());
        }
      }
    });
  }

  deleteCustomer(id: number): void {
    this.customerService.deleteCustomer(id).subscribe(() => this.loadCustomers());
  }
}
