import { Injectable } from '@angular/core';
import { Observable, of, tap, map } from 'rxjs';
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
      map((data: CustomerHome) => {
        // Prepend the base URL to each product's imageUrl
        data.products.forEach(product => {
          if (product.imageUrl) {
            product.imageUrl = `${environment.apiUrl}${product.imageUrl}`;
          }
        });
        return data;
      }),
      tap((data: CustomerHome) => {
        this.data = data;
      })
    );
  }
}