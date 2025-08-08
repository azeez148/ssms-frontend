import { Product } from '../../product/data/product-model';
import { Category } from '../../category/data/category-model';
import { Customer } from '../../customer/data/customer.model';

export interface EventOffer {
  id: number;
  name: string;
  description: string;
  type: 'event' | 'offer';
  isActive: boolean;
  products: Product[];
  categories: Category[];
  startDate: string;
  endDate: string;
  rateType: 'flat' | 'percentage';
  rate: number;
}

export interface Participant {
  id: number;
  customer: Customer;
  eventOffer: EventOffer;
  isWinner: boolean;
}
