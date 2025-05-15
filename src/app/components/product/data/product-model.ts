import { Category } from "../../category/data/category-model";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: Category;
  sizeMap: { [key: string]: number }; // e.g., {"S": 10, "M": 5, "L": 3}
  unitPrice: number;
  sellingPrice: number;
}

// export const PRODUCT_DATA: Product[] = [
//   {id: 1, name: 'Product 1', description: 'Description 1', category: {id: 1, name: 'Category 1', description: 'Category Description 1'} },
//   {id: 2, name: 'Product 2', description: 'Description 2', category: {id: 2, name: 'Category 2', description: 'Category Description 2'}},
//   // Add more products as needed
// ];

export interface Quantities {
  size?: string | number;
  sizes?: string[];
  [key: string]: string | number | string[] | undefined; // This allows dynamic keys to be added
}