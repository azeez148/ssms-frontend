import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Vendor } from '../data/vendor.model';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = environment.apiUrl + '/vendors';
  private vendors: Vendor[] = [];
  private nextId = 3;

  constructor(private http: HttpClient) {}

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/all`).pipe(
      tap((vendors: Vendor[]) => {
        this.vendors = vendors;  // Store the fetched vendors
      })
    );
  }

  getVendor(id: number): Observable<Vendor> {
    const vendor = this.vendors.find(v => v.id === id);
    return of(vendor as Vendor);
  }

  createVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.apiUrl}/addVendor`, vendor).pipe(
      tap((newVendor: Vendor) => {
        this.vendors.push(newVendor);  // Add the new vendor to the local array
      })
    );
  }

  updateVendor(vendor: Vendor): Observable<Vendor> {
    const index = this.vendors.findIndex(v => v.id === vendor.id);
    if (index > -1) {
      this.vendors[index] = vendor;
    }
    return of(vendor);
  }

  deleteVendor(id: number): Observable<void> {
    const index = this.vendors.findIndex(v => v.id === id);
    if (index > -1) {
      this.vendors.splice(index, 1);
    }
    return of(undefined);
  }
}
