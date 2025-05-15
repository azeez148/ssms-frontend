import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAttributeDialogComponent } from './assign-attribute-dialog.component';

describe('AssignAttributeDialogComponent', () => {
  let component: AssignAttributeDialogComponent;
  let fixture: ComponentFixture<AssignAttributeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignAttributeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignAttributeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
