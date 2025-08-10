import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerHomeComponent } from './customer-home.component';
import { CustomerHomeService } from './services/customer-view.service';
import { of } from 'rxjs';
import { Product } from '../components/product/data/product-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from 'src/environment';

describe('CustomerHomeComponent', () => {
  let component: CustomerHomeComponent;
  let fixture: ComponentFixture<CustomerHomeComponent>;
  let customerHomeService: jasmine.SpyObj<CustomerHomeService>;

  beforeEach(async () => {
    const customerHomeServiceSpy = jasmine.createSpyObj('CustomerHomeService', ['getHomeData']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
        NgxPaginationModule,
        CustomerHomeComponent
      ],
      providers: [
        { provide: CustomerHomeService, useValue: customerHomeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerHomeComponent);
    component = fixture.componentInstance;
    customerHomeService = TestBed.inject(CustomerHomeService) as jasmine.SpyObj<CustomerHomeService>;

    // Mock the getHomeData method
    const mockProducts: Product[] = [];
    customerHomeService.getHomeData.and.returnValue(of({ products: mockProducts }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open WhatsApp with correct message including image URL', () => {
    const mockProduct: Product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      category: { id: 1, name: 'Test Category', description: '' },
      categoryId: 1,
      sizeMap: [{ size: 'M', quantity: 10 }],
      unitPrice: 100,
      sellingPrice: 150,
      imageUrl: 'test-image.jpg',
      isActive: true,
      canListed: true,
      offerId: '',
      discountedPrice: 0,
      offerPrice: 0
    };

    component.selectedSize = 'M';
    spyOn(window, 'open').and.stub();

    component.orderViaWhatsApp(mockProduct);

    const expectedImageUrl = `${environment.apiUrl}/${mockProduct.imageUrl}`;
    const message = encodeURIComponent(`Hello, I would like to order ${mockProduct.name} with selected size M at ${mockProduct.sellingPrice}.\nImage: ${expectedImageUrl}`);
    const expectedUrl = `https://api.whatsapp.com/send?phone=+918089325733&text=${message}`;

    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank');
  });
});
