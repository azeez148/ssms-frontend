import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
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
    map((products: any[]) => {
      return products.map(product => ({
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
    }),tap((products: Product[]) => {
        this.products = products;
      })
    );
  }

  updateProductQuantity(productId: string, sizeMap: any): Observable<Product> {
    const payload = {
      product_id: productId,
      size_map: sizeMap  // Send the sizeMap as part of the request payload
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

  return this.http.post<any[]>(`${this.apiUrl}/filterProducts`, payload).pipe(
    map((products: any[]) => {
      return products.map(product => ({
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
    }),
    tap((products: Product[]) => {
      this.products = products;
    })
  );
}

  // Upload multiple product images to the server
  uploadProductImages(productId: number, images: File[]): Observable<any> {
    const formData = new FormData();

    // Append each image file to the formData
    images.forEach(image => {
      formData.append('images', image, image.name);
    });

    // POST request to upload the images with a tap to refresh the products
    return this.http.post<any>(`${this.apiUrl}/upload-images?product_id=${productId}`, formData).pipe(
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