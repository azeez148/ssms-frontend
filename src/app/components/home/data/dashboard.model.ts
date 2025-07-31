

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

  export interface RecentSale {
      id: number;
      customer_name: string;
      customer_address: string;
      customer_mobile: string;
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
  }