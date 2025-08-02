import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SaleDialogComponent } from './sale-dialog.component';
import { SaleService } from '../services/sale.service';
import { CustomerService } from '../../customer/services/customer.service';
import { CategoryService } from '../../category/services/category.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SaleDialogComponent', () => {
  let component: SaleDialogComponent;
  let fixture: ComponentFixture<SaleDialogComponent>;
  let saleService: SaleService;
  let customerService: CustomerService;
  let categoryService: CategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDialogComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        SaleService,
        CustomerService,
        CategoryService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleDialogComponent);
    component = fixture.componentInstance;
    saleService = TestBed.inject(SaleService);
    customerService = TestBed.inject(CustomerService);
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
    component.saleItems = [
      { productName: 'Apple', productCategory: 'Fruit' },
      { productName: 'Banana', productCategory: 'Fruit' },
      { productName: 'Carrot', productCategory: 'Vegetable' },
    ] as any[];
    component.applyFilter({ target: { value: 'Apple' } } as any);
    expect(component.filteredSaleItems.length).toBe(1);
    expect(component.filteredSaleItems[0].productName).toBe('Apple');
  });

  it('should filter by category', () => {
    component.saleItems = [
      { productName: 'Apple', productCategory: 'Fruit' },
      { productName: 'Banana', productCategory: 'Fruit' },
      { productName: 'Carrot', productCategory: 'Vegetable' },
    ] as any[];
    component.applyFilter({ value: 'Fruit' } as any);
    expect(component.filteredSaleItems.length).toBe(2);
  });

  it('should filter by search term and category', () => {
    component.saleItems = [
      { productName: 'Apple', productCategory: 'Fruit' },
      { productName: 'Banana', productCategory: 'Fruit' },
      { productName: 'Carrot', productCategory: 'Vegetable' },
    ] as any[];
    component.searchTerm = 'Apple';
    component.applyFilter({ value: 'Fruit' } as any);
    expect(component.filteredSaleItems.length).toBe(1);
    expect(component.filteredSaleItems[0].productName).toBe('Apple');
  });
});
