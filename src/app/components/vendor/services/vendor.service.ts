import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Vendor } from '../data/vendor.model';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = environment.apiUrl + '/vendors';
  private vendors: Vendor[] = [
    { id: 1, name: 'Vendor A', address: '789 Vendor St', mobile: '555-1111', email: 'vendor.a@example.com' },
    { id: 2, name: 'Vendor B', address: '101 Vendor Ave', mobile: '555-2222', email: 'vendor.b@example.com' }
  ];
  private nextId = 3;

  constructor(private http: HttpClient) {}

  getVendors(): Observable<Vendor[]> {
    return of(this.vendors);
  }

  getVendor(id: number): Observable<Vendor> {
    const vendor = this.vendors.find(v => v.id === id);
    return of(vendor as Vendor);
  }

  createVendor(vendor: Vendor): Observable<Vendor> {
    vendor.id = this.nextId++;
    this.vendors.push(vendor);
    return of(vendor);
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
