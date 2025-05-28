import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDetailsDialogComponent } from './purchase-details-dialog.component';

describe('PurchaseDetailsDialogComponent', () => {
  let component: PurchaseDetailsDialogComponent;
  let fixture: ComponentFixture<PurchaseDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
