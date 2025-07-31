import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Customer } from '../data/customer.model';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = environment.apiUrl + '/customers';
  private customers: Customer[] = [];
  private nextId = 3;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/all`).pipe(
      tap((customers: Customer[]) => {
        this.customers = customers;  // Store the fetched customers
      })
    );
    // return of(this.customers); // For mock data, uncomment this line
  }

  getCustomer(id: number): Observable<Customer> {
    const customer = this.customers.find(c => c.id === id);
    return of(customer as Customer);
    // return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/addCustomer`, customer).pipe(
      tap((newCustomer: Customer) => {
        this.customers.push(newCustomer);  // Add the new customer to the local array
      })
    );
    // customer.id = this.nextId++;
    // this.customers.push(customer);
    // return of(customer);
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
