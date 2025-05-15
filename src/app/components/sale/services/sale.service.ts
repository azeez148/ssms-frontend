import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { DeliveryType, PaymentType, Sale } from '../data/sale-model';  // Adjust the path to your sale-model
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private sales: Sale[] = [];
  private apiUrl = environment.apiUrl + '/sales'; // Your API base URL for sales
  private paymentTypeUrl = environment.apiUrl + '/paymentType'; // Your API base URL for sales
  private deliveryTypeUrl = environment.apiUrl + '/deliveryType'; // Your API base URL for sales


  constructor(private http: HttpClient) {}

  // Add a new sale
  addSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/addSale`, sale).pipe(
      tap((newSale: Sale) => {
        this.getSales().subscribe();  // Reload the sales list after adding
      })
    );
  }

  // Get all sales (no filters)
  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/all`).pipe(
      tap((sales: Sale[]) => {
        this.sales = sales;  // Store the fetched sales
      })
    );
  }

  // Get filtered sales based on category and product name
  getFilteredSales(categoryId: number | null, productNameFilter: string): Observable<Sale[]> {
    const payload = {
      categoryId: categoryId,
      productNameFilter: productNameFilter
    };
  
    return this.http.post<Sale[]>(`${this.apiUrl}/filterSales`, payload).pipe(
      tap((sales: Sale[]) => {
        this.sales = sales;  // Store the filtered sales
      })
    );
  }

  // Get sale details by ID
  getSaleById(saleId: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/getSale/${saleId}`).pipe(
      tap((sale: Sale) => {
        // Optionally store or manipulate the fetched sale
      })
    );
  }

  // Update sale details (if needed)
  updateSale(saleId: string, sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}/updateSale/${saleId}`, sale).pipe(
      tap((updatedSale: Sale) => {
        this.getSales().subscribe();  // Reload sales list after updating
      })
    );
  }

  // New API call to get Payment Types
  getPaymentTypes(): Observable<PaymentType[]> {
    return this.http.get<PaymentType[]>(`${this.paymentTypeUrl}/all`);
  }

  // New API call to get Delivery Types
  getDeliveryTypes(): Observable<DeliveryType[]> {
    return this.http.get<DeliveryType[]>(`${this.deliveryTypeUrl}/all`);
  }
}
