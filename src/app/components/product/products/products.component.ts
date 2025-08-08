import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../data/product-model';
import { ProductService } from '../services/product.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { CommonModule } from '@angular/common';
import { UpdateQuantityDialogComponent } from '../update-quantity-dialog/update-quantity-dialog.component';
import { UpdateImageDialogComponent } from '../update-image-dialog/update-image-dialog.component';
import { ProductDetailDialogComponent } from '../product-detail-dialog/product-detail-dialog.component';
import { Category } from '../../category/data/category-model';
import { CategoryService } from '../../category/services/category.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  p: number = 1;
  categories: Category[] = [];

  constructor(public dialog: MatDialog, private productService: ProductService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.loadProducts();
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.products = products;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.products = this.allProducts.filter(product => product.name.toLowerCase().includes(filterValue));
  }

  filterByCategory(event: any) {
    const categoryId = event.target.value;
    if (categoryId === 'all') {
      this.products = this.allProducts;
    } else {
      this.products = this.allProducts.filter(p => p.categoryId === +categoryId);
    }
  }

  createProduct(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      maxWidth: '1200px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(result).subscribe(newProduct => {
          this.loadProducts();
        });
      }
    });
  }

  openUpdateQuantityDialog(product: Product): void {
    const dialogRef = this.dialog.open(UpdateQuantityDialogComponent, {
      width: '800px',
      data: { product }
    });

    dialogRef.afterClosed().subscribe(updatedProduct => {
      if (updatedProduct) {
        const { productId, sizeMap } = updatedProduct;
        this.productService.updateProductQuantity(productId, sizeMap).subscribe(response => {
          console.log('Product quantity updated successfully', response);
          this.loadProducts();
        });
      }
    });
  }

  openUpdateImageDialog(product: Product): void {
    const dialogRef = this.dialog.open(UpdateImageDialogComponent, {
      width: '600px',
      data: { product }
    });

    dialogRef.afterClosed().subscribe(selectedImage => {
      if (selectedImage) {
        this.productService.uploadProductImages(product.id, selectedImage).subscribe(response => {
          console.log('Product images updated successfully', response);
        });
      }
    });
  }

  openUpdateWhatsappGroup(product: Product): void {
    const sizes = product.sizeMap
      .map(item => `${item.size} (${item.quantity})`)
      .join(', ');
    const message = encodeURIComponent(`New ${product.category.name} Added.\n*${product.name}*\nSizes Available: *${sizes}*.\nRate: *₹${product.sellingPrice}*.\nDM 8089325733 for orders.`);
    const url = `https://api.whatsapp.com/send?phone=+918089325733&text=${message}`;
    window.open(url, '_blank');
  }

  viewDetails(product: any): void {
    const dialogRef = this.dialog.open(ProductDetailDialogComponent, {
      width: '600px',
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedProductData = {
          id: result.id,
          unitPrice: result.unitPrice,
          sellingPrice: result.sellingPrice,
          isActive: result.isActive,
          canListed: result.canListed
        };
        this.productService.updateProduct(updatedProductData).subscribe(updatedProduct => {
          this.loadProducts();
        });
      }
    });
  }
}
