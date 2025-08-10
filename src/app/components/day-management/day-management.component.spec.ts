import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayManagementComponent } from './day-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

describe('DayManagementComponent', () => {
  let component: DayManagementComponent;
  let fixture: ComponentFixture<DayManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        DayManagementComponent
      ],
      providers: [
        provideMockStore({ initialState: {} })
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
