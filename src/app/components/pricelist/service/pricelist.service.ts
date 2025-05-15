import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { Pricelist } from '../data/pricelist-model';

@Injectable({
  providedIn: 'root'
})
export class PricelistService {
  private pricelists: Pricelist[] = [];
  private apiUrl = environment.apiUrl + '/pricelists';

  constructor(private http: HttpClient) {}

  addPricelist(pricelist: Pricelist): Observable<Pricelist> {
    return this.http.post<Pricelist>(`${this.apiUrl}/addPricelist`, pricelist).pipe(
      tap((newPricelist: Pricelist) => {
        this.getPricelists().subscribe();  // Call getPricelists on tap
      })
    );
  }

  getPricelists(): Observable<Pricelist[]> {
    return this.http.get<Pricelist[]>(`${this.apiUrl}/all`).pipe(
      tap((pricelists: Pricelist[]) => {
        this.pricelists = pricelists;
      })
    );
  }
}
