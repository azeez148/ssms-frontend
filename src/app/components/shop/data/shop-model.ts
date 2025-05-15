export interface Shop {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  mobileNumber: string;
  email: string;
}

export const SHOP_DATA: Shop[] = [
  {
    id: 1,
    name: 'Shop 1',
    addressLine1: 'Address Line 1-1',
    addressLine2: 'Address Line 1-2',
    city: 'City 1',
    state: 'State 1',
    country: 'Country 1',
    zipcode: 'Zipcode 1',
    mobileNumber: '1234567890',
    email: 'shop1@example.com'
  },
  {
    id: 2,
    name: 'Shop 2',
    addressLine1: 'Address Line 2-1',
    addressLine2: 'Address Line 2-2',
    city: 'City 2',
    state: 'State 2',
    country: 'Country 2',
    zipcode: 'Zipcode 2',
    mobileNumber: '0987654321',
    email: 'shop2@example.com'
  },
  // Add more shops as needed
];