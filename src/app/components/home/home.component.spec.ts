import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './home.component';
import { HomeService } from './services/home.service';
import { ProductService } from '../product/services/product.service';
import { SaleService } from '../sale/services/sale.service';
import { PurchaseService } from '../purchase/services/purchase.service';
import { SaleDialogComponent } from '../sale/sale-dialog/sale-dialog.component';
import { PurchaseDialogComponent } from '../purchase/purchase-dialog/purchase-dialog.component';
import { DashboardData } from './data/dashboard.model';
import { Product } from '../product/data/product-model';
import { Sale } from '../sale/data/sale-model';
import { Purchase } from '../purchase/data/purchase-model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let homeService: HomeService;
  let productService: ProductService;
  let saleService: SaleService;
  let purchaseService: PurchaseService;
  let dialog: MatDialog;

  const mockDashboardData: DashboardData = {
    total_sales: { total_count: 10, total_revenue: 2000, total_items_sold: 15 },
    total_products: 50,
    total_categories: 5,
    most_sold_items: {},
    recent_sales: [],
    total_purchases: { total_count: 5, total_cost: 1000, total_items_purchased: 10 },
    recent_purchases: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        HomeService,
        ProductService,
        SaleService,
        PurchaseService,
        MatDialog,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    homeService = TestBed.inject(HomeService);
    productService = TestBed.inject(ProductService);
    saleService = TestBed.inject(SaleService);
    purchaseService = TestBed.inject(PurchaseService);
    dialog = TestBed.inject(MatDialog);

    spyOn(homeService, 'getDashboardData').and.returnValue(of(mockDashboardData));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', () => {
    expect(homeService.getDashboardData).toHaveBeenCalled();
    expect(component.dashboardData).toEqual(mockDashboardData);
  });

  it('should open sale dialog, add sale, and reload data', () => {
    const mockProducts: Product[] = [];
    const mockSaleResult: Sale = {} as Sale;

    spyOn(productService, 'getProducts').and.returnValue(of(mockProducts));
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(mockSaleResult),
    } as any);
    spyOn(saleService, 'addSale').and.returnValue(of(mockSaleResult));
    spyOn(component, 'loadDashboardData');

    component.openSaleDialog();

    expect(productService.getProducts).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalledWith(SaleDialogComponent, {
      width: '80%',
      data: mockProducts,
    });
    expect(saleService.addSale).toHaveBeenCalledWith(mockSaleResult);
    expect(component.loadDashboardData).toHaveBeenCalled();
  });

  it('should open purchase dialog, add purchase, and reload data', () => {
    const mockProducts: Product[] = [];
    const mockPurchaseResult: Purchase = {} as Purchase;

    spyOn(productService, 'getProducts').and.returnValue(of(mockProducts));
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(mockPurchaseResult),
    } as any);
    spyOn(purchaseService, 'addPurchase').and.returnValue(of(mockPurchaseResult));
    spyOn(component, 'loadDashboardData');

    component.openPurchaseDialog();

    expect(productService.getProducts).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalledWith(PurchaseDialogComponent, {
      width: '80%',
      data: mockProducts,
    });
    expect(purchaseService.addPurchase).toHaveBeenCalledWith(mockPurchaseResult);
    expect(component.loadDashboardData).toHaveBeenCalled();
  });
});
