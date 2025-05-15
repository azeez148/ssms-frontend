import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = environment.apiUrl + '/stock';

  constructor(private http: HttpClient) {}

  uploadExcel(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/uploadExcel`, formData);
  }
}