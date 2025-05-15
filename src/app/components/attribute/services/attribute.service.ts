import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Attribute, AttributeValue } from '../data/attribute-model';
import { environment } from '../../../../environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private attributes: Attribute[] = [];
  private attributeValues: AttributeValue[] = [];
  private apiUrl = environment.apiUrl + '/attributes';  // Ensure this is set correctly



  constructor(private http: HttpClient) { }

  addAttribute(attribute: Attribute): Observable<Attribute[]> {
    const attributeList = attribute.values.map(value => ({
      name: attribute.name,
      description: attribute.description,
      value: value,
      categoryId: attribute.category
    }));
    console.log('attributeList', attributeList);

    return this.http.post<Attribute[]>(this.apiUrl + '/addAttributes', attributeList).pipe(
      tap(() => {
      this.getAttributes().subscribe();  // Call getAttributes on tap
      })
    );
  }

  addAttributeValue(attributeValue: AttributeValue): Observable<AttributeValue> {
    attributeValue.id = this.attributeValues.length + 1;
    this.attributeValues.push(attributeValue);
    return of(attributeValue);
  }

  getAttributes(): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(`${this.apiUrl}/all`).pipe(
      tap((attributes: Attribute[]) => {
        this.attributes = attributes;
      })
    );
  }

}
