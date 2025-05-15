import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItemDialogComponent } from './sale-item-dialog.component';

describe('SaleItemDialogComponent', () => {
  let component: SaleItemDialogComponent;
  let fixture: ComponentFixture<SaleItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
