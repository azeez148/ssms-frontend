import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Product } from '../data/product-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) {}

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/addProduct`, product).pipe(
      tap((newProduct: Product) => {
        this.getProducts().subscribe();  // Call getProducts on tap
      })
    );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/updateProduct`, product).pipe(
      tap((updatedProduct: Product) => {
        this.getProducts().subscribe();  // Call getProducts on tap
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`).pipe(
      tap((products: Product[]) => {
        this.products = products;
      })
    );
  }

  updateProductQuantity(productId: string, sizeMap: any): Observable<Product> {
    const payload = {
      productId: productId,
      sizeMap: sizeMap  // Send the sizeMap as part of the request payload
    };
    return this.http.post<Product>(`${this.apiUrl}/updateSizeMap`, payload).pipe(
      tap((newProduct: Product) => {
        this.getProducts().subscribe();  // Call getProducts on tap
      })
    );
  }

  getFilteredProducts(categoryId: number | null, productNameFilter: string): Observable<Product[]> {
    const payload = {
      categoryId: categoryId,
      productNameFilter: productNameFilter
    };
  
    return this.http.post<Product[]>(`${this.apiUrl}/filterProducts`, payload).pipe(
      tap((products: Product[]) => {
        this.products = products;  // Update the internal products array with the filtered products
      })
    );
  }

  // Upload multiple product images to the server
  uploadProductImages(productId: number, images: File[]): Observable<any> {
    const formData = new FormData();
    
    // Append productId to the formData payload
    formData.append('productId', productId.toString());

    // Append each image file to the formData
    images.forEach(image => {
      formData.append('images', image, image.name);
    });

    // POST request to upload the images with a tap to refresh the products
    return this.http.post<any>(`${this.apiUrl}/upload-images`, formData).pipe(
      tap(() => {
        this.getProducts().subscribe();
      })
    );
  }

  // updateWhatsappGroup create a function to call the API to update the WhatsApp group
  updateWhatsappGroup(productId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-whatsapp-group`, { productId });
  }

    // New method to get product image as Blob.
  getProductImage(productId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${productId}/image`, { responseType: 'blob' });
  }
}