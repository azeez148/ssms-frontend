import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
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
  addPurchase(purchase: any): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.apiUrl}/addPurchase`, purchase).pipe(
      tap((newPurchase: Purchase) => {
        this.getPurchases().subscribe();  // Reload the purchases list after adding
      })
    );
  }

  // Get all purchases (no filters)
  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/all`).pipe(
      map((purchases: any[]): Purchase[] => {
        return purchases.map(purchase => ({
          id: purchase.id,
          supplierName: purchase.vendor.name,
          paymentType: purchase.payment_type,
          deliveryType: purchase.delivery_type,
          supplierAddress: purchase.vendor.address,
          supplierMobile: purchase.vendor.mobile,
          supplierEmail: purchase.vendor.email || '',  // Fallback if not provided
          supplierId: purchase.vendor_id, // New field for supplier ID
          paymentReferenceNumber: purchase.payment_reference_number || '',
          shopIds: purchase.shop_ids || [],  // Fallback to empty array if not provided
          date: purchase.date,
          totalQuantity: purchase.total_quantity,
          totalPrice: purchase.total_price,
          purchaseItems: (purchase.purchase_items || []).map((item: any) => ({
            productId: item.product_id,
            productName: item.product_name,
            productCategory: item.product_category,
            size: item.size,
            quantityAvailable: item.quantity_available,
            quantity: item.quantity,
            purchasePrice: item.purchase_price,
            totalPrice: item.total_price
          }))
        }));
      }),
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
