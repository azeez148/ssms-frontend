import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Shop } from '../data/shop-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private shops: Shop[] = [];
  private apiUrl = environment.apiUrl + '/shops';  // Ensure this is set correctly


  constructor(private http: HttpClient) {}


  addShop(shop: Shop): Observable<Shop> {
    return this.http.post<Shop>(`${this.apiUrl}/addShop`, shop).pipe(
      tap((newShop: Shop) => {
      // this.shops.push(newShop);
      this.getShops().subscribe();  // Call getShops on tap
      })
    );
  }

  getShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.apiUrl}/all`).pipe(
      tap((shops: Shop[]) => {
        this.shops = shops;
      })
    );
  }

  updateShop(shop: Shop): Observable<Shop> {
    return this.http.put<Shop>(`${this.apiUrl}/${shop.id}`, shop);
  }
  
}