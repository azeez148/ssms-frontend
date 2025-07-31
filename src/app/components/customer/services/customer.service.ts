import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Customer } from '../data/customer.model';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = environment.apiUrl + '/customers';
  private customers: Customer[] = [
    { id: 1, name: 'John Doe', address: '123 Main St', mobile: '555-1234', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', address: '456 Oak Ave', mobile: '555-5678', email: 'jane.smith@example.com' }
  ];
  private nextId = 3;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    // For now, return mock data. Replace with HTTP call later.
    return of(this.customers);
    // return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: number): Observable<Customer> {
    const customer = this.customers.find(c => c.id === id);
    return of(customer as Customer);
    // return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    customer.id = this.nextId++;
    this.customers.push(customer);
    return of(customer);
    // return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    const index = this.customers.findIndex(c => c.id === customer.id);
    if (index > -1) {
      this.customers[index] = customer;
    }
    return of(customer);
    // return this.http.put<Customer>(`${this.apiUrl}/${customer.id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index > -1) {
      this.customers.splice(index, 1);
    }
    return of(undefined);
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
