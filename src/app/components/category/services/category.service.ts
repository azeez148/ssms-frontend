import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Category } from '../data/category-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [];
  private apiUrl = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) {}

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/addCategory`, category).pipe(
      tap((newCategory: Category) => {
        this.getCategories().subscribe();  // Call getShops on tap
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/all`).pipe(
      tap((categories: Category[]) => {
        this.categories = categories;
      })
    );
  }
}
