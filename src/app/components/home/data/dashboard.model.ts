

export interface TotalSales {
    total_count: number;
    total_revenue: number;
    total_items_sold: number;
}

export interface MostSoldItems {
    [key: string]: {
        product_name: string;
        product_category: string;
        total_quantity: number;
        total_revenue: number;
    };
}

export interface Customer {
    name: string;
    address: string;
    mobile: string;
    email: string;
    id: number;
}

export interface RecentSale {
    id: number;
    customer: Customer;
    date: string;
    total_quantity: number;
    total_price: number;
}

export interface TotalPurchases {
    total_count: number;
    total_cost: number;
    total_items_purchased: number;
}

export interface Vendor {
    name: string;
    address: string;
    mobile: string;
    email: string;
    id: number;
}

export interface RecentPurchase {
    id: number;
    vendor: Vendor;
    date: string;
    total_quantity: number;
    total_price: number;
}

export interface DashboardData {
    total_sales: TotalSales;
    total_products: number;
    total_categories: number;
    most_sold_items: MostSoldItems;
    recent_sales: RecentSale[];
    total_purchases: TotalPurchases;
    recent_purchases: RecentPurchase[];
}