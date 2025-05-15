import { Product } from "../../product/data/product-model";

// export interface SaleItem {
//   product: Product;          // The product involved in the sale
//   quantity: number;          // Quantity of the product in this sale
//   unitPrice: number;         // Unit price of the product at the time of sale
//   totalPrice: number;        // Total price for this particular product (quantity * unitPrice)
// }

export interface PaymentType {
    id: number;
    name: string;
    description: string;
  }

  export interface DeliveryType {
    id: number;
    name: string;
    description: string;
  }

export interface SaleItem {
    productId: number;        // The product involved in the sale 
    productName: string;        // The product involved in the sale 
    productCategory: string;        // The product involved in the sale 
    size: string;             // The size of the product
    quantityAvailable: number; // Quantity of that size available
    quantity: number;         // Quantity of the product in this sale
    salePrice: number;        // Unit price of the product at the time of sale
    totalPrice: number;       // Total price for this particular product (quantity * unitPrice)
  }
  

export interface Sale {
  id: number;                // Unique sale ID
  customerName: string;      // Customer's name
  customerAddress: string;   // Customer's address
  customerMobile: string;    // Customer's mobile number
  date: string;              // The date when the sale was made
  saleItems: SaleItem[];     // List of products in the sale, each with quantity and total price
  totalQuantity: number;     // Total quantity of items sold across all products
  totalPrice: number;        // Total price of all products in this sale
  paymentType: PaymentType;  // Payment type used for the sale
  paymentReferenceNumber: string;         // Payment reference number (e.g., transaction ID)
  deliveryType: DeliveryType; // Delivery type for the sale
}

  