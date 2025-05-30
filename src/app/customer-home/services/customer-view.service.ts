import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../components/product/data/product-model';
import { environment } from '../../../environment';
import { CustomerHome } from '../data/product-model';

@Injectable({
  providedIn: 'root'
})
export class CustomerHomeService {
  private data: CustomerHome | undefined;
  private apiUrl = environment.apiUrl + '/public';

  constructor(private http: HttpClient) {}

  getHomeData(): Observable<CustomerHome> {
    return this.http.get<CustomerHome>(`${this.apiUrl}/all`).pipe(
      tap((data: CustomerHome) => {
        this.data = data;
      })
    );
  }

  // // getFilteredProducts(categoryId: number | null, productNameFilter: string): Observable<Product[]> {
  // //   const payload = {
  // //     categoryId: categoryId,
  // //     productNameFilter: productNameFilter
  // //   };
  
  // //   return this.http.post<Product[]>(`${this.apiUrl}/filterProducts`, payload).pipe(
  // //     tap((products: Product[]) => {
  // //       this.data = products;  // Update the internal products array with the filtered products
  // //     })
  // //   );
  // }

    // New method to get product image as Blob.
  getProductImage(productId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${productId}/image`, { responseType: 'blob' });
  }
}