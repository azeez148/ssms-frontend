import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { DeliveryType, PaymentType, Purchase } from '../data/purchase-model';  // Adjust the path to your purchase-model
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchases: Purchase[] = [];
  private apiUrl = environment.apiUrl + '/purchases'; // Your API base URL for purchases
  private paymentTypeUrl = environment.apiUrl + '/paymentType'; // Your API base URL for purchases
  private deliveryTypeUrl = environment.apiUrl + '/deliveryType'; // Your API base URL for purchases


  constructor(private http: HttpClient) {}

  // Add a new purchase
  addPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.apiUrl}/addPurchase`, purchase).pipe(
      tap((newPurchase: Purchase) => {
        this.getPurchases().subscribe();  // Reload the purchases list after adding
      })
    );
  }

  // Get all purchases (no filters)
  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/all`).pipe(
      tap((purchases: Purchase[]) => {
        this.purchases = purchases;  // Store the fetched purchases
      })
    );
  }

  // Get filtered purchases based on category and product name
  getFilteredPurchases(categoryId: number | null, productNameFilter: string): Observable<Purchase[]> {
    const payload = {
      categoryId: categoryId,
      productNameFilter: productNameFilter
    };
  
    return this.http.post<Purchase[]>(`${this.apiUrl}/filterPurchases`, payload).pipe(
      tap((purchases: Purchase[]) => {
        this.purchases = purchases;  // Store the filtered purchases
      })
    );
  }

  // Get purchase details by ID
  getPurchaseById(purchaseId: string): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.apiUrl}/getPurchase/${purchaseId}`).pipe(
      tap((purchase: Purchase) => {
        // Optionally store or manipulate the fetched purchase
      })
    );
  }

  // Update purchase details (if needed)
  updatePurchase(purchaseId: string, purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.apiUrl}/updatePurchase/${purchaseId}`, purchase).pipe(
      tap((updatedPurchase: Purchase) => {
        this.getPurchases().subscribe();  // Reload purchases list after updating
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
