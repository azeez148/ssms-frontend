import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { HomeService } from './services/home.service';
import { DashboardData } from './data/dashboard.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let homeService: HomeService;

  const mockDashboardData: DashboardData = {
    total_sales: {
      total_count: 10,
      total_revenue: 2000,
      total_items_sold: 15,
    },
    total_products: 50,
    total_categories: 5,
    most_sold_items: {
      '1': {
        product_name: 'Test Product',
        product_category: 'Test Category',
        total_quantity: 5,
        total_revenue: 500,
      },
    },
    recent_sales: [
      {
        id: 1,
        customer_name: 'Test Customer',
        customer_address: '123 Test St',
        customer_mobile: '123-456-7890',
        date: '2025-01-01',
        total_quantity: 2,
        total_price: 200,
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
      providers: [HomeService],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    homeService = TestBed.inject(HomeService); // Get the service instance

    // Spy on the service method and return mock data
    spyOn(homeService, 'getDashboardData').and.returnValue(of(mockDashboardData));

    fixture.detectChanges(); // This will trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', () => {
    // The spy is set up in beforeEach, and ngOnInit is called by detectChanges.
    // So, the data should be loaded by the time this test runs.
    expect(homeService.getDashboardData).toHaveBeenCalled();
    expect(component.dashboardData).toEqual(mockDashboardData);
  });
});
