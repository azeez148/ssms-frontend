import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateImageDialogComponent } from './update-image-dialog.component';

describe('UpdateImageDialogComponent', () => {
  let component: UpdateImageDialogComponent;
  let fixture: ComponentFixture<UpdateImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateImageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
