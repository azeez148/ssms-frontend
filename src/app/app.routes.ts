import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProductsComponent } from './components/product/products/products.component';
import { CategoriesComponent } from './components/category/categories/categories.component';
import { AttributesComponent } from './components/attribute/attributes/attributes.component';
import { ShopsComponent } from './components/shop/shops/shops.component';
import { PricelistsComponent } from './components/pricelist/pricelists/pricelists.component';
import { StocksComponent } from './components/stock/stocks/stocks.component';
import { SalesComponent } from './components/sale/sales/sales.component';
import { PurchasesComponent } from './components/purchase/purchases/purchases.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'stock', component: StocksComponent },
    { path: 'sale', component: SalesComponent },
    { path: 'purchase', component: PurchasesComponent },

    { path: 'products', component: ProductsComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'attributes', component: AttributesComponent },
    { path: 'shops', component: ShopsComponent },
    { path: 'pricelists', component: PricelistsComponent },

    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },

  ];
