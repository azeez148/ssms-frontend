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
        // convert the underscore keys to camelCase
        data.products = data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          sizeMap: product.size_map,
          unitPrice: product.unit_price,
          sellingPrice: product.selling_price,
          imageUrl: product.image_url || '',
          isActive: product.is_active,
          canListed: product.can_listed
        }));
        // Prepend the base URL to each product's imageUrl
        data.products.forEach(product => {
          if (product.imageUrl) {
            product.imageUrl = `${environment.apiUrl}/${product.imageUrl}`;
          }
          else {
          product.imageUrl = 'notfound.png';
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