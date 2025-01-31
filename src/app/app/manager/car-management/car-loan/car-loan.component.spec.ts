import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarLoanComponent } from './car-loan.component';

describe('CarLoanComponent', () => {
  let component: CarLoanComponent;
  let fixture: ComponentFixture<CarLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
