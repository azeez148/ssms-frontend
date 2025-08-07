import { Category } from "../../category/data/category-model";

export interface ProductSize {
  size: string;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: Category;
  categoryId: number; // Added to match the backend structure
  sizeMap: ProductSize[];  // Changed from object to array
  unitPrice: number;
  sellingPrice: number;
  imageUrl?: string; // Optional field for product image URL
  isActive: boolean;
  canListed: boolean;
}

export interface Quantities {
  size?: string | number;
  sizes?: string[];
  [key: string]: string | number | string[] | undefined; // This allows dynamic keys to be added
}