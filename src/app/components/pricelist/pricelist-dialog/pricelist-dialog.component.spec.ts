import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistDialogComponent } from './pricelist-dialog.component';

describe('PricelistDialogComponent', () => {
  let component: PricelistDialogComponent;
  let fixture: ComponentFixture<PricelistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricelistDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricelistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
