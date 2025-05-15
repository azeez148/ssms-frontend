import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeDetailComponent } from './attribute-detail.component';

describe('AttributeDetailComponent', () => {
  let component: AttributeDetailComponent;
  let fixture: ComponentFixture<AttributeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
