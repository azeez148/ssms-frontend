import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PurchaseDialogComponent } from './purchase-dialog.component';
import { PurchaseService } from '../services/purchase.service';
import { VendorService } from '../../vendor/services/vendor.service';
import { CategoryService } from '../../category/services/category.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PurchaseDialogComponent', () => {
  let component: PurchaseDialogComponent;
  let fixture: ComponentFixture<PurchaseDialogComponent>;
  let purchaseService: PurchaseService;
  let vendorService: VendorService;
  let categoryService: CategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseDialogComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        PurchaseService,
        VendorService,
        CategoryService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseDialogComponent);
    component = fixture.componentInstance;
    purchaseService = TestBed.inject(PurchaseService);
    vendorService = TestBed.inject(VendorService);
    categoryService = TestBed.inject(CategoryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    const categories = [{ id: 1, name: 'Category 1', description: '' }];
    spyOn(categoryService, 'getCategories').and.returnValue(of(categories));
    component.ngOnInit();
    expect(component.categories).toEqual(categories);
  });

  it('should filter by search term', () => {
    component.purchaseItems = [
      { productName: 'Apple', productCategory: 'Fruit' },
      { productName: 'Banana', productCategory: 'Fruit' },
      { productName: 'Carrot', productCategory: 'Vegetable' },
    ] as any[];
    component.applyFilter({ target: { value: 'Apple' } } as any);
    expect(component.filteredPurchaseItems.length).toBe(1);
    expect(component.filteredPurchaseItems[0].productName).toBe('Apple');
  });

  it('should filter by category', () => {
    component.purchaseItems = [
      { productName: 'Apple', productCategory: 'Fruit' },
      { productName: 'Banana', productCategory: 'Fruit' },
      { productName: 'Carrot', productCategory: 'Vegetable' },
    ] as any[];
    component.applyFilter({ value: 'Fruit' } as any);
    expect(component.filteredPurchaseItems.length).toBe(2);
  });

  it('should filter by search term and category', () => {
    component.purchaseItems = [
      { productName: 'Apple', productCategory: 'Fruit' },
      { productName: 'Banana', productCategory: 'Fruit' },
      { productName: 'Carrot', productCategory: 'Vegetable' },
    ] as any[];
    component.searchTerm = 'Apple';
    component.applyFilter({ value: 'Fruit' } as any);
    expect(component.filteredPurchaseItems.length).toBe(1);
    expect(component.filteredPurchaseItems[0].productName).toBe('Apple');
  });

  it('should reset paginator on filter', () => {
    spyOn(component.paginator, 'firstPage');
    component.applyFilter({ target: { value: 'test' } } as any);
    expect(component.paginator.firstPage).toHaveBeenCalled();
  });

  it('should update pagination', () => {
    component.filteredPurchaseItems = [
      { productName: 'Apple', productCategory: 'Fruit' },
      { productName: 'Banana', productCategory: 'Fruit' },
      { productName: 'Carrot', productCategory: 'Vegetable' },
    ] as any[];
    component.pageIndex = 1;
    component.pageSize = 1;
    component.updatePagination();
    expect(component.filteredPurchaseItems.length).toBe(1);
    expect(component.filteredPurchaseItems[0].productName).toBe('Banana');
  });
});
