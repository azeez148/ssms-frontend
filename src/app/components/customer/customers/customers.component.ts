import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '../data/customer.model';
import { CustomerService } from '../services/customer.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'address', 'mobile', 'email', 'actions'];
  dataSource = new MatTableDataSource<Customer>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private customerService: CustomerService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
