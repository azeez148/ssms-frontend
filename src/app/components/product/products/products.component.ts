import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../data/product-model';
import { ProductService } from '../services/product.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UpdateQuantityDialogComponent } from '../update-quantity-dialog/update-quantity-dialog.component'; // Create this component
import { UpdateImageDialogComponent } from '../update-image-dialog/update-image-dialog.component';
import { ProductDetailDialogComponent } from '../product-detail-dialog/product-detail-dialog.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'category', 'updateQuantity', 'updateImage', 'updateWhatsappGroup', 'viewDetails'];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.dataSource.data = products;
      this.dataSource.paginator = this.paginator;
    });
  }

  createProduct(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      maxWidth: '1200px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(result).subscribe(newProduct => {
          this.dataSource.data = [...this.dataSource.data, newProduct];
          this.dataSource.paginator = this.paginator; // Reassign paginator to trigger change detection
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
        const { productId, sizeMap } = updatedProduct;  // Destructure the returned data

        // Now call the service method to update the product on the backend or data layer
        this.productService.updateProductQuantity(productId, sizeMap).subscribe(response => {
          // Handle the response (e.g., update the UI, show a success message, etc.)
          console.log('Product quantity updated successfully', response);

          // Optionally, refresh the product list or handle local state update
          // You could use this.productService.getProducts() again to refresh the data
        });
      }
    });
  }

  // Open the Update Image Dialog and handle the multiple image upload
  openUpdateImageDialog(product: Product): void {
    const dialogRef = this.dialog.open(UpdateImageDialogComponent, {
      width: '600px',
      data: { product }
    });

    dialogRef.afterClosed().subscribe(selectedImages => {
      if (selectedImages && selectedImages.length > 0) {
        this.productService.uploadProductImages(product.id, selectedImages).subscribe(response => {
          console.log('Product images updated successfully', response);
        });
      }
    });
  }

  openUpdateWhatsappGroup(product: Product): void {

const sizes = product.sizeMap
  .map(item => `${item.size} (${item.quantity})`)
  .join(', ');
  const message = encodeURIComponent(`New ${product.category.name} Added.
  *${product.name}*
  Sizes Available: *${sizes}*.
  Rate: *₹${product.sellingPrice}*.
  DM 8089325733 for orders.`);
    // Replace the phone number with your WhatsApp number
    const url = `https://api.whatsapp.com/send?phone=+918089325733&text=${message}`;
    window.open(url, '_blank');
  }

  viewDetails(product: any): void {
    const dialogRef = this.dialog.open(ProductDetailDialogComponent, {
      width: '600px',
      // Pass the sale details as data
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result if needed, e.g., update the product list or show a message
        console.log('Dialog closed with result:', result);

        const updatedProductData = {
          id: result.id,
          unitPrice: result.unitPrice,
          sellingPrice: result.sellingPrice,
          isActive: result.isActive,
          canListed: result.canListed
        };

        result = updatedProductData;

        this.productService.updateProduct(result).subscribe(updatedProduct => {
          this.dataSource.data = [];
          this.productService.getProducts().subscribe(products => {
            this.dataSource.data = products;
            this.dataSource.paginator = this.paginator;
          });
        });
      }
    });


  }
}
