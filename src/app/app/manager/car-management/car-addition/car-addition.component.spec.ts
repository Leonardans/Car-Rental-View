import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAdditionComponent } from './car-addition.component';

describe('CarAdditionComponent', () => {
  let component: CarAdditionComponent;
  let fixture: ComponentFixture<CarAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarAdditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
