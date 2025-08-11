import { Component, OnInit } from '@angular/core';
import { Product } from '../components/product/data/product-model';
import { Category } from '../components/category/data/category-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomerHomeService } from './services/customer-view.service';
import { environment } from 'src/environment';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgxPaginationModule,
  ],
})
export class CustomerHomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  searchName: string = '';
  selectedCategory: string = ''; // Changed to string to handle category name
  p: number = 1; // current page for pagination

  // Property to store the product selected for purchase
  selectedProduct: Product | null = null;
  // New property for the selected size
  selectedSize: string = '';

  constructor(private customerHomeService: CustomerHomeService) { }

  ngOnInit(): void {
    this.customerHomeService.getHomeData().subscribe(data => {
      this.products = data.products.filter(product => product.canListed === true);

      // Extract unique categories from the products
const categoryMap = new Map<string, Category>();
      // this.products.forEach(product => {        
      //   if (product.category) {
      //     categoryMap.set(product.category.id, product.category);
      //   }
      // });


      this.products.forEach(product => {
        const category = product.category;
        if (category && category.name) {
          // Use category name as the unique key
          if (!categoryMap.has(category.name)) {
            // Assign a random ID (e.g., between 1000–9999) to each unique category
            const randomId = Math.floor(Math.random() * 9000) + 1000;
            categoryMap.set(category.name, {
              id: randomId,
              name: category.name,
              description: category.description || ''
            });
          }
        }
      });
      this.categories = Array.from(categoryMap.values());

      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchName = product.name.toLowerCase().includes(this.searchName.toLowerCase());
      const matchCategory = this.selectedCategory
        ? product.category.name === this.selectedCategory
        : true;
      return matchName && matchCategory;
    });
    this.p = 1; // reset pagination when filters change
  }

  openBuyModal(product: Product): void {
    this.selectedProduct = product;
    // Reset the size selection when modal opens
    this.selectedSize = '';
  }

  closeBuyModal(): void {
    this.selectedProduct = null;
    this.selectedSize = '';
  }

  orderViaWhatsApp(product: Product): void {
    if (!this.selectedSize) {
      alert('Please select a size before ordering.');
      return;
    }

    let messageBody = `Hello, I would like to order ${product.name} with selected size ${this.selectedSize} at ${product.sellingPrice}.`;

    if (product.imageUrl) {
      const imageUrl = `${environment.apiUrl}/${product.imageUrl}`;
      messageBody += `\nImage: ${imageUrl}`;
    }

    const message = encodeURIComponent(messageBody);
    const url = `https://api.whatsapp.com/send?phone=+918089325733&text=${message}`;
    window.open(url, '_blank');
    this.closeBuyModal();
  }
}